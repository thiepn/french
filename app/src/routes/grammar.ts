import type {RouteContext} from '../core/types';
import {ORIGINAL_GRAMMAR,CARNET_GRAMMAR_COUNT,type GrammarGuide} from '../core/unified/catalog';
import './unified.css';
import {appendU26GrammarLibrary} from './u26-grammar-panel';

function normalizeAnswer(value:string):string{
  return value.normalize('NFC').trim().replace(/\s+/g,' ').toLocaleLowerCase('fr');
}
export function mount({main,navigate,signal}:RouteContext):void {
  main.innerHTML=`<section class="page unified-page">
    <p class="eyebrow">Original teaching content · U1</p><h1>Grammar</h1>
    <p class="lede">Short self-authored guides with immediate, ungraded recall. The source coursebook's ${CARNET_GRAMMAR_COUNT} grammar concepts remain separate until licensing and exact-source mapping are verified.</p>
    <div class="unified-tools">
      <label>Level <select data-level><option value="all">All levels</option><option value="A1">A1</option><option value="A2">A2</option></select></label>
      <button type="button" data-course class="secondary-action compact-action">Open original Course</button>
    </div>
    <div class="unified-grammar-list" data-list aria-label="Grammar topics"></div>
    <article class="unified-detail" data-lesson aria-live="polite"></article>
    <section data-u26-library aria-label="Original A1 through early B2 contextual grammar"></section>
  </section>`;
  const library=main.querySelector<HTMLElement>('[data-u26-library]');
  if(library)appendU26GrammarLibrary(library,navigate);
  const list=main.querySelector<HTMLElement>('[data-list]')!;
  const detail=main.querySelector<HTMLElement>('[data-lesson]')!;
  const level=main.querySelector<HTMLSelectElement>('[data-level]')!;
  let selected=ORIGINAL_GRAMMAR[0]?.id;
  function open(guide:GrammarGuide){
    selected=guide.id;
    for(const button of list.querySelectorAll<HTMLButtonElement>('button[data-guide]')){
      button.classList.toggle('selected',button.dataset.guide===guide.id);
      if(button.dataset.guide===guide.id)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');
    }
    detail.replaceChildren();
    const heading=document.createElement('h2');heading.textContent=guide.title;
    const description=document.createElement('p');description.textContent=guide.explanation;
    const example=document.createElement('blockquote');example.className='unified-example';
    const fr=document.createElement('strong');fr.lang='fr';fr.textContent=guide.example;
    const translation=document.createElement('p');translation.textContent=guide.translation;
    example.append(fr,translation);
    const exercise=document.createElement('form');exercise.className='unified-exercise';
    const label=document.createElement('label');label.textContent=guide.prompt;label.htmlFor='u1-grammar-answer';
    const input=document.createElement('input');input.id='u1-grammar-answer';input.autocomplete='off';input.spellcheck=false;
    const button=document.createElement('button');button.type='submit';button.className='primary-action compact-action';button.textContent='Check answer';
    const feedback=document.createElement('p');feedback.className='unified-result';feedback.setAttribute('role','status');
    feedback.textContent='Practice only · does not change mastery, FSRS or CEFR gates.';
    exercise.addEventListener('submit',event=>{
      event.preventDefault();
      const answer=normalizeAnswer(input.value);
      const acceptable=[guide.answer,...guide.alternatives].some(value=>normalizeAnswer(value)===answer);
      feedback.textContent=acceptable?'Correct · practice only.':'Try again. Expected: '+guide.answer+' · no score recorded.';
    });
    exercise.append(label,input,button,feedback);
    const provenance=document.createElement('p');provenance.className='unified-provenance';
    provenance.textContent='Original U1 guide · '+guide.level+' · '+guide.source.qualifiedId;
    const deepDive=document.createElement('div');deepDive.dataset.u2Grammar='';
    detail.append(heading,description,example,exercise,deepDive,provenance);
    void import('./u2-studio').then(module=>{
      if(!signal.aborted&&selected===guide.id&&deepDive.isConnected)module.addGrammarDeepDive(deepDive,guide.id,navigate);
    }).catch(error=>{if(!signal.aborted)console.error('U2 grammar expansion unavailable',error);});
  }
  function update(){
    list.replaceChildren();
    const filtered=ORIGINAL_GRAMMAR.filter(guide=>level.value==='all'||guide.level===level.value);
    for(const guide of filtered){
      const button=document.createElement('button');button.type='button';button.dataset.guide=guide.id;
      button.className='unified-topic';button.textContent=guide.title+' · '+guide.level;
      button.addEventListener('click',()=>open(guide));list.append(button);
    }
    if(filtered.length)open(filtered.find(guide=>guide.id===selected)??filtered[0]);
    else detail.textContent='No original grammar guides for this level.';
  }
  level.addEventListener('change',update);
  main.querySelector('[data-course]')?.addEventListener('click',()=>navigate('course'));
  let requested:string|null=null;
  try{requested=sessionStorage.getItem('french-u2-grammar-target');sessionStorage.removeItem('french-u2-grammar-target');}catch{}
  if(requested&&ORIGINAL_GRAMMAR.some(guide=>guide.id===requested)){selected=requested;level.value='all';}
  update();
}
