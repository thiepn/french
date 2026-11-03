import {
 ORIGINAL_B2_NEGOTIATIONS,resolveB2NegotiationSources,evaluateB2NegotiationMove,validateB2Negotiations,
 type U48Route,type U48Move
} from '../core/unified/u48-b2-negotiation.ts';
import './u48-b2-negotiation-panel.css';

function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',cls=''):HTMLElementTagNameMap[K]{
 const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;
}
function button(label:string,onClick:()=>void):HTMLButtonElement{
 const b=el('button',label,'secondary-action compact-action');b.type='button';b.addEventListener('click',onClick);return b;
}
function french(text:string,cls='u48-french'):HTMLParagraphElement{
 const p=el('p',text,cls);p.lang='fr';return p;
}
/** Optional U31 negotiation, three turns with genuinely branching stakeholder follow-ups.
 * Never captures audio, evaluates learner speech, mutates learner state or invents published dialogue.
 */
export function appendB2Negotiation(host:HTMLElement,lessonId:string,signal:AbortSignal,onPrivateChange?:()=>void):()=>void{
 const candidate=ORIGINAL_B2_NEGOTIATIONS.find(s=>s.lesson===lessonId);
 if(!candidate||validateB2Negotiations().length)return()=>{};
 const scene=candidate;
 const found=resolveB2NegotiationSources(scene);
 if(!found)return()=>{};
 const exact=found;
 const root=el('section','','u48-b2-negotiation');
 root.setAttribute('aria-label','Branching B2 French stakeholder negotiation');
 root.dataset.hasPrivateDraft='false';
 const detail=el('details','','u48-disclosure');detail.open=true;
 detail.append(el('summary','B2 · Negotiation with changing stakeholder responses · 3 turns'));
 const body=el('div','','u48-body');
 body.append(el('h4',scene.title),el('p',scene.context,'u48-context'),
  el('p','Three original-source negotiations with two genuine strategic routes per lesson. Stakeholder lines below are authored hypothetical role-play, never archival quotes or verified audio. Speak your own French answer before choosing the next move. Choices test reasoning about source limits only; no speech, pronunciation, grammar or CEFR score, recording, sync or Practice event.','u48-notice'));
 const progress=el('p','','u48-progress');progress.setAttribute('role','status');
 const main=el('div','','u48-stage');
 const nav=el('div','','u48-navigation');
 body.append(progress,main,nav);detail.append(body);root.append(detail);host.append(root);
 const drafts=new Map<string,string>(),reported=new Set<string>(),revealedSources=new Set<string>(),revealedModels=new Set<string>();
 let turn:0|1|2=0,route:U48Route|null=null,move:U48Move|null=null,disposed=false;
 const updateDraft=()=>{
  root.dataset.hasPrivateDraft=String([...drafts.values()].some(x=>x.trim().length>0));
  onPrivateChange?.();
 };
 function notes(key:string,label:string,placeholder:string):HTMLElement{
  const wrap=el('label',label,'u48-private-label');
  const input=el('textarea','','u48-private-notes');
  input.rows=4;input.lang='fr';input.spellcheck=true;
  input.setAttribute('aria-label','Negotiation French response '+key);
  input.placeholder=placeholder;input.value=drafts.get(key)??'';
  input.addEventListener('input',()=>{drafts.set(key,input.value);updateDraft();});
  wrap.append(input);return wrap;
 }
 function rehearsal(key:string):HTMLElement{
  const wrap=el('div','','u48-rehearsal');
  const state=el('p',reported.has(key)?
   'Self-reported rehearsal only. No microphone, speech evaluation or score.':'No oral rehearsal is verified. Speak aloud if practical.','u48-status');
  state.setAttribute('role','status');
  const btn=button('I rehearsed this reply aloud (self-report)',()=>{
   reported.add(key);state.textContent='Self-reported oral rehearsal in this tab only. Nothing was recorded or graded.';
  });
  wrap.append(btn,state);return wrap;
 }
 function sourceCards(key:string,indices:readonly number[]):HTMLElement{
  const region=el('div','','u48-evidence');
  const box=el('div','','u48-evidence-turns');
  box.hidden=!revealedSources.has(key);
  for(const i of indices){
   const src=exact[i];
   const card=el('article','','u48-source-card');
   card.append(el('h6','Original source · turn '+(src.index+1)+' · '+src.speaker),french(src.fr));
   box.append(card);
  }
  const control=button(box.hidden?'Reveal exact original French evidence':'Hide original French evidence',()=>{
   if(revealedSources.has(key))revealedSources.delete(key);else revealedSources.add(key);
   box.hidden=!revealedSources.has(key);
   control.textContent=box.hidden?'Reveal exact original French evidence':'Hide original French evidence';
   control.setAttribute('aria-expanded',String(!box.hidden));
  });
  control.setAttribute('aria-expanded',String(!box.hidden));
  region.append(control,box,el('p','Revealed source text helps reflection, but the response is then transcript-assisted. A source quote is never a recorded utterance.','u48-notice'));
  return region;
 }
 function go(next:0|1|2):void{
  turn=next;render(true);
 }
 function render(focus=false):void{
  main.replaceChildren();nav.replaceChildren();
  progress.textContent='Conversation turn '+(turn+1)+' / 3 · '+(route?route.choice:'Choose a strategic priority')+
   ' · '+reported.size+' self-reported rehearsals; no verified speech or formal grade.';
  const title=el('h5',turn===0?'1 · Respond and choose your priority':turn===1?'2 · Negotiate under challenge':'3 · Repair, revise and close');
  title.tabIndex=-1;main.append(title);
  if(focus)title.focus({preventScroll:true});
  if(turn===0){
   main.append(el('p','Hypothetical stakeholder · opening question','u48-label'),
    french(scene.opening),french(scene.openingTask,'u48-task'),
    notes('opening','Private French opening · optional outline, never saved','D’après les données disponibles… Toutefois… Je privilégierais…'),
    rehearsal('opening'),
    el('h6','Choose which legitimate priority your next interlocutor challenges'));
   const choices=el('div','','u48-route-buttons');
   for(const candidate of scene.routes){
    choices.append(button(candidate.choice,()=>{
     route=candidate;move=null;go(1);
    }));
   }
   main.append(choices);
   nav.append(button('Review four exact original dialogue turns',()=>{
    revealedSources.has('opening')?revealedSources.delete('opening'):revealedSources.add('opening');
    render();
   }));
   if(revealedSources.has('opening'))main.append(sourceCards('opening',[0,1,2,3]));
  }
  if(turn===1&&route){
   main.append(el('p','Strategic objective · '+route.objective,'u48-label'),
    el('p',route.interlocutor+' — newly authored hypothetical objection','u48-label'),
    french(route.question),french(route.task,'u48-task'),
    notes('challenge-'+route.id,'Private French spoken response to this objection','Je comprends votre argument. Cependant, selon… Il faudrait…'),
    rehearsal('challenge-'+route.id),
    sourceCards('challenge-'+route.id,route.sourceIndices),
    el('h6','Select your proposed negotiating move; the partner’s next line will change'));
   const choices=el('div','','u48-moves');
   for(const choice of route.moves){
    const line=button(choice.text,()=>{move=choice;render();});
    line.setAttribute('aria-pressed',String(move?.id===choice.id));
    choices.append(line);
   }
   main.append(choices);
   if(move){
    const verdict=evaluateB2NegotiationMove(move);
    const feedback=el('p',(verdict.supported?'Source-grounded proposal. ':'Source overclaim — revise. ')+
     verdict.feedback+' This feedback assesses the selected move, NOT your free French notes or speech.','u48-choice-feedback');
    feedback.setAttribute('role','status');main.append(feedback);
    nav.append(button('Hear the consequence: stakeholder follow-up →',()=>go(2)));
   }
   nav.append(button('← Reconsider strategic priority',()=>go(0)));
  }
  if(turn===2&&route&&move){
   const key='final-'+route.id+'-'+move.id;
   main.append(el('p','Hypothetical stakeholder · responds to YOUR chosen move','u48-label'),
    french(move.followUp),french(route.finalTask,'u48-task'),
    notes(key,'Private French final reply · revise your negotiation independently','Pour préciser… Je reconnais… Selon les sources… À condition que…'),
    rehearsal(key),el('h6','Four specific self-review questions'));
   const criteria=el('ol','','u48-criteria');
   for(const criterion of route.criteria){const li=el('li',criterion);li.lang='fr';criteria.append(li);}main.append(criteria);
   const model=el('div','','u48-model');model.hidden=!revealedModels.has(key);
   model.append(el('h6','Authored possible French response'),french(route.model),
    el('p','Compare source attribution, concession, uncertainty and your conditional proposal yourself. This is not feedback generated from what you said.','u48-notice'));
   const reveal=button(model.hidden?'Reveal authored French comparison':'Hide authored French comparison',()=>{
    if(revealedModels.has(key))revealedModels.delete(key);else revealedModels.add(key);
    model.hidden=!revealedModels.has(key);
    reveal.textContent=model.hidden?'Reveal authored French comparison':'Hide authored French comparison';
    reveal.setAttribute('aria-expanded',String(!model.hidden));
   });
   reveal.setAttribute('aria-expanded',String(!model.hidden));
   main.append(reveal,model,sourceCards('final-'+route.id,[...route.sourceIndices,0,3].filter((v,i,arr)=>arr.indexOf(v)===i)));
   const review=el('div','','u48-draft-comparison');review.hidden=true;
   const compare=button('Compare all three of your private French outlines',()=>{
    const items:[string,string][]=[
     ['1 · Opening',drafts.get('opening')??''],
     ['2 · Response to objection',drafts.get('challenge-'+route!.id)??''],
     ['3 · Final revised proposal',drafts.get(key)??'']
    ];
    review.replaceChildren(el('h6','Private progression — not automatically evaluated'));
    for(const [label,value] of items)review.append(el('strong',label),french(value.trim()||'(No written outline; oral rehearsal may still have taken place.)'));
    review.append(el('p','Review whether your recommendation became more precise after the new stakeholder response. The app cannot verify what you spoke aloud.','u48-notice'));
    review.hidden=false;
   });
   main.append(compare,review);
   nav.append(button('← Reconsider the negotiating move',()=>go(1)),
    button('Start another negotiation route',()=>{route=null;move=null;go(0);}));
  }
  const reset=button('Clear all private negotiation drafts',()=>{
   drafts.clear();reported.clear();revealedModels.clear();updateDraft();render();
  });
  nav.append(reset);
 }
 render();
 const cleanup=()=>{
  if(disposed)return;disposed=true;drafts.clear();reported.clear();revealedSources.clear();
  signal.removeEventListener('abort',cleanup);root.remove();
 };
 signal.addEventListener('abort',cleanup,{once:true});
 return cleanup;
}
