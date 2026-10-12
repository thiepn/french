import {ORIGINAL_JOURNEYS,journeyStatus,validateJourneys} from '../core/unified/u4-journeys';
import {ORIGINAL_PATH_LESSONS} from '../core/unified/u3-pathways';
import {exportPracticeCheckpoint,inspectPracticeCheckpoint,type PracticeEvent} from '../core/unified/u4-checkpoints';
import {mountMissionWorkspace} from './u5-mission-panel';
import './unified-u4.css';

interface JourneyActions{
 readonly open:(lessonId:string)=>void;
 readonly practiced:ReadonlySet<string>;
 readonly events:()=>readonly PracticeEvent[];
 readonly restore:(events:readonly PracticeEvent[],practicedIds:readonly string[])=>void;
 readonly signal:AbortSignal;
}
function el<K extends keyof HTMLElementTagNameMap>(tag:K,label?:string):HTMLElementTagNameMap[K]{
 const result=document.createElement(tag);
 if(label!==undefined)result.textContent=label;
 return result;
}
function button(label:string,onClick:()=>void):HTMLButtonElement{
 const b=el('button',label);b.type='button';b.className='secondary-action compact-action';
 b.addEventListener('click',onClick);return b;
}
export function mountJourneyWorkspace(host:HTMLElement,actions:JourneyActions):{refresh:()=>void}{
 const failures=validateJourneys();
 if(failures.length)throw Error('Journey dependencies invalid: '+failures.join('; '));
 host.replaceChildren();
 host.className='u4-journeys';
 const heading=el('h3','Guided journeys');
 const info=el('p','Four connected original study routes. Prerequisites are recommendations, not locks or proficiency claims.');
 const label=el('label','Choose a journey');
 const select=el('select');select.setAttribute('aria-label','Guided journey');
 for(const journey of ORIGINAL_JOURNEYS){
  const option=el('option',journey.title);option.value=journey.id;select.append(option);
 }
 label.append(select);
 const summary=el('p');summary.dataset.journeySummary='';summary.setAttribute('role','status');
 const listing=el('ol');listing.className='u4-journey-stops';
 const actionsRow=el('div');actionsRow.className='u4-checkpoint-actions';
 const missionHost=el('section');missionHost.dataset.u5Missions='';
 const missionWorkspace=mountMissionWorkspace(missionHost,{openLesson:actions.open,signal:actions.signal});
 const download=button('Export local practice checkpoint',()=>{
  const events=actions.events();
  if(!events.length){status.textContent='Complete a local recall attempt before exporting.';return;}
  try{
   const data=exportPracticeCheckpoint(events);
   const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
   const anchor=el('a');anchor.href=url;anchor.download='french-u4-practice-checkpoint.json';
   anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   status.textContent='Exported self-reported, non-authoritative practice events. No learner mastery exported.';
  }catch{status.textContent='Could not export; practice events are unchanged.';}
 });
 const fileLabel=el('label','Inspect an exported checkpoint');
 const file=el('input');file.type='file';file.accept='.json,application/json';file.setAttribute('aria-label','Practice checkpoint file');
 fileLabel.append(file);
 const clear=button('Clear temporary practice',()=>{
  actions.restore([],[]);
  status.textContent='Local course practice reset. Native progress was never changed.';
  refresh();
 });
 const status=el('p','No file inspected.'); // assigned styling below
 status.className='u4-checkpoint-status';status.setAttribute('role','status');
 file.addEventListener('change',async()=>{
  const picked=file.files?.[0];if(!picked)return;
  try{
   if(picked.size>64*1024){status.textContent='Blocked: checkpoint larger than 64 KiB.';return;}
   const raw=await picked.text();
   if(actions.signal.aborted)return;
   const replay=inspectPracticeCheckpoint(raw);
   if(replay.status!=='valid'){
    status.textContent='Blocked: '+replay.reasons.join('; ')+'. No practice data replaced.';return;
   }
   // Explicit local replay only. An edited file could simulate correct answers:
   // never trust its contents for authoritative learner history.
   actions.restore(replay.events,replay.practicedLessons);
   status.textContent='Replayed '+replay.events.length+' self-reported events; '+
    replay.practicedLessons.length+' temporary lesson sets. This is not authenticated evidence or mastery.';
   refresh();
  }catch{if(!actions.signal.aborted)status.textContent='File could not be inspected. Nothing changed.';}
  finally{file.value='';}
 });
 actionsRow.append(download,fileLabel,clear);
 host.append(heading,info,label,summary,listing,actionsRow,status);
 // Keep the separate mission handoff outside the legacy U4 checkpoint selector
 // scope; the original U4 browser contract must continue to match exactly one file input.
 host.after(missionHost);
 const refresh=()=>{
  const chosen=ORIGINAL_JOURNEYS.find(j=>j.id===select.value)??ORIGINAL_JOURNEYS[0];
  const state=journeyStatus(chosen.id,actions.practiced)!;
  missionWorkspace.setJourney(chosen.id);
  summary.textContent=chosen.purpose+' · '+state.practiced+'/'+state.total+
   ' locally practiced · '+(state.suggestedId?
    'Suggested next: '+(ORIGINAL_PATH_LESSONS.find(l=>l.id===state.suggestedId)?.title??''):'All journey exercises attempted successfully.');
  listing.replaceChildren();
  for(const [i,id] of chosen.lessonIds.entries()){
   const lesson=ORIGINAL_PATH_LESSONS.find(item=>item.id===id)!;
   const item=el('li');item.className='u4-journey-stop';
   const done=actions.practiced.has(id);
   const action=button((i+1)+'. '+lesson.title+(done?' · practiced':''),()=>actions.open(id));
   action.dataset.journeyLesson=id;
   if(id===state.suggestedId)action.classList.add('u4-suggested');
   item.append(action);
   if(id===state.suggestedId&&state.advisoryMissing.length){
    item.append(el('small','Recommended preparation: '+state.advisoryMissing.join(', ')));
   }
   listing.append(item);
  }
 };
 select.addEventListener('change',refresh);
 refresh();
 return {refresh};
}
