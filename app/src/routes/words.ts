import './words.css';
import type { RouteContext } from '../core/types';
import { loadContentManifest } from '../core/content/manifest';
import { loadVocabularySearchIndex,loadVocabularyWord,findVocabularyReference,type VocabularySearchRow } from '../core/content/loader';
import {takeU40CanonicalWord} from '../core/unified/u40-lexical-bridge';
import {listUserVocabulary,saveUserVocabularyCard,listPrivateDecks,mutatePrivateDeck,bulkSetUserVocabularyTheme} from '../core/learner/user-vocabulary';
import type {PrivateDeckView} from '../core/learner/private-decks';
import {createSelectedVocabularySession} from '../core/learner/study-session-builder';
import type {UserVocabularyCard} from '../core/learner/user-vocabulary-model';
import {resolveP35StarterLinks,eligibleSourceDeckIds} from '../core/learner/p35-starter-links';

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
  const corpusToolbar=document.createElement('div');
  corpusToolbar.className='word-corpus-toolbar';
  corpusToolbar.innerHTML=`<label>Corpus level<select data-corpus-level><option value="">All levels</option></select></label>
    <label>Word type<select data-corpus-pos><option value="">All word types</option></select></label>
    <label>Sort results<select data-corpus-sort><option value="source">Original corpus order</option><option value="az">French A–Z</option></select></label>
    <button type="button" class="secondary-action compact-action" data-corpus-select>Choose visible source words</button>
    <button type="button" class="secondary-action compact-action" data-corpus-add>Add selected to my deck</button>
    <button type="button" class="secondary-action compact-action" data-corpus-study>Study selected words</button>
    <p data-corpus-selection role="status" class="inline-status">0 source words selected · source IDs and grading preserved.</p>`;
  main.querySelector('.search-field')?.after(corpusToolbar);
  const levelFilter=corpusToolbar.querySelector<HTMLSelectElement>('[data-corpus-level]')!;
  const posFilter=corpusToolbar.querySelector<HTMLSelectElement>('[data-corpus-pos]')!;
  const sortFilter=corpusToolbar.querySelector<HTMLSelectElement>('[data-corpus-sort]')!;
  const corpusSelect=corpusToolbar.querySelector<HTMLButtonElement>('[data-corpus-select]')!;
  const corpusAdd=corpusToolbar.querySelector<HTMLButtonElement>('[data-corpus-add]')!;
  const corpusStudy=corpusToolbar.querySelector<HTMLButtonElement>('[data-corpus-study]')!;
  const corpusStatus=corpusToolbar.querySelector<HTMLElement>('[data-corpus-selection]')!;
  const corpusSelected=new Set<string>();
  let shownCorpus:VocabularySearchRow[]=[];
  const updateCorpusStatus=()=>{corpusStatus.textContent=corpusSelected.size+
    ' source words selected · original IDs, source packs and SRS grades are unchanged.';};


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
      <label class="word-theme-bulk">Theme for selected private cards
        <input data-bulk-theme maxlength="80" placeholder="Home, travel, daily life"></label>
      <button type="button" class="secondary-action compact-action" data-bulk-theme-save>Apply theme to selected</button>
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
  const bulkTheme=custom.querySelector<HTMLInputElement>('[data-bulk-theme]')!;
  const bulkThemeSave=custom.querySelector<HTMLButtonElement>('[data-bulk-theme-save]')!;
  let editingId:string|undefined;
  let personal:UserVocabularyCard[]=[];
  let decks:PrivateDeckView[]=[];
  let catalogById=new Map<string,VocabularySearchRow>();
  const starterLinks=(ids:readonly string[])=>new Map(
    resolveP35StarterLinks(ids,[...catalogById.values()]).map(x=>[x.storedId,x]));
  const selected=new Set<string>();
  let deletingDeck=false;
  let deckBusy=false;
  const activeDeck=()=>decks.find(deck=>deck.id===deckFilter.value);
  const refreshDeckControls=()=>{
    const previous=deckFilter.value;
    deckFilter.replaceChildren(new Option('All my words',''));
    for(const deck of decks)deckFilter.add(new Option(deck.title+' ('+deck.noteIds.length+')'+
      (deck.kind==='p35'?' · Recovered P35':''),deck.id));
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
    if(deckBusy)return;
    const current=activeDeck();
    const id=current?.id;
    if(action!=='create'&&!id)return;
    const toAdd=[...selected];
    try{
      if((action==='add'||action==='remove')&&!toAdd.length){
        selectionStatus.textContent='Choose one or more words first.';return;
      }
      if(action==='delete'&&!deletingDeck){
        deletingDeck=true;deleteDeck.textContent='Confirm delete deck';
        selectionStatus.textContent='Confirm deck deletion. Cards and SRS history will remain intact.';
        return;
      }
      deckBusy=true;
      createDeck.disabled=true;choose.disabled=true;deckFilter.disabled=true;
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
    }finally{
      deckBusy=false;createDeck.disabled=false;choose.disabled=false;deckFilter.disabled=false;
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
    const deck=activeDeck();
    const userById=new Map(personal.map(row=>[row.id,row]));
    const links=starterLinks(deck?.noteIds??[]);
    const rows=deck?deck.noteIds.map(id=>{
      const personalRow=userById.get(id);
      if(personalRow)return {...personalRow,kind:'user' as const};
      const link=links.get(id);
      const canonicalId=link?.status==='unique-starter'?link.resolvedId:id;
      const catalog=canonicalId?catalogById.get(canonicalId):undefined;
      if(catalog)return{id,fr:catalog.word,en:catalog.meaning,
        kind:(link?.status==='unique-starter'?'linked':'corpus') as 'linked'|'corpus',
        aliasId:link?.status==='unique-starter'?id:undefined};
      return{id,fr:'Source unavailable',en:id,kind:'unresolved' as const,
        aliasId:link?.status==='ambiguous'?'ambiguous':undefined};
    }):personal.map(row=>({...row,kind:'user' as const}));
    return rows.filter(row=>fold(row.fr+' '+row.en).includes(query)).slice(0,120);
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
      const meaning=document.createElement('span');meaning.textContent=' · '+row.en+
        (row.kind==='corpus'?' · Original corpus':
         row.kind==='linked'?' · Resolved P35 starter ID ('+row.aliasId+')':
         row.kind==='unresolved'?(row.aliasId==='ambiguous'?' · Ambiguous P35 ID':' · Unresolved P35 ID'):
         'theme' in row&&row.theme?' · '+row.theme:'');
      label.append(name,meaning);
      const edit=document.createElement('button');edit.type='button';
      edit.className='secondary-action compact-action';edit.textContent='Edit';
      if(row.kind==='user')edit.addEventListener('click',()=>fill(row));
      else edit.hidden=true;
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
    const links=eligibleSourceDeckIds(deck.noteIds,[...catalogById.values()],owned);
    const ids=links.eligibleIds;
    if(links.aliased||links.unresolved||links.ambiguous)
      selectionStatus.textContent=links.aliased+' source-qualified starter links; '+
        links.ambiguous+' ambiguous and '+links.unresolved+' missing IDs preserved.';
    if(!ids.length){selectionStatus.textContent='This deck has no resolved, study-ready source words.';return;}
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
  bulkThemeSave.addEventListener('click',()=>{
    const owned=new Set(personal.map(row=>row.id));
    const ids=[...selected].filter(id=>owned.has(id));
    if(ids.length!==selected.size||!ids.length){
      selectionStatus.textContent='Bulk theme editing requires selected private cards only.';return;
    }
    bulkThemeSave.disabled=true;
    void(async()=>{
      try{
        const changed=await bulkSetUserVocabularyTheme(ids,bulkTheme.value);
        await reloadPersonal();
        if(!signal.aborted)selectionStatus.textContent=changed+' private cards updated · original corpus and SRS scores untouched.';
      }catch(error){
        if(!signal.aborted)selectionStatus.textContent='Theme edit was not saved; check the selection or theme.';
        console.error('Bulk private theme edit failed',error);
      }finally{bulkThemeSave.disabled=false;}
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
  // Canonical source IDs for recovered P35 deck visibility, never rewritten on display.
  try{
    const index=await loadVocabularySearchIndex(signal);
    if(!signal.aborted){
      catalogById=new Map(index.rows.map(row=>[row.id,row]));
      for(const [select,key] of [[levelFilter,'level'],[posFilter,'pos']] as const){
        const values=[...new Set(index.rows.map(row=>row[key]).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
        for(const v of values)select.add(new Option(v,v));
      }
      showPersonal();
    }
  }catch(error){console.warn('Original corpus mapping unavailable; recovered deck IDs are retained.',error);}
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
      const addToDeck=document.createElement('button');
      addToDeck.type='button';addToDeck.className='secondary-action compact-action word-context-action';
      addToDeck.textContent='Add this word to selected deck';
      addToDeck.addEventListener('click',()=>{
        const target=activeDeck();
        if(!target){studyStatus.textContent='Choose a deck under My words before adding this source word.';return;}
        addToDeck.disabled=true;studyStatus.textContent='Adding canonical source word to '+target.title+'…';
        void(async()=>{
          try{
            await mutatePrivateDeck('add',target.id,undefined,[word.id]);
            await refreshDecks();showPersonal();
            if(!signal.aborted)studyStatus.textContent='Canonical word added to '+target.title+'.';
          }catch(error){
            if(!signal.aborted)studyStatus.textContent='Source word could not be added to this deck.';
            console.error('Canonical source membership update failed',error);
          }finally{addToDeck.disabled=false;}
        })();
      });
      detail.append(addToDeck);

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
    const filtered=rows.filter(row=>(!levelFilter.value||row.level===levelFilter.value)&&
      (!posFilter.value||row.pos===posFilter.value));
    if(sortFilter.value==='az')filtered.sort((a,b)=>a.word.localeCompare(b.word,'fr')||a.id.localeCompare(b.id));
    shownCorpus=filtered;
    if(!filtered.length){
      const empty=document.createElement('p');empty.className='inline-status';
      empty.textContent='No matching vocabulary within the selected source filters.';results.append(empty);return;
    }
    for(const row of filtered){
      const line=document.createElement('div');line.className='word-corpus-result-row';
      const checkbox=document.createElement('input');checkbox.type='checkbox';
      checkbox.className='word-corpus-checkbox';checkbox.setAttribute('aria-label','Select source '+row.word);
      checkbox.checked=corpusSelected.has(row.id);
      checkbox.addEventListener('change',()=>{
        if(checkbox.checked)corpusSelected.add(row.id);else corpusSelected.delete(row.id);
        updateCorpusStatus();
      });
      const button=document.createElement('button');button.type='button';button.className='word-result';
      const top=document.createElement('span');top.className='word-result-top';
      const term=document.createElement('strong');term.textContent=row.word;top.append(term);
      const level=document.createElement('span');level.textContent=row.level;top.append(level);
      const meaning=document.createElement('span');meaning.className='word-result-meaning';meaning.textContent=row.meaning;
      button.append(top,meaning);
      button.addEventListener('click',()=>void openDetail(row));
      line.append(checkbox,button);results.append(line);
    }
  };

  const refreshCorpus=()=>search(input.value);
  for(const filter of [levelFilter,posFilter,sortFilter])filter.addEventListener('change',refreshCorpus);
  corpusSelect.addEventListener('click',()=>{
    const all=shownCorpus.length>0&&shownCorpus.every(row=>corpusSelected.has(row.id));
    for(const row of shownCorpus)if(all)corpusSelected.delete(row.id);else corpusSelected.add(row.id);
    render(shownCorpus);updateCorpusStatus();
  });
  const selectedCanonicalIds=()=>{
    const known=new Set(catalogById.keys());
    return [...corpusSelected].filter(id=>known.has(id)).slice(0,120);
  };
  corpusAdd.addEventListener('click',()=>{
    const deck=activeDeck(),ids=selectedCanonicalIds();
    if(!deck||!ids.length){corpusStatus.textContent='Choose a deck and select source words before adding.';return;}
    corpusAdd.disabled=true;
    void(async()=>{
      try{
        await mutatePrivateDeck('add',deck.id,undefined,ids);
        await refreshDecks();showPersonal();
        corpusSelected.clear();updateCorpusStatus();
        corpusStatus.textContent=ids.length+' verified corpus IDs added to '+deck.title+'.';
      }catch(error){corpusStatus.textContent='Source word membership not saved.';console.error(error);}
      finally{corpusAdd.disabled=false;}
    })();
  });
  corpusStudy.addEventListener('click',()=>{
    const ids=selectedCanonicalIds();
    if(!ids.length){corpusStatus.textContent='Select original corpus words to study first.';return;}
    corpusStudy.disabled=true;
    void(async()=>{
      try{
        const session=await createSelectedVocabularySession(ids);
        if(signal.aborted)return;
        if(session.kind==='empty'){corpusStatus.textContent='No selected words due or eligible under your current limits.';return;}
        navigate('review');
      }catch(error){corpusStatus.textContent='Native source-word Review unavailable.';console.error(error);}
      finally{corpusStudy.disabled=false;}
    })();
  });
  const fallback=async(query:string,id:number)=>{
    fallbackRows??=(await loadVocabularySearchIndex(signal)).rows;
    if(id!==requestId||signal.aborted)return;
    render(localSearch(fallbackRows,query));
  };

  const search=(query:string)=>{
    const id=++requestId;
    // Filtering must search all source-qualified rows, not filter only the
    // worker's first 40 (otherwise relevant original words silently disappear).
    if((levelFilter.value||posFilter.value)&&catalogById.size){
      const eligible=[...catalogById.values()].filter(row=>
        (!levelFilter.value||row.level===levelFilter.value)&&
        (!posFilter.value||row.pos===posFilter.value));
      render(localSearch(eligible,query));
      return;
    }
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
