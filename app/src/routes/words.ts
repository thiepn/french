import './words.css';
import type { RouteContext } from '../core/types';
import { loadContentManifest } from '../core/content/manifest';
import { loadVocabularySearchIndex,loadVocabularyWord,findVocabularyReference,type VocabularySearchRow } from '../core/content/loader';
import {takeU40CanonicalWord} from '../core/unified/u40-lexical-bridge';
import {listUserVocabulary,saveUserVocabularyCard,listPrivateDecks,mutatePrivateDeck} from '../core/learner/user-vocabulary';
import type {NativePrivateDeck} from '../core/learner/private-decks';
import {createSelectedVocabularySession} from '../core/learner/study-session-builder';
import type {UserVocabularyCard} from '../core/learner/user-vocabulary-model';

function fold(value:string):string{
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').trim();
}
function localSearch(rows:VocabularySearchRow[],query:string,limit=40):VocabularySearchRow[]{
  const q=fold(query);
  return rows.map(row=>{
    const word=fold(row.word),meaning=fold(row.meaning),joined=word+' '+meaning;
    let score=0;
    if(!q)score=Math.max(1,100000-(row.order||0));
    else if(word===q)score=1000;
    else if(word.startsWith(q))score=850;
    else if(word.includes(q))score=700;
    else if(meaning.startsWith(q))score=500;
    else if(meaning.includes(q))score=350;
    else if(q.split(/\s+/).filter(Boolean).every(token=>joined.includes(token)))score=250;
    return{row,score};
  }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.row.order-b.row.order).slice(0,limit).map(item=>item.row);
}

export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page words-page"><p class="eyebrow">On-demand corpus</p><h1>Words</h1><p class="lede">Search the full French corpus without loading every vocabulary pack.</p><label class="search-field"><span>Search French or English</span><input data-search type="search" autocomplete="off" placeholder="bonjour, apprendre, travel…"></label><p class="inline-status" data-status>Preparing search index…</p><div class="word-layout"><div class="word-results" data-results aria-live="polite"></div><aside class="word-detail" data-detail><p>Select a word to load its full record.</p></aside></div></section>';

  const input=main.querySelector<HTMLInputElement>('[data-search]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  const results=main.querySelector<HTMLElement>('[data-results]');
  const detail=main.querySelector<HTMLElement>('[data-detail]');
  if(!input||!status||!results||!detail)return;

  // Private custom cards reuse canonical user-content and native Study; no parallel deck store.
  const custom=document.createElement('section');
  custom.className='word-custom-panel';
  custom.setAttribute('aria-label','My French vocabulary');
  custom.innerHTML=`<h2>My words</h2>
    <p class="muted-copy">Your own vocabulary stays in your existing private French data. Practice uses the same scheduled Review and daily limits; no card is graded when saved.</p>
    <form data-card-form class="word-custom-form">
      <label>French word or expression<input name="fr" maxlength="120" required autocomplete="off"></label>
      <label>English meaning<input name="en" maxlength="200" required autocomplete="off"></label>
      <label>French example (optional)<input name="exampleFr" maxlength="400" autocomplete="off"></label>
      <label>Example meaning (optional)<input name="exampleEn" maxlength="400" autocomplete="off"></label>
      <div class="word-custom-actions">
       <button type="submit" class="primary-action compact-action" data-card-save>Save my word</button>
       <button type="button" class="secondary-action compact-action" data-card-cancel hidden>Cancel edit</button>
       <button type="button" class="secondary-action compact-action" data-card-study>Study my words</button>
      </div>
    </form>
    <p class="inline-status" data-card-status role="status">Loading your words…</p>
    <div class="word-deck-toolbar">
      <label>Find one of my words<input type="search" data-card-filter placeholder="Filter personal vocabulary"></label>
      <label>Show cards<select data-deck-filter><option value="">All my words</option></select></label>
      <label>New deck name<input data-deck-title maxlength="64" placeholder="Everyday expressions"></label>
      <button type="button" class="secondary-action compact-action" data-deck-create>Create deck</button>
    </div>
    <div class="word-custom-actions" role="group" aria-label="Selected vocabulary actions">
      <button type="button" class="secondary-action compact-action" data-card-select>Choose visible cards</button>
      <button type="button" class="secondary-action compact-action" data-card-add>Add selected to deck</button>
      <button type="button" class="secondary-action compact-action" data-card-remove>Remove selected from deck</button>
      <button type="button" class="secondary-action compact-action" data-deck-study>Study this deck</button>
      <button type="button" class="secondary-action compact-action" data-deck-rename>Rename deck</button>
      <button type="button" class="secondary-action compact-action" data-deck-delete>Delete deck</button>
    </div>
    <p data-selection-status class="inline-status" role="status">Select personal words to organize them.</p>
    <div data-card-list class="word-custom-list"></div>`;
  main.querySelector('.words-page')?.append(custom);
  const cardForm=custom.querySelector<HTMLFormElement>('[data-card-form]')!;
  const cardStatus=custom.querySelector<HTMLElement>('[data-card-status]')!;
  const cardList=custom.querySelector<HTMLElement>('[data-card-list]')!;
  const cardFilter=custom.querySelector<HTMLInputElement>('[data-card-filter]')!;
  const cancelEdit=custom.querySelector<HTMLButtonElement>('[data-card-cancel]')!;
  const saveButton=custom.querySelector<HTMLButtonElement>('[data-card-save]')!;
  const studyButton=custom.querySelector<HTMLButtonElement>('[data-card-study]')!;
  const deckFilter=custom.querySelector<HTMLSelectElement>('[data-deck-filter]')!;
  const deckTitle=custom.querySelector<HTMLInputElement>('[data-deck-title]')!;
  const choose=custom.querySelector<HTMLButtonElement>('[data-card-select]')!;
  const add=custom.querySelector<HTMLButtonElement>('[data-card-add]')!;
  const remove=custom.querySelector<HTMLButtonElement>('[data-card-remove]')!;
  const studyDeck=custom.querySelector<HTMLButtonElement>('[data-deck-study]')!;
  const createDeck=custom.querySelector<HTMLButtonElement>('[data-deck-create]')!;
  const renameDeck=custom.querySelector<HTMLButtonElement>('[data-deck-rename]')!;
  const deleteDeck=custom.querySelector<HTMLButtonElement>('[data-deck-delete]')!;
  const selectionStatus=custom.querySelector<HTMLElement>('[data-selection-status]')!;
  let editingId:string|undefined;
  let personal:UserVocabularyCard[]=[];
  let decks:NativePrivateDeck[]=[];
  const selected=new Set<string>();
  let deletingDeck=false;
  const activeDeck=()=>decks.find(deck=>deck.id===deckFilter.value);
  const refreshDeckControls=()=>{
    const previous=deckFilter.value;
    deckFilter.replaceChildren(new Option('All my words',''));
    for(const deck of decks)deckFilter.add(new Option(deck.title+' ('+deck.noteIds.length+')',deck.id));
    deckFilter.value=decks.some(deck=>deck.id===previous)?previous:'';
    const hasDeck=Boolean(activeDeck());
    for(const control of [add,remove,studyDeck,renameDeck,deleteDeck])control.disabled=!hasDeck;
    selectionStatus.textContent=selected.size+' selected · '+decks.length+' private decks. Deck deletion never deletes vocabulary or review history.';
  };
  const refreshDecks=async()=>{
    decks=await listPrivateDecks();
    if(signal.aborted)return;
    refreshDeckControls();
  };
  const deckMutation=async(action:'create'|'rename'|'delete'|'add'|'remove')=>{
    const current=activeDeck();
    const id=current?.id;
    if(action!=='create'&&!id)return;
    const toAdd=[...selected];
    try{
      if((action==='add'||action==='remove')&&!toAdd.length){
        selectionStatus.textContent='Choose one or more personal words first.';return;
      }
      if(action==='delete'&&!deletingDeck){
        deletingDeck=true;deleteDeck.textContent='Confirm delete deck';
        selectionStatus.textContent='Confirm deck deletion. Cards and SRS history will remain intact.';
        return;
      }
      const newId=await mutatePrivateDeck(action,id,deckTitle.value,toAdd);
      await refreshDecks();
      if(action==='create')deckFilter.value=newId;
      if(action==='rename'||action==='create')deckTitle.value='';
      selected.clear();deletingDeck=false;deleteDeck.textContent='Delete deck';
      showPersonal();refreshDeckControls();
      selectionStatus.textContent='Deck updated · card records, learner scores and active study sessions unchanged.';
    }catch(error){
      selectionStatus.textContent='Deck was not changed. Check the title or try again.';
      console.error('Native private deck update failed',error);
    }
  };
  const fill=(row:UserVocabularyCard)=>{
    editingId=row.id;
    for(const key of ['fr','en','exampleFr','exampleEn'] as const){
      (cardForm.elements.namedItem(key) as HTMLInputElement).value=row[key]??'';
    }
    saveButton.textContent='Save changes';cancelEdit.hidden=false;
    (cardForm.elements.namedItem('fr') as HTMLInputElement).focus();
  };
  const reset=()=>{
    editingId=undefined;cardForm.reset();
    saveButton.textContent='Save my word';cancelEdit.hidden=true;
  };
  const visibleCards=()=>{
    const query=fold(cardFilter.value);
    const deck=activeDeck(),allowed=deck?new Set(deck.noteIds):null;
    return personal.filter(row=>(!allowed||allowed.has(row.id))&&fold(row.fr+' '+row.en).includes(query)).slice(0,120);
  };
  const showPersonal=()=>{
    cardList.replaceChildren();
    const displayed=visibleCards();
    if(!displayed.length){
      const empty=document.createElement('p');
      empty.textContent=personal.length?'No matching personal vocabulary.':'No personal cards yet. Add your first word above.';
      cardList.append(empty);return;
    }
    for(const row of displayed){
      const item=document.createElement('div');item.className='word-custom-item';
      const checkbox=document.createElement('input');
      checkbox.type='checkbox';checkbox.className='word-select-checkbox';
      checkbox.setAttribute('aria-label','Select '+row.fr);
      checkbox.checked=selected.has(row.id);
      checkbox.addEventListener('change',()=>{
        if(checkbox.checked)selected.add(row.id);else selected.delete(row.id);
        selectionStatus.textContent=selected.size+' selected';
      });
      const label=document.createElement('span');
      const name=document.createElement('strong');name.textContent=row.fr;
      const meaning=document.createElement('span');meaning.textContent=' · '+row.en;
      label.append(name,meaning);
      const edit=document.createElement('button');edit.type='button';
      edit.className='secondary-action compact-action';edit.textContent='Edit';
      edit.addEventListener('click',()=>fill(row));
      item.append(checkbox,label,edit);cardList.append(item);
    }
  };
  const reloadPersonal=async()=>{
    personal=await listUserVocabulary();
    if(signal.aborted)return;
    await refreshDecks();
    cardStatus.textContent=personal.length+' private words in your native French learner record.';
    showPersonal();
  };
  cardFilter.addEventListener('input',showPersonal);
  deckFilter.addEventListener('change',()=>{
    deletingDeck=false;deleteDeck.textContent='Delete deck';showPersonal();refreshDeckControls();
  });
  choose.addEventListener('click',()=>{
    const visible=visibleCards();
    const all=visible.length>0&&visible.every(row=>selected.has(row.id));
    for(const row of visible)if(all)selected.delete(row.id);else selected.add(row.id);
    showPersonal();selectionStatus.textContent=selected.size+' selected';
  });
  createDeck.addEventListener('click',()=>void deckMutation('create'));
  renameDeck.addEventListener('click',()=>void deckMutation('rename'));
  deleteDeck.addEventListener('click',()=>void deckMutation('delete'));
  add.addEventListener('click',()=>void deckMutation('add'));
  remove.addEventListener('click',()=>void deckMutation('remove'));
  studyDeck.addEventListener('click',()=>{
    const deck=activeDeck();if(!deck||studyDeck.disabled)return;
    const owned=new Set(personal.map(row=>row.id));
    const ids=deck.noteIds.filter(id=>owned.has(id)).slice(0,100);
    if(!ids.length){selectionStatus.textContent='This deck has no available personal words.';return;}
    studyDeck.disabled=true;
    void (async()=>{
      try{
        const answer=await createSelectedVocabularySession(ids);
        if(signal.aborted)return;
        if(answer.kind==='empty'){selectionStatus.textContent='No due or eligible new cards in this deck today.';return;}
        navigate('review');
      }catch(error){selectionStatus.textContent='Unable to start this deck session.';console.error(error);}
      finally{studyDeck.disabled=false;}
    })();
  });
  cancelEdit.addEventListener('click',reset);
  cardForm.addEventListener('submit',event=>{
    event.preventDefault();
    if(saveButton.disabled)return;
    const get=(name:string)=>(cardForm.elements.namedItem(name) as HTMLInputElement).value;
    saveButton.disabled=true;
    cardStatus.textContent='Saving to your private vocabulary…';
    void (async()=>{
      try{
        await saveUserVocabularyCard({fr:get('fr'),en:get('en'),
          exampleFr:get('exampleFr'),exampleEn:get('exampleEn')},editingId);
        reset();await reloadPersonal();
        if(!signal.aborted)cardStatus.textContent='Word saved. Your current review session and historical scores were not changed.';
      }catch(error){
        if(!signal.aborted)cardStatus.textContent='Word not saved. Check that French and English are filled in and try again.';
        console.error('Private user vocabulary save failed',error);
      }finally{saveButton.disabled=false;}
    })();
  });
  studyButton.addEventListener('click',()=>{
    if(studyButton.disabled)return;
    studyButton.disabled=true;
    void (async()=>{
      try{
        // Read the owner store again to avoid launching deleted/stale IDs from another tab.
        const current=await listUserVocabulary();
        if(!current.length){cardStatus.textContent='Add a personal word first.';return;}
        const session=await createSelectedVocabularySession(current.map(row=>row.id));
        if(signal.aborted)return;
        if(session.kind==='empty'){cardStatus.textContent='No personal words are due or eligible under today’s limits.';return;}
        navigate('review'); // Existing unfinished work resumes; never overwritten.
      }catch(error){
        if(!signal.aborted)cardStatus.textContent='Could not open the native vocabulary session.';
        console.error('Private vocabulary session failed',error);
      }finally{studyButton.disabled=false;}
    })();
  });
  try{await reloadPersonal();}
  catch(error){if(!signal.aborted)cardStatus.textContent='Personal vocabulary could not be read.';console.error(error);}

  const manifest=await loadContentManifest(signal);
  const descriptor=manifest.indexes?.vocabulary;
  if(!descriptor){status.textContent='Vocabulary search index is unavailable.';return;}

  const incomingCanonicalId=takeU40CanonicalWord();
  let requestId=0;
  let worker:Worker|null=null;
  let fallbackRows:VocabularySearchRow[]|null=null;
  let timer=0;

  const openDetail=async(row:VocabularySearchRow)=>{
    detail.replaceChildren();
    const loading=document.createElement('p');loading.textContent='Loading '+row.word+'…';detail.append(loading);
    try{
      const word=await loadVocabularyWord(row.id,signal);
      if(!word){detail.innerHTML='<p>This vocabulary record could not be resolved.</p>';return;}
      const example=word.sentences?.find(item=>item?.text)||word.sentences?.[0];
      detail.replaceChildren();
      const heading=document.createElement('h2');heading.textContent=word.word;detail.append(heading);
      if(word.ipa){const ipa=document.createElement('p');ipa.className='word-ipa';ipa.textContent=word.ipa;detail.append(ipa);}
      const meaning=document.createElement('p');meaning.className='word-meaning';meaning.textContent=word.meaning;detail.append(meaning);
      const meta=document.createElement('p');meta.className='word-meta';meta.textContent=[word.level,word.pos].filter(Boolean).join(' · ');detail.append(meta);
      const study=document.createElement('button');
      study.type='button';study.className='primary-action compact-action word-context-action';
      study.textContent='Study this word';
      const studyStatus=document.createElement('p');studyStatus.className='inline-status';studyStatus.setAttribute('role','status');
      study.addEventListener('click',()=>{
        if(study.disabled)return;
        study.disabled=true;studyStatus.textContent='Checking your native review session…';
        void (async()=>{
          try{
            const outcome=await createSelectedVocabularySession([String(word.id)]);
            if(signal.aborted)return;
            if(outcome.kind==='empty'){
              studyStatus.textContent='This word has no due or new activity eligible under today’s limits.';
              return;
            }
            navigate('review');
          }catch(error){
            if(!signal.aborted)studyStatus.textContent='Unable to open this native study session.';
            console.error('Word-to-study handoff failed',error);
          }finally{study.disabled=false;}
        })();
      });
      detail.append(study,studyStatus);

      if(example?.text){
        const block=document.createElement('blockquote');block.className='word-example';
        const fr=document.createElement('p');fr.textContent=example.text;block.append(fr);
        if(example.translation){const en=document.createElement('small');en.textContent=example.translation;block.append(en);}
        detail.append(block);
        const read=document.createElement('button');read.type='button';read.className='secondary-action compact-action word-context-action';read.textContent='Read in context';
        read.addEventListener('click',()=>{sessionStorage.setItem('french-vnext-read-note',String(word.id));navigate('read');});
        detail.append(read);
        const listen=document.createElement('button');listen.type='button';listen.className='secondary-action compact-action word-context-action';listen.textContent='Listen in context';
        listen.addEventListener('click',()=>{sessionStorage.setItem('french-vnext-listen-note',String(word.id));navigate('listen');});
        detail.append(listen);
        const speak=document.createElement('button');speak.type='button';speak.className='secondary-action compact-action word-context-action';speak.textContent='Speak this word';
        speak.addEventListener('click',()=>{sessionStorage.setItem('french-vnext-speak-note',String(word.id));navigate('speak');});
        detail.append(speak);
      }
    }catch(error){
      if(signal.aborted)return;
      detail.innerHTML='<p>Could not load this vocabulary pack.</p>';
      console.error('French vocabulary detail failed',error);
    }
  };

  const render=(rows:VocabularySearchRow[])=>{
    results.replaceChildren();
    if(!rows.length){const empty=document.createElement('p');empty.className='inline-status';empty.textContent='No matching vocabulary.';results.append(empty);return;}
    for(const row of rows){
      const button=document.createElement('button');button.type='button';button.className='word-result';
      const top=document.createElement('span');top.className='word-result-top';
      const term=document.createElement('strong');term.textContent=row.word;top.append(term);
      const level=document.createElement('span');level.textContent=row.level;top.append(level);
      const meaning=document.createElement('span');meaning.className='word-result-meaning';meaning.textContent=row.meaning;
      button.append(top,meaning);
      button.addEventListener('click',()=>void openDetail(row));
      results.append(button);
    }
  };

  const fallback=async(query:string,id:number)=>{
    fallbackRows??=(await loadVocabularySearchIndex(signal)).rows;
    if(id!==requestId||signal.aborted)return;
    render(localSearch(fallbackRows,query));
  };

  const search=(query:string)=>{
    const id=++requestId;
    if(worker)worker.postMessage({type:'search',query,limit:40,requestId:id});
    else void fallback(query,id);
  };

  try{
    if(typeof Worker==='function'){
      worker=new Worker(new URL('../workers/vocabulary-search.worker.ts',import.meta.url),{type:'module'});
      worker.onmessage=(event:MessageEvent<{type:string;count?:number;requestId?:number;rows?:VocabularySearchRow[];message?:string}>)=>{
        const message=event.data;
        if(message.type==='ready'){
          status.textContent=(message.count??descriptor.count).toLocaleString()+' words ready · search runs off the main thread.';
          search(input.value);
        }else if(message.type==='results'&&message.requestId===requestId){
          render(message.rows??[]);
        }else if(message.type==='error'){
          status.textContent='Worker search unavailable · using local fallback.';
          worker?.terminate();worker=null;void fallback(input.value,++requestId);
        }
      };
      worker.postMessage({type:'init',path:descriptor.path,sha256:descriptor.sha256});
    }else{
      status.textContent='Using local search fallback.';
      await fallback('',++requestId);
    }
  }catch{
    worker?.terminate();worker=null;
    status.textContent='Using local search fallback.';
    await fallback('',++requestId);
  }

  if(incomingCanonicalId){
    try{
      const row=await findVocabularyReference(incomingCanonicalId,signal);
      if(row&&!signal.aborted){
        input.value=row.word;
        render([row]);
        await openDetail(row);
      }else if(!signal.aborted)status.textContent='Original lesson word is not present in the current canonical corpus.';
    }catch(error){
      if(!signal.aborted)status.textContent='Unable to resolve the source-linked canonical word.';
      console.error('Original vocabulary handoff failed',error);
    }
  }

  input.addEventListener('input',()=>{
    window.clearTimeout(timer);
    timer=window.setTimeout(()=>search(input.value),70);
  });
  signal.addEventListener('abort',()=>{window.clearTimeout(timer);worker?.terminate();},{once:true});
}
