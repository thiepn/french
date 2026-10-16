import type {SourceGraphState} from './p35-runtime.ts';
export const SOURCE_HANDOFF_KEY='french-vnext-p35-source-handoff';
export type SourceHandoff={kind:'listen'|'write';scenarioId:string;nodeId:string;at:number};
/** The handoff is navigation intent, not a second owner of source graph work. */
export function createSourceHandoff(state:SourceGraphState,kind:SourceHandoff['kind'],now:number):SourceHandoff{
 const active=state.active;
 if(!active||active.support<1||!Number.isFinite(now))throw Error('SOURCE_HANDOFF_REQUIRES_SAVED_SUPPORT');
 if(kind==='write'&&active.support!==2)throw Error('WRITING_TRANSFER_REQUIRES_MODEL_SUPPORT');
 return{kind,scenarioId:active.scenarioId,nodeId:active.nodeId,at:now};
}
export function matchSourceHandoff(raw:string|null,state:SourceGraphState,kind:SourceHandoff['kind'],now:number):SourceHandoff|null{
 if(!raw||raw.length>800||!Number.isFinite(now))return null;
 let candidate:unknown;
 try{candidate=JSON.parse(raw);}catch{return null;}
 if(!candidate||typeof candidate!=='object'||Array.isArray(candidate))return null;
 const row=candidate as Record<string,unknown>,active=state.active;
 if(!active||row.kind!==kind||row.scenarioId!==active.scenarioId||
    row.nodeId!==active.nodeId||typeof row.at!=='number'||!Number.isFinite(row.at)||
    now-row.at>15*60*1000||row.at-now>60*1000)return null;
 if(kind==='write'?active.support!==2:active.support<1)return null;
 return{kind,scenarioId:active.scenarioId,nodeId:active.nodeId,at:row.at};
}

/** Explicit, short-lived same-tab draft transfer. The text is never placed in
 * sessionStorage/IDB/history, published to Hub, or promoted as independent credit.
 * A reload destroys it. A different graph/node/run cannot consume it.
 */
let pendingDraft:{runId:string;scenarioId:string;nodeId:string;text:string;at:number}|null=null;
export function offerSourceDraft(state:SourceGraphState,text:string,now:number):boolean{
 const active=state.active,trimmed=text.trim();
 if(!active||active.support!==2||!trimmed||trimmed.length>650||
   !Number.isFinite(now)){pendingDraft=null;return false;}
 pendingDraft={runId:active.runId,scenarioId:active.scenarioId,nodeId:active.nodeId,
  text:trimmed,at:now};
 return true;
}
export function consumeSourceDraft(state:SourceGraphState,now:number):string|null{
 const saved=pendingDraft;pendingDraft=null;
 const active=state.active;
 if(!saved||!active||active.support!==2||!Number.isFinite(now)||
    now-saved.at>5*60*1000||saved.at-now>1000||
    saved.runId!==active.runId||saved.scenarioId!==active.scenarioId||
    saved.nodeId!==active.nodeId)return null;
 return saved.text;
}
