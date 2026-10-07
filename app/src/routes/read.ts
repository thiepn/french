import type { RouteContext } from '../core/types';
import {
  ensureCanonicalLearnerState,
  readAllSrsRecords,
  recordStandalonePractice,
  updateLearnerFeatureState
} from '../core/learner/repository';
import {
  loadReadingCorpus,
  loadVocabularySearchIndex,
  loadVocabularyWord,
  type ReadingItem,
  type VocabularySearchRow
} from '../core/content/loader';

interface ReadingHistoryRow {
  openedAt?:number;
  lastOpenedAt?:number;
  completedAt?:number;
  completionCount?:number;
  questionAttempts?:number;
  questionCorrect?:number;
}
interface ReadingExposure {
  count:number;
  lastSeenAt:number;
  textIds:string[];
}
interface ReadingFeatureState {
  schema?:string;
  history?:Record<string,ReadingHistoryRow>;
  exposures?:Record<string,ReadingExposure>;
  saved?:Record<string,unknown>;
  [key:string]:unknown;
}
type ReadingMode='comfortable'|'intensive';

function object<T extends object=Record<string,unknown>>(value:unknown):T{
  return (value&&typeof value==='object'&&!Array.isArray(value)?value:{} ) as T;
}
function fold(value:string):string{
  return value.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'").trim();
}
function words(value:string):string[]{
  return value.match(/[\p{L}À-ÿŒœÆæ]+(?:[’'][\p{L}À-ÿŒœÆæ]+)?/gu)??[];
}
function splitText(value:string):Array<{text:string;word:boolean}>{
  const pattern=/([\p{L}À-ÿŒœÆæ]+(?:[’'][\p{L}À-ÿŒœÆæ]+)?)/gu;
  const parts:Array<{text:string;word:boolean}>=[];let last=0;
  for(const match of value.matchAll(pattern)){
    const index=match.index??0;
    if(index>last)parts.push({text:value.slice(last,index),word:false});
    parts.push({text:match[0],word:true});last=index+match[0].length;
  }
  if(last<value.length)parts.push({text:value.slice(last),word:false});
  return parts;
}
function normalizeState(value:unknown):ReadingFeatureState{
  const source=object<ReadingFeatureState>(value);
  return{
    ...source,
    schema:'thiepn-french-reading-state-v1',
    history:object<Record<string,ReadingHistoryRow>>(source.history),
    exposures:object<Record<string,ReadingExposure>>(source.exposures),
    saved:object<Record<string,unknown>>(source.saved)
  };
}

export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page read-page"><p class="eyebrow">Comprehensible reading</p><h1>Read</h1><p class="lede">Loading the graded reading library and your vocabulary coverage…</p><div class="inline-status">Preparing texts…</div></section>';
  const [corpus,index,srs,learner]=await Promise.all([
    loadReadingCorpus(signal),
    loadVocabularySearchIndex(signal),
    readAllSrsRecords(),
    ensureCanonicalLearnerState()
  ]);
  if(signal.aborted)return;

  const readingState=normalizeState(learner.featureState.v550Reading);
  const history=readingState.history??{};
  const recognition=new Map(srs.filter(row=>row.skill==='recognition').map(row=>[row.noteId,row]));
  const byFold=new Map<string,VocabularySearchRow>();
  for(const row of index.rows){
    const key=fold(row.word);
    if(key&&!byFold.has(key))byFold.set(key,row);
  }

  const mappedRows=(reading:ReadingItem)=>{
    const rows:VocabularySearchRow[]=[];
    for(const sentence of reading.sentences){
      for(const token of words(sentence.fr)){
        const row=byFold.get(fold(token));
        if(row)rows.push(row);
      }
    }
    return rows;
  };
  const coverage=(reading:ReadingItem)=>{
    const mapped=mappedRows(reading);
    let known=0,learning=0;
    for(const row of mapped){
      const state=recognition.get(row.id);
      if(state?.status==='learned')known++;
      else if(state&&(state.seen>0||state.status!=='new'))learning++;
    }
    const total=Math.max(1,mapped.length);
    return{mapped:mapped.length,known,learning,unknown:Math.max(0,mapped.length-known-learning),knownPct:Math.round(known/total*100),learningPct:Math.round(learning/total*100)};
  };

  let selected:ReadingItem|null=null;
  let level='ALL',type='ALL',mode:ReadingMode='comfortable';
  let review=false;
  const answers=new Map<string,number>();

  const updateState=async(updater:(state:ReadingFeatureState)=>ReadingFeatureState)=>{
    const next=await updateLearnerFeatureState<ReadingFeatureState>('v550Reading',current=>updater(normalizeState(current)));
    Object.assign(readingState,next);
  };
  const openReading=async(reading:ReadingItem)=>{
    selected=reading;review=false;answers.clear();
    const now=Date.now();
    await updateState(state=>{
      const nextHistory={...object<Record<string,ReadingHistoryRow>>(state.history)};
      const previous=nextHistory[reading.id]??{};
      nextHistory[reading.id]={...previous,openedAt:previous.openedAt??now,lastOpenedAt:now};
      return{...state,history:nextHistory};
    });
    render();
  };
  const finishReading=async(reading:ReadingItem)=>{
    const now=Date.now(),unique=new Map<string,VocabularySearchRow>();
    for(const row of mappedRows(reading))unique.set(row.id,row);
    await updateState(state=>{
      const nextHistory={...object<Record<string,ReadingHistoryRow>>(state.history)};
      const previous=nextHistory[reading.id]??{};
      nextHistory[reading.id]={
        ...previous,
        completedAt:previous.completedAt??now,
        lastOpenedAt:now,
        completionCount:(previous.completionCount??0)+1
      };
      const exposures={...object<Record<string,ReadingExposure>>(state.exposures)};
      for(const row of unique.values()){
        const prior=exposures[row.id]??{count:0,lastSeenAt:0,textIds:[]};
        exposures[row.id]={
          count:prior.count+1,
          lastSeenAt:now,
          textIds:[...new Set([...(prior.textIds??[]),reading.id])].slice(-30)
        };
      }
      return{...state,history:nextHistory,exposures};
    });
    review=true;answers.clear();render();
  };

  const renderLibrary=()=>{
    const completed=Object.values(history).filter(row=>row.completedAt).length;
    const filtered=corpus.readings.filter(reading=>(level==='ALL'||reading.level===level)&&(type==='ALL'||reading.type===type));
    const recommended=[...filtered].sort((a,b)=>{
      const ah=history[a.id]?.completedAt?1:0,bh=history[b.id]?.completedAt?1:0;
      if(ah!==bh)return ah-bh;
      const ac=coverage(a),bc=coverage(b);
      const target=(value:number)=>Math.abs(86-value);
      return target(ac.knownPct)-target(bc.knownPct)||a.minutes-b.minutes;
    });
    main.innerHTML=`
    <section class="page read-page">
      <p class="eyebrow">Comprehensible reading</p>
      <h1>Read</h1>
      <p class="lede">Original graded French texts from P35, now loaded as a separate content library. Passive reading records exposure only; it never moves your SRS schedule.</p>
      <div class="read-stats"><span><strong>${completed}</strong> completed</span><span><strong>${corpus.readings.length}</strong> texts</span><span><strong>${Object.keys(readingState.exposures??{}).length}</strong> words encountered</span></div>
      <div class="read-controls">
        <label><span>Level</span><select data-level><option value="ALL">All levels</option>${[...new Set(corpus.readings.map(row=>row.level))].map(value=>`<option value="${value}" ${level===value?'selected':''}>${value}</option>`).join('')}</select></label>
        <label><span>Type</span><select data-type><option value="ALL">All types</option>${[...new Set(corpus.readings.map(row=>row.type))].map(value=>`<option value="${value}" ${type===value?'selected':''}>${value}</option>`).join('')}</select></label>
        <div class="read-mode"><button type="button" data-mode="comfortable" class="${mode==='comfortable'?'is-active':''}">Comfortable</button><button type="button" data-mode="intensive" class="${mode==='intensive'?'is-active':''}">Intensive</button></div>
      </div>
      <div class="reading-grid">
        ${recommended.map(reading=>{
          const c=coverage(reading),h=history[reading.id];
          return`<article class="reading-card"><div class="reading-meta"><span>${reading.level}</span><span>${reading.type}</span><span>~${reading.minutes} min</span></div><h2>${reading.title}</h2><p>${c.mapped?c.knownPct+'% of mapped occurrences learned':'Coverage builds as vocabulary maps'}</p><div class="coverage-bar"><span style="width:${c.knownPct}%"></span></div><small>${c.learningPct}% learning · ${c.unknown}% mapped unknown${h?.completedAt?' · completed':''}</small><button type="button" class="${h?.completedAt?'secondary-action':'primary-action'} compact-action" data-reading="${reading.id}">${h?.completedAt?'Read again':'Open text'}</button></article>`;
        }).join('')}
      </div>
    </section>`;
    main.querySelector<HTMLSelectElement>('[data-level]')?.addEventListener('change',event=>{level=(event.currentTarget as HTMLSelectElement).value;renderLibrary();});
    main.querySelector<HTMLSelectElement>('[data-type]')?.addEventListener('change',event=>{type=(event.currentTarget as HTMLSelectElement).value;renderLibrary();});
    main.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode as ReadingMode;renderLibrary();}));
    main.querySelectorAll<HTMLButtonElement>('[data-reading]').forEach(button=>button.addEventListener('click',()=>{
      const reading=corpus.readings.find(row=>row.id===button.dataset.reading);if(reading)void openReading(reading);
    }));
  };

  const openWordDetail=async(row:VocabularySearchRow,host:HTMLElement)=>{
    host.innerHTML='<p>Loading word…</p>';host.hidden=false;
    const word=await loadVocabularyWord(row.id,signal);
    if(!word||signal.aborted){host.innerHTML='<p>Word details unavailable.</p>';return;}
    host.replaceChildren();
    const h=document.createElement('h3');h.textContent=word.word;
    const meaning=document.createElement('p');meaning.textContent=word.meaning;
    const meta=document.createElement('small');meta.textContent=[word.level,word.pos,word.ipa].filter(Boolean).join(' · ');
    const actions=document.createElement('div');actions.className='settings-actions';
    const wordsButton=document.createElement('button');wordsButton.type='button';wordsButton.className='secondary-action compact-action';wordsButton.textContent='Open Words';wordsButton.addEventListener('click',()=>navigate('words'));
    const close=document.createElement('button');close.type='button';close.className='secondary-action compact-action';close.textContent='Close';close.addEventListener('click',()=>{host.hidden=true;});
    actions.append(wordsButton,close);host.append(h,meaning,meta,actions);
  };

  const renderReader=()=>{
    if(!selected){renderLibrary();return;}
    const reading=selected,c=coverage(reading);
    if(review){renderReview(reading);return;}
    main.innerHTML=`
    <section class="page read-page">
      <header class="reader-head"><button type="button" class="secondary-action compact-action" data-back>← Read</button><div><span>${reading.level} · ${reading.type} · ~${reading.minutes} min</span><h1>${reading.title}</h1></div><span>${c.knownPct}% mapped learned</span></header>
      <div class="reader-coverage"><span><strong>${c.knownPct}%</strong> learned</span><span><strong>${c.learningPct}%</strong> learning</span><span><strong>${c.unknown}</strong> mapped unknown</span><span><strong>${reading.register}</strong> register</span></div>
      <article class="reading-text" data-reading-text></article>
      <aside class="reading-lookup" data-lookup hidden></aside>
      <footer class="reader-footer"><span>${reading.sentences.reduce((sum,row)=>sum+words(row.fr).length,0)} words · ${reading.questions.length} comprehension questions</span><button type="button" class="primary-action compact-action" data-finish>Finish & review</button></footer>
    </section>`;
    const textHost=main.querySelector<HTMLElement>('[data-reading-text]');
    const lookup=main.querySelector<HTMLElement>('[data-lookup]');
    if(textHost&&lookup){
      reading.sentences.forEach((sentence,index)=>{
        const p=document.createElement('p');p.lang='fr';
        for(const part of splitText(sentence.fr)){
          if(!part.word){p.append(document.createTextNode(part.text));continue;}
          const row=byFold.get(fold(part.text));
          if(!row){p.append(document.createTextNode(part.text));continue;}
          const state=recognition.get(row.id);
          const button=document.createElement('button');button.type='button';button.className='reading-word';
          if(state?.status==='learned')button.classList.add('is-known');
          else if(state&&(state.seen>0||state.status!=='new'))button.classList.add('is-learning');
          else if(mode==='intensive')button.classList.add('is-unknown');
          button.textContent=part.text;button.addEventListener('click',()=>void openWordDetail(row,lookup));p.append(button);
        }
        textHost.append(p);
        if(mode==='intensive'){
          const translation=document.createElement('p');translation.className='reading-translation';translation.textContent=sentence.en;textHost.append(translation);
          if(sentence.grammar){const grammar=document.createElement('small');grammar.className='reading-grammar';grammar.textContent=sentence.grammar;textHost.append(grammar);}
        }
        if(index<reading.sentences.length-1)textHost.append(document.createElement('hr'));
      });
    }
    main.querySelector<HTMLButtonElement>('[data-back]')?.addEventListener('click',()=>{selected=null;review=false;renderLibrary();});
    main.querySelector<HTMLButtonElement>('[data-finish]')?.addEventListener('click',()=>void finishReading(reading));
  };

  const renderReview=(reading:ReadingItem)=>{
    const row=history[reading.id]??{};
    main.innerHTML=`
    <section class="page read-page">
      <header class="reader-head"><button type="button" class="secondary-action compact-action" data-back>← Library</button><div><p class="eyebrow">Quick review</p><h1>${reading.title}</h1></div><span>${row.completionCount??1} completion${(row.completionCount??1)===1?'':'s'}</span></header>
      <div class="reading-questions">
        ${reading.questions.map(question=>`<article data-question="${question.id}"><h2>${question.prompt}</h2><div class="reading-options">${question.options.map((option,index)=>`<button type="button" data-option="${index}">${option}</button>`).join('')}</div><p class="grade-feedback" data-feedback></p></article>`).join('')}
      </div>
      <div class="reader-footer"><span>Reading exposure is saved separately from scheduled review.</span><button type="button" class="primary-action compact-action" data-done>Done</button></div>
    </section>`;
    main.querySelector<HTMLButtonElement>('[data-back]')?.addEventListener('click',()=>{selected=null;review=false;renderLibrary();});
    main.querySelector<HTMLButtonElement>('[data-done]')?.addEventListener('click',()=>{selected=null;review=false;renderLibrary();});
    main.querySelectorAll<HTMLElement>('[data-question]').forEach(article=>{
      const question=reading.questions.find(row=>row.id===article.dataset.question);
      if(!question)return;
      article.querySelectorAll<HTMLButtonElement>('[data-option]').forEach(button=>button.addEventListener('click',async()=>{
        if(answers.has(question.id))return;
        const chosen=Number(button.dataset.option),ok=chosen===question.answer;answers.set(question.id,chosen);
        for(const option of article.querySelectorAll<HTMLButtonElement>('[data-option]')){
          option.disabled=true;
          if(Number(option.dataset.option)===question.answer)option.classList.add('is-correct');
          else if(option===button&&!ok)option.classList.add('is-wrong');
        }
        const feedback=article.querySelector<HTMLElement>('[data-feedback]');if(feedback)feedback.textContent=ok?'Correct.':'Answer: '+question.options[question.answer];
        const target=question.target?byFold.get(fold(question.target)):undefined;
        await recordStandalonePractice({
          noteId:target?.id??'reading:'+reading.id+':'+question.id,
          skill:'recognition',practice:'reading',correct:ok,responseMs:0,level:reading.level,pos:target?.pos??'',direction:'reading-en',xp:ok?4:1
        });
        await updateState(state=>{
          const nextHistory={...object<Record<string,ReadingHistoryRow>>(state.history)};
          const previous=nextHistory[reading.id]??{};
          nextHistory[reading.id]={...previous,questionAttempts:(previous.questionAttempts??0)+1,questionCorrect:(previous.questionCorrect??0)+(ok?1:0)};
          return{...state,history:nextHistory};
        });
      }));
    });
  };

  const render=()=>selected?renderReader():renderLibrary();
  renderLibrary();
}
