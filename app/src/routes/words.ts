import type { RouteContext } from '../core/types';
import { loadContentManifest } from '../core/content/manifest';
import { loadVocabularySearchIndex,loadVocabularyWord,type VocabularySearchRow } from '../core/content/loader';

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

  const manifest=await loadContentManifest(signal);
  const descriptor=manifest.indexes?.vocabulary;
  if(!descriptor){status.textContent='Vocabulary search index is unavailable.';return;}

  let requestId=0;
  let worker:Worker|null=null;
  let fallbackRows:VocabularySearchRow[]|null=null;
  let timer=0;

  const openDetail=async(row:VocabularySearchRow)=>{
    detail.innerHTML='<p>Loading '+row.word+'…</p>';
    try{
      const word=await loadVocabularyWord(row.id,signal);
      if(!word){detail.innerHTML='<p>This vocabulary record could not be resolved.</p>';return;}
      const example=word.sentences?.find(item=>item?.text)||word.sentences?.[0];
      detail.replaceChildren();
      const heading=document.createElement('h2');heading.textContent=word.word;detail.append(heading);
      if(word.ipa){const ipa=document.createElement('p');ipa.className='word-ipa';ipa.textContent=word.ipa;detail.append(ipa);}
      const meaning=document.createElement('p');meaning.className='word-meaning';meaning.textContent=word.meaning;detail.append(meaning);
      const meta=document.createElement('p');meta.className='word-meta';meta.textContent=[word.level,word.pos].filter(Boolean).join(' · ');detail.append(meta);
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

  input.addEventListener('input',()=>{
    window.clearTimeout(timer);
    timer=window.setTimeout(()=>search(input.value),70);
  });
  signal.addEventListener('abort',()=>{window.clearTimeout(timer);worker?.terminate();},{once:true});
}
