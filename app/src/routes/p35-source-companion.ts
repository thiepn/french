import {loadSourceGraphState} from '../core/conversation/p35-storage';
import {getP35SourceScenario} from '../core/conversation/p35-graphs';
import {sourcePrompt, type SourceActive} from '../core/conversation/p35-runtime';
import {SOURCE_HANDOFF_KEY,matchSourceHandoff,type SourceHandoff} from '../core/conversation/source-transfer';

/** Only a validated active P35 original source turn crosses the route boundary.
 * The learner's answer is never copied into storage or sent to another route.
 */
export async function consumeSourceCompanion(kind:SourceHandoff['kind']){
 const raw=sessionStorage.getItem(SOURCE_HANDOFF_KEY);
 if(!raw)return null;
 sessionStorage.removeItem(SOURCE_HANDOFF_KEY);
 const state=await loadSourceGraphState();
 const valid=matchSourceHandoff(raw,state,kind,Date.now());
 if(!valid||!state.active)return null;
 const graph=getP35SourceScenario(valid.scenarioId);
 const node=graph?.nodes[valid.nodeId];
 if(!graph||!node||node.end)return null;
 return{graph,node,active:state.active as SourceActive,prompt:sourcePrompt(state.active),state};
}
export function sourceCompanionPanel(title:string,context:string){
 const section=document.createElement('section');
 section.className='p35-source-companion';
 section.setAttribute('aria-label',title);
 const heading=document.createElement('h2');heading.textContent=title;
 const description=document.createElement('p');description.textContent=context;
 section.append(heading,description);
 return section;
}
