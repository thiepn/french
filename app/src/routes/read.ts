import type { RouteContext } from '../core/types';
import { loadStableReadingPack,loadVocabularySearchIndex,type ReadingItem,type VocabularySearchRow } from '../core/content/loader';
import { readAllSrsRecords,readCanonicalLearnerState,recordPracticeEvidence,replaceCanonicalFeatureState } from '../core/learner/repository';
import type { CanonicalSrsRecordV1 } from '../core/learner/model';
import { retrievability } from '../core/learner/scheduler';
import {analyzeOpenWorld,appendOpenWorldExposure,normalizeOpenWorldHistory,sanitizeOpenWorldText,openWorldTokens,OPEN_WORLD_MAX_FILE_BYTES,OPEN_WORLD_MIN_WORDS} from '../core/learner/open-world';

type Mode='extensive'|'intensive'|'targeted';
type Feel=''|'easy'|'comfortable'|'challenging'|'hard';
interface ReadingHistory{
  startedAt:number;lastOpenedAt:number;completedAt:number;completionCount:number;position:number;
  mode:Mode;feel:Feel;questionAttempts:number;questionCorrect:number;
}
interface SavedDiscovery{surface:string;coreId:string;count:number;lastSeenAt:number;textIds:string[]}
interface Exposure{count:number;lastSeenAt:number;textIds:string[]}
interface ReadingState{
  schema:1;
  history:Record<string,ReadingHistory>;
  saved:Record<string,SavedDiscovery>;
  exposures:Record<string,Exposure>;
  lookupCounts:Record<string,number>;
}
interface NoteState{introduced:boolean;known:boolean;records:CanonicalSrsRecordV1[]}
interface Coverage{mapped:number;known:number;learning:number;newCount:number;unmapped:number;knownPct:number}

const DAY=86_400_000;
function object(value:unknown):Record<string,unknown>{return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};}
function number(value:unknown,fallback=0):number{const n=Number(value);return Number.isFinite(n)?n:fallback;}
function text(value:unknown,max=500):string{return typeof value==='string'?value.slice(0,max):'';}
function normal(value:string):string{
  return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'").toLocaleLowerCase('fr')
    .replace(/[^a-z0-9' -]+/g,' ').replace(/\s+/g,' ').trim();
}
function emptyHistory():ReadingHistory{return{startedAt:0,lastOpenedAt:0,completedAt:0,completionCount:0,position:0,mode:'extensive',feel:'',questionAttempts:0,questionCorrect:0};}
function normalizeState(raw:unknown,valid:Set<string>):ReadingState{
  const source=object(raw),history:Record<string,ReadingHistory>={},saved:Record<string,SavedDiscovery>={},exposures:Record<string,Exposure>={},lookupCounts:Record<string,number>={};
  for(const [id,value] of Object.entries(object(source.history))){
    if(!valid.has(id))continue;const row=object(value),base=emptyHistory();
    const mode=['extensive','intensive','targeted'].includes(String(row.mode))?String(row.mode) as Mode:'extensive';
    const feel=['easy','comfortable','challenging','hard'].includes(String(row.feel))?String(row.feel) as Feel:'';
    history[id]={...base,startedAt:Math.max(0,number(row.startedAt)),lastOpenedAt:Math.max(0,number(row.lastOpenedAt)),completedAt:Math.max(0,number(row.completedAt)),completionCount:Math.max(0,Math.floor(number(row.completionCount))),position:Math.max(0,Math.floor(number(row.position))),mode,feel,questionAttempts:Math.max(0,Math.floor(number(row.questionAttempts))),questionCorrect:Math.max(0,Math.floor(number(row.questionCorrect)))};
  }
  for(const [key,value] of Object.entries(object(source.saved))){
    const row=object(value),clean=String(key).slice(0,120);if(!clean)continue;
    saved[clean]={surface:text(row.surface,120)||clean,coreId:text(row.coreId,220),count:Math.max(1,Math.floor(number(row.count,1))),lastSeenAt:Math.max(0,number(row.lastSeenAt)),textIds:Array.isArray(row.textIds)?row.textIds.filter(id=>typeof id==='string'&&valid.has(id)).slice(-30) as string[]:[]};
  }
  for(const [id,value] of Object.entries(object(source.exposures))){
    const row=object(value),clean=String(id).slice(0,220);if(!clean)continue;
    exposures[clean]={count:Math.max(0,Math.floor(number(row.count))),lastSeenAt:Math.max(0,number(row.lastSeenAt)),textIds:Array.isArray(row.textIds)?row.textIds.filter(textId=>typeof textId==='string'&&valid.has(textId)).slice(-30) as string[]:[]};
  }
  for(const [key,value] of Object.entries(object(source.lookupCounts)).slice(0,1000))lookupCounts[String(key).slice(0,120)]=Math.max(0,Math.floor(number(value)));
  return{schema:1,history,saved,exposures,lookupCounts};
}
function currentRecall(record:CanonicalSrsRecordV1,now:number):number{
  if(record.status==='new'||record.seen<=0)return 0;
  if(record.stability<=0)return Math.max(0,Math.min(1,record.retrievability||0));
  return retrievability(record.stability,Math.max(0,(now-record.lastReviewedAt)/DAY));
}
function tokenize(value:string):string[]{return value.match(/\p{L}+(?:['’]\p{L}+)?/gu)??[];}
function parts(value:string):Array<{text:string;word:boolean}>{
  const rows:Array<{text:string;word:boolean}>=[];const re=/\p{L}+(?:['’]\p{L}+)?/gu;let cursor=0,match:RegExpExecArray|null;
  while((match=re.exec(value))){if(match.index>cursor)rows.push({text:value.slice(cursor,match.index),word:false});rows.push({text:match[0],word:true});cursor=match.index+match[0].length;}
  if(cursor<value.length)rows.push({text:value.slice(cursor),word:false});return rows;
}
function coverageLabel(pct:number):string{return pct>=97?'Very easy':pct>=94?'Comfortable':pct>=90?'Challenging':'High support';}
function wordCount(reading:ReadingItem):number{return reading.sentences.reduce((sum,sentence)=>sum+tokenize(sentence.fr).length,0);}
function create<K extends keyof HTMLElementTagNameMap>(tag:K,value='',className=''):HTMLElementTagNameMap[K]{
  const el=document.createElement(tag);if(value)el.textContent=value;if(className)el.className=className;return el;
}

export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page read-page"><p class="eyebrow">Authentic input</p><h1>Read</h1><p class="lede">Loading the native graded-reading pack…</p></section>';
  const [pack,index,records,learner]=await Promise.all([loadStableReadingPack(signal),loadVocabularySearchIndex(signal),readAllSrsRecords(),readCanonicalLearnerState()]);
  if(signal.aborted)return;
  const validIds=new Set(pack.readings.map(reading=>reading.id));
  const state=normalizeState(learner?.featureState?.v550Reading,validIds);
  const retention=Math.min(.97,Math.max(.7,number(learner?.settings?.desiredRetention,.9)));
  const now=Date.now();

  const byNote=new Map<string,CanonicalSrsRecordV1[]>();
  for(const record of records){const list=byNote.get(record.noteId)??[];list.push(record);byNote.set(record.noteId,list);}
  const noteState=new Map<string,NoteState>();
  for(const row of index.rows){
    const noteRecords=byNote.get(row.id)??[],recognition=noteRecords.find(record=>record.skill==='recognition');
    noteState.set(row.id,{records:noteRecords,introduced:noteRecords.some(record=>record.seen>0),known:Boolean(recognition&&recognition.status==='learned'&&!recognition.suspended&&currentRecall(recognition,now)>=retention)});
  }

  const lexicon=new Map<string,VocabularySearchRow>();
  for(const row of index.rows){
    const forms=[row.word];
    if(row.article)for(const article of row.article.split('/').map(v=>v.trim()).filter(Boolean))forms.push(/['’]$/.test(article)?article+row.word:article+' '+row.word);
    for(const form of forms){const key=normal(form);if(key&&!lexicon.has(key))lexicon.set(key,row);}
  }
  const morph=new Map(Object.entries(pack.morphology).map(([form,lemma])=>[normal(form),normal(lemma)]));
  const resolve=(surface:string):VocabularySearchRow|undefined=>{
    const key=normal(surface);if(!key)return undefined;
    const direct=lexicon.get(key);if(direct)return direct;
    const stripped=key.replace(/^(?:l|d|j|t|m|s|c|n|qu)'/,'');if(stripped!==key&&lexicon.has(stripped))return lexicon.get(stripped);
    const lemma=morph.get(key);if(lemma&&lexicon.has(lemma))return lexicon.get(lemma);
    if(key.endsWith('s')&&lexicon.has(key.slice(0,-1)))return lexicon.get(key.slice(0,-1));
    if(key.endsWith('x')&&lexicon.has(key.slice(0,-1)))return lexicon.get(key.slice(0,-1));
    return undefined;
  };

  const readingNoteIds=new Map<string,Set<string>>();
  const coverageCache=new Map<string,Coverage>();
  for(const reading of pack.readings){
    const ids=new Set<string>();let mapped=0,known=0,learning=0,newCount=0,unmapped=0;
    for(const sentence of reading.sentences)for(const token of tokenize(sentence.fr)){
      const row=resolve(token);
      if(!row){unmapped++;continue;}mapped++;ids.add(row.id);const ns=noteState.get(row.id);
      if(ns?.known)known++;else if(ns?.introduced)learning++;else newCount++;
    }
    readingNoteIds.set(reading.id,ids);
    coverageCache.set(reading.id,{mapped,known,learning,newCount,unmapped,knownPct:mapped?Math.round(known/mapped*100):100});
  }

  let saveChain=Promise.resolve<unknown>(undefined);
  const queueSave=()=>{
    const snapshot=JSON.parse(JSON.stringify(state)) as ReadingState;
    saveChain=saveChain.then(()=>replaceCanonicalFeatureState('v550Reading',snapshot)).catch(error=>console.error('French reading state save failed',error));
  };
  let observer:IntersectionObserver|null=null;
  const cleanupObserver=()=>{observer?.disconnect();observer=null;};
  signal.addEventListener('abort',cleanupObserver,{once:true});


  // P21 raw personal French is deliberately page-memory-only. Never put it in
  // canonical learner state, sessionStorage, SRS, cloud snapshots or telemetry.
  let openWorldText='',openWorldSource:'paste'|'file'='paste',openWorldLookups=0;
  let openWorldHistory=normalizeOpenWorldHistory(learner?.featureState?.v5120OpenWorld);
  const openWorldResolve=(word:string):'known'|'learning'|'new'|undefined=>{
    const row=resolve(word);if(!row)return undefined;
    const info=noteState.get(row.id);
    return info?.known?'known':info?.introduced?'learning':'new';
  };
  function renderOpenWorldReader(){
    const raw=sanitizeOpenWorldText(openWorldText);
    const analysis=analyzeOpenWorld(raw,openWorldResolve);
    if(analysis.words<OPEN_WORLD_MIN_WORDS){renderLibrary();return;}
    cleanupObserver();
    openWorldLookups=0;
    const host=create('section','','page read-page open-world-reader');
    const top=create('div','','reader-bar');
    const back=create('button','← Read','text-action');back.type='button';
    back.addEventListener('click',renderLibrary);
    top.append(back,create('span','Personal French · exposure only','muted-copy'));host.append(top);
    host.append(create('h1','Read your French'),create('p',
      'This text stays in this page session. Only counts are saved after you finish; vocabulary review is never credited.','lede'));
    const stats=create('p',analysis.words+' words · '+analysis.mappedPct+'% mapped · '+analysis.knownPct+'% known','coverage-strip');
    host.append(stats);
    const layout=create('div','','reader-layout open-world-layout');
    const article=create('article','','reading-text open-world-paragraphs');
    const lookup=create('aside','','reading-lookup');
    lookup.append(create('h2','Word lookup'),create('p','Tap a word to inspect the current dictionary entry.','muted-copy'));
    for(const para of raw.replace(/\r\n?/g,'\n').split(/\n{2,}/).filter(v=>v.trim())){
      const p=create('p','','reading-fr');
      for(const part of parts(para.replace(/\s*\n\s*/g,' '))){
        if(!part.word){p.append(document.createTextNode(part.text));continue;}
        const row=resolve(part.text),kind=openWorldResolve(part.text);
        const button=create('button',part.text,'reading-token');button.type='button';
        if(row)button.classList.add(kind==='known'?'is-known':kind==='learning'?'is-learning':'is-new');
        button.addEventListener('click',()=>{
          openWorldLookups++;
          lookup.replaceChildren(create('h2',part.text),create('p',row?.meaning??'Not in the mapped core dictionary.','lookup-meaning'));
          if(row)lookup.append(create('p',row.level+' · '+(kind==='known'?'known':kind==='learning'?'learning':'not introduced'),'muted-copy'));
        });p.append(button);
      }
      article.append(p);
    }
    layout.append(article,lookup);host.append(layout);
    const finish=create('button','Finish exposure','primary-action');finish.type='button';
    const error=create('p','','muted-copy');error.setAttribute('role','status');
    finish.addEventListener('click',async()=>{
      finish.disabled=true;
      try{
        const next=appendOpenWorldExposure(openWorldHistory,analysis,openWorldSource,openWorldLookups,Date.now(),crypto.randomUUID());
        await replaceCanonicalFeatureState('v5120OpenWorld',next);
        openWorldHistory=next;openWorldText='';openWorldLookups=0;openWorldSource='paste';
        renderLibrary();
      }catch(reason){
        error.textContent='Could not save exposure. Your reading remains on this page; try again.';
        console.warn('Open-world aggregate save failed',reason);finish.disabled=false;
      }
    });
    host.append(finish,error);main.replaceChildren(host);
  }
  function renderOpenWorldEntry(){
    const panel=create('section','','data-panel open-world-entry');
    panel.append(create('h2','Bring your own French'),create('p',
      'Paste French or open a .txt/.md file. Raw content stays in this page only; backups keep aggregate counts, never your text or source title.','muted-copy'));
    const label=create('label','Personal French text','open-world-label');
    const area=create('textarea','','open-world-input');area.rows=5;area.maxLength=20_000;
    area.placeholder='Paste at least 20 French words…';area.value=openWorldText;
    area.addEventListener('input',()=>{openWorldText=sanitizeOpenWorldText(area.value);openWorldSource='paste';update();});
    label.append(area);panel.append(label);
    const actions=create('div','','open-world-controls');
    const begin=create('button','Analyze & read','primary-action');begin.type='button';
    const uploadLabel=create('label','Open .txt / .md','secondary-action');
    const upload=create('input','','open-world-file');upload.type='file';
    upload.accept='.txt,.md,text/plain,text/markdown';
    uploadLabel.append(upload);upload.addEventListener('change',async()=>{
      const file=upload.files?.[0];if(!file)return;
      if(file.size>OPEN_WORLD_MAX_FILE_BYTES||!(/\.(txt|md)$/i.test(file.name))){
        status.textContent='Only .txt or .md files of 256 KiB or less are accepted.';upload.value='';return;
      }
      try{openWorldText=sanitizeOpenWorldText(await file.text());openWorldSource='file';area.value=openWorldText;update();}
      catch{status.textContent='Could not read this text file.';}
      upload.value='';
    });
    const clear=create('button','Clear text','secondary-action');clear.type='button';
    clear.addEventListener('click',()=>{openWorldText='';openWorldSource='paste';area.value='';update();});
    const status=create('p','','muted-copy');status.setAttribute('role','status');
    const update=()=>{
      const n=openWorldTokens(openWorldText).length;
      status.textContent=n+' words in page memory · minimum '+OPEN_WORLD_MIN_WORDS+' to read';
      begin.disabled=n<OPEN_WORLD_MIN_WORDS;
    };
    begin.addEventListener('click',renderOpenWorldReader);
    actions.append(begin,uploadLabel,clear);panel.append(actions,status);update();
    const aggregate=create('p','','muted-copy');
    const count=openWorldHistory.sessions.length;
    aggregate.textContent=count+' completed personal reading'+(count===1?'':'s')+
      ' · '+openWorldHistory.sessions.reduce((n,row)=>n+row.words,0)+' words exposed; never SRS recall';
    panel.append(aggregate);
    return panel;
  }

  let level='ALL',type='ALL',selected='',mode:Mode='extensive',targetNoteId=sessionStorage.getItem('french-vnext-read-note')??'',openReadingId=sessionStorage.getItem('french-vnext-read-open')??'';
  sessionStorage.removeItem('french-vnext-read-note');
  sessionStorage.removeItem('french-vnext-read-open');

  const recommendationScore=(reading:ReadingItem):number=>{
    const coverage=coverageCache.get(reading.id)?.knownPct??0;
    const completed=Boolean(state.history[reading.id]?.completedAt);
    const containsTarget=targetNoteId&&readingNoteIds.get(reading.id)?.has(targetNoteId);
    return Math.abs(96-coverage)+(completed?5:0)+(containsTarget?-40:0)+(reading.level==='B2'?1:0);
  };
  const recommendations=()=>[...pack.readings].sort((a,b)=>recommendationScore(a)-recommendationScore(b)).slice(0,3);

  const openLookup=(reading:ReadingItem,surface:string,row?:VocabularySearchRow)=>{
    const aside=main.querySelector<HTMLElement>('[data-lookup]');if(!aside)return;
    const key=normal(surface);state.lookupCounts[key]=(state.lookupCounts[key]??0)+1;queueSave();
    aside.replaceChildren();
    aside.append(create('p','Word lookup','eyebrow'),create('h3',surface));
    if(!row){
      aside.append(create('p','No mapped core-vocabulary entry was found for this surface form. No definition is fabricated.','muted-copy'));return;
    }
    const ns=noteState.get(row.id),exposure=state.exposures[row.id];
    aside.append(create('p',row.meaning,'lookup-meaning'));
    const meta=create('p',[row.level,row.pos,ns?.known?'secure recognition':ns?.introduced?'learning':'not introduced'].filter(Boolean).join(' · '),'word-meta');aside.append(meta);
    if(exposure)aside.append(create('p',exposure.count+' completed-text exposure'+(exposure.count===1?'':'s')+' across '+exposure.textIds.length+' text'+(exposure.textIds.length===1?'':'s')+'. Exposure is not recall evidence.','muted-copy'));
    const save=create('button','Save discovery','secondary-action compact-action');
    save.type='button';save.addEventListener('click',()=>{
      const current=state.saved[key]??{surface,coreId:row.id,count:0,lastSeenAt:0,textIds:[]};
      state.saved[key]={surface,coreId:row.id,count:current.count+1,lastSeenAt:Date.now(),textIds:[...new Set([...current.textIds,reading.id])].slice(-30)};
      queueSave();save.textContent='Saved · '+state.saved[key].count+' encounter'+(state.saved[key].count===1?'':'s');
    });
    aside.append(save);
  };

  const renderReview=(reading:ReadingItem)=>{
    cleanupObserver();const history=state.history[reading.id]??emptyHistory();
    main.innerHTML='<section class="page read-page"><button class="text-action" data-library type="button">← Reading library</button><p class="eyebrow">Context retrieval</p><h1></h1><p class="lede">Answer from memory after reading. These checks are practice-only evidence and never move scheduled SRS.</p><div class="reading-review" data-review></div><section class="data-panel reading-feel"><h2>How did the text feel?</h2><div class="feel-grid" data-feel></div></section></section>';
    const title=main.querySelector('h1');if(title)title.textContent=reading.title;
    main.querySelector<HTMLButtonElement>('[data-library]')?.addEventListener('click',renderLibrary);
    const host=main.querySelector<HTMLElement>('[data-review]');const feel=main.querySelector<HTMLElement>('[data-feel]');if(!host||!feel)return;
    for(const question of reading.questions){
      const card=create('article','','question-card');card.append(create('h2',question.prompt));
      const options=create('div','','question-options');let answered=false;
      question.options.forEach((option,indexValue)=>{
        const button=create('button',option);button.type='button';
        button.addEventListener('click',async()=>{
          if(answered)return;answered=true;const correct=indexValue===question.answer;
          for(const b of options.querySelectorAll<HTMLButtonElement>('button'))b.disabled=true;
          button.classList.add(correct?'is-correct':'is-wrong');
          if(!correct)options.querySelectorAll<HTMLButtonElement>('button')[question.answer]?.classList.add('is-correct');
          history.questionAttempts++;if(correct)history.questionCorrect++;state.history[reading.id]=history;queueSave();
          const target=question.target?resolve(question.target):undefined;
          if(target)void recordPracticeEvidence({noteId:target.id,skill:'recognition',practice:'reading-context',direction:'context-fr',correct,typed:false,typedQuality:correct?'exact':'review',level:reading.level,theme:reading.topic,supportLevel:1,errorCategory:correct?'':'context-retrieval'});
          const result=create('p',(correct?'Correct. ':'Review: ')+question.options[question.answer],'question-result');card.append(result);
        });
        options.append(button);
      });
      card.append(options);host.append(card);
    }
    for(const [value,label] of [['easy','Too easy'],['comfortable','Comfortable'],['challenging','Challenging'],['hard','Too hard']] as Array<[Feel,string]>){
      const button=create('button',label);button.type='button';button.classList.toggle('is-active',history.feel===value);
      button.addEventListener('click',()=>{history.feel=value;state.history[reading.id]=history;queueSave();for(const b of feel.querySelectorAll('button'))b.classList.remove('is-active');button.classList.add('is-active');});
      feel.append(button);
    }
  };

  const finishReading=(reading:ReadingItem)=>{
    const history=state.history[reading.id]??emptyHistory();const first=!history.completedAt;
    state.history[reading.id]={...history,completedAt:history.completedAt||Date.now(),lastOpenedAt:Date.now(),completionCount:history.completionCount+1,position:0,mode};
    for(const id of readingNoteIds.get(reading.id)??[]){
      const current=state.exposures[id]??{count:0,lastSeenAt:0,textIds:[]};
      state.exposures[id]={count:current.count+1,lastSeenAt:Date.now(),textIds:[...new Set([...current.textIds,reading.id])].slice(-30)};
    }
    queueSave();renderReview(reading);
    const status=main.querySelector<HTMLElement>('[data-reading-status]');if(status)status.textContent=first?'First completion saved.':'Repeat completion saved.';
  };

  const renderReader=(reading:ReadingItem)=>{
    cleanupObserver();selected=reading.id;
    const current=state.history[reading.id]??emptyHistory();
    const history:ReadingHistory={...current,startedAt:current.startedAt||Date.now(),lastOpenedAt:Date.now(),mode};
    state.history[reading.id]=history;queueSave();
    const coverage=coverageCache.get(reading.id) as Coverage;
    const targetWords=new Set(reading.targets.flatMap(target=>tokenize(target).map(normal)));
    main.innerHTML='<section class="page read-page reader-page"><div class="reader-bar"><button class="text-action" data-close type="button">← Library</button><div class="reader-mode-tabs" data-modes></div><button class="secondary-action compact-action" data-listen-pair type="button">Listen pair</button><button class="secondary-action compact-action" data-speak-context type="button">Speak context</button><span class="reader-position" data-position></span></div><header class="reader-head"><p class="eyebrow"></p><h1></h1><p class="lede"></p><div class="coverage-strip" data-coverage></div></header><div class="reader-layout"><article class="reading-text" data-text></article><aside class="reading-lookup" data-lookup><p class="eyebrow">Word lookup</p><h3>Tap a word</h3><p class="muted-copy">Lookups and exposure stay separate from successful recall.</p></aside></div><div class="reader-finish"><button class="primary-action" data-finish type="button">Finish reading</button></div></section>';
    main.querySelector<HTMLButtonElement>('[data-close]')?.addEventListener('click',renderLibrary);
    main.querySelector<HTMLButtonElement>('[data-listen-pair]')?.addEventListener('click',()=>{
      sessionStorage.setItem('french-vnext-listen-reading',reading.id);
      sessionStorage.setItem('french-vnext-listen-return-reading',reading.id);
      navigate('listen');
    });
    main.querySelector<HTMLButtonElement>('[data-speak-context]')?.addEventListener('click',()=>{
      sessionStorage.setItem('french-vnext-speak-reading',reading.id);
      navigate('speak');
    });
    const eyebrow=main.querySelector<HTMLElement>('.reader-head .eyebrow');if(eyebrow)eyebrow.textContent=reading.level+' · '+reading.type+' · '+reading.minutes+' min · '+reading.register;
    const title=main.querySelector<HTMLElement>('.reader-head h1');if(title)title.textContent=reading.title;
    const lede=main.querySelector<HTMLElement>('.reader-head .lede');if(lede)lede.textContent=reading.sourceLabel+' · '+reading.license;
    const cov=main.querySelector<HTMLElement>('[data-coverage]');
    if(cov)cov.textContent=coverageLabel(coverage.knownPct)+' · '+coverage.knownPct+'% known of '+coverage.mapped+' mapped occurrences · '+coverage.learning+' learning · '+coverage.newCount+' new';
    const modes=main.querySelector<HTMLElement>('[data-modes]');
    if(modes)for(const [value,label] of [['extensive','Extensive'],['intensive','Intensive'],['targeted','Targeted']] as Array<[Mode,string]>){
      const button=create('button',label);button.type='button';button.classList.toggle('is-active',mode===value);
      button.addEventListener('click',()=>{mode=value;history.mode=mode;state.history[reading.id]=history;queueSave();renderReader(reading);});modes.append(button);
    }
    const position=main.querySelector<HTMLElement>('[data-position]');if(position)position.textContent=(history.position+1)+' / '+reading.sentences.length;
    const textHost=main.querySelector<HTMLElement>('[data-text]');if(!textHost)return;
    reading.sentences.forEach((sentence,indexValue)=>{
      const section=create('section','','reading-sentence');section.dataset.sentence=String(indexValue);
      const p=create('p','','reading-fr');
      for(const part of parts(sentence.fr)){
        if(!part.word){p.append(document.createTextNode(part.text));continue;}
        const row=resolve(part.text),ns=row?noteState.get(row.id):undefined;
        const button=create('button',part.text,'reading-token');button.type='button';
        if(row)button.classList.add(ns?.known?'is-known':ns?.introduced?'is-learning':'is-new');
        const targeted=mode==='targeted'&&(Boolean(row&&targetNoteId&&row.id===targetNoteId)||targetWords.has(normal(part.text))||Boolean(row&&!ns?.known));
        if(targeted)button.classList.add('is-targeted');
        button.addEventListener('click',()=>openLookup(reading,part.text,row));p.append(button);
      }
      section.append(p);
      if(mode==='intensive'){
        const help=create('button','Show sentence help','sentence-help-toggle');help.type='button';
        const panel=create('div','','sentence-help');panel.hidden=true;panel.append(create('p',sentence.en));
        if(sentence.grammar)panel.append(create('small',sentence.grammar));
        help.addEventListener('click',()=>{panel.hidden=!panel.hidden;help.textContent=panel.hidden?'Show sentence help':'Hide sentence help';});
        section.append(help,panel);
      }
      textHost.append(section);
    });
    main.querySelector<HTMLButtonElement>('[data-finish]')?.addEventListener('click',()=>finishReading(reading));

    if('IntersectionObserver' in window){
      observer=new IntersectionObserver(entries=>{
        const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if(!visible||visible.intersectionRatio<.55)return;const indexValue=Number((visible.target as HTMLElement).dataset.sentence);
        if(!Number.isFinite(indexValue)||history.position===indexValue)return;
        history.position=indexValue;state.history[reading.id]=history;if(position)position.textContent=(indexValue+1)+' / '+reading.sentences.length;queueSave();
      },{threshold:[.55,.75]});
      for(const sentence of textHost.querySelectorAll<HTMLElement>('[data-sentence]'))observer.observe(sentence);
    }
    if(history.position>0)requestAnimationFrame(()=>textHost.querySelector<HTMLElement>('[data-sentence="'+history.position+'"]')?.scrollIntoView({block:'center'}));
  };

  function readingCard(reading:ReadingItem):HTMLElement{
    const coverage=coverageCache.get(reading.id) as Coverage,history=state.history[reading.id];
    const card=create('article','','reading-card');
    const top=create('div','','reading-card-top');top.append(create('span',reading.level+' · '+reading.type),create('span',reading.minutes+' min'));card.append(top,create('h3',reading.title));
    card.append(create('p',reading.topic.replace(/-/g,' ')+' · '+coverage.knownPct+'% mapped vocabulary known','muted-copy'));
    const meta=create('div','','reading-card-meta');meta.append(create('span',coverageLabel(coverage.knownPct)));
    if(history?.completedAt)meta.append(create('span','Completed ×'+history.completionCount));
    else if(history?.startedAt)meta.append(create('span','Resume sentence '+(history.position+1)));
    card.append(meta);
    const button=create('button',history?.startedAt&&!history.completedAt?'Resume':'Open','secondary-action compact-action');button.type='button';
    button.addEventListener('click',()=>{mode=history?.mode??(targetNoteId&&readingNoteIds.get(reading.id)?.has(targetNoteId)?'targeted':'extensive');renderReader(reading);});card.append(button);
    return card;
  }

  function renderLibrary(){
    cleanupObserver();selected='';
    const levels=['ALL',...new Set(pack.readings.map(reading=>reading.level))];
    const types=['ALL',...new Set(pack.readings.map(reading=>reading.type))];
    main.innerHTML='<section class="page read-page"><p class="eyebrow">Comprehensible input</p><h1>Read</h1><p class="lede">25 original graded texts from A1 through B2. Reading exposure never moves SRS; only explicit retrieval creates practice evidence.</p><div class="reading-filters"><label>Level<select data-level></select></label><label>Type<select data-type></select></label></div><section class="reading-recommendations"><h2>Recommended now</h2><div class="reading-grid" data-recommended></div></section><section class="reading-library"><div class="section-heading"><h2>Library</h2><span data-count></span></div><div class="reading-grid" data-library></div></section><section class="data-panel saved-reading"><h2>Saved discoveries</h2><div data-saved></div></section></section>';
    const header=main.querySelector<HTMLElement>('.reading-recommendations');
    header?.parentElement?.insertBefore(renderOpenWorldEntry(),header);
    const levelSelect=main.querySelector<HTMLSelectElement>('[data-level]'),typeSelect=main.querySelector<HTMLSelectElement>('[data-type]');
    for(const value of levels){const option=document.createElement('option');option.value=value;option.textContent=value;levelSelect?.append(option);}
    for(const value of types){const option=document.createElement('option');option.value=value;option.textContent=value==='ALL'?'All types':value;typeSelect?.append(option);}
    if(levelSelect)levelSelect.value=levels.includes(level)?level:'ALL';if(typeSelect)typeSelect.value=types.includes(type)?type:'ALL';
    const renderCards=()=>{
      level=levelSelect?.value??'ALL';type=typeSelect?.value??'ALL';
      const library=main.querySelector<HTMLElement>('[data-library]'),count=main.querySelector<HTMLElement>('[data-count]');if(!library)return;
      library.replaceChildren();const filtered=pack.readings.filter(reading=>(level==='ALL'||reading.level===level)&&(type==='ALL'||reading.type===type));
      if(count)count.textContent=filtered.length+' texts';for(const reading of filtered)library.append(readingCard(reading));
    };
    levelSelect?.addEventListener('change',renderCards);typeSelect?.addEventListener('change',renderCards);renderCards();
    const recommended=main.querySelector<HTMLElement>('[data-recommended]');if(recommended)for(const reading of recommendations())recommended.append(readingCard(reading));
    const saved=main.querySelector<HTMLElement>('[data-saved]');
    if(saved){
      const rows=Object.entries(state.saved).sort((a,b)=>b[1].lastSeenAt-a[1].lastSeenAt).slice(0,20);
      if(!rows.length)saved.append(create('p','No saved discoveries yet. Tap words inside a text and save the useful ones.','muted-copy'));
      else for(const [,item] of rows){const row=create('div','','saved-discovery');row.append(create('strong',item.surface),create('span',(item.count+' encounter'+(item.count===1?'':'s'))+(item.coreId?' · linked to core vocabulary':'')));saved.append(row);}
    }
  }

  if(openReadingId){
    const requested=pack.readings.find(reading=>reading.id===openReadingId);
    if(requested){mode=state.history[requested.id]?.mode??'extensive';renderReader(requested);return;}
  }
  if(targetNoteId){
    const target=pack.readings.filter(reading=>readingNoteIds.get(reading.id)?.has(targetNoteId)).sort((a,b)=>recommendationScore(a)-recommendationScore(b))[0];
    if(target){mode='targeted';renderReader(target);return;}
  }
  renderLibrary();
}
