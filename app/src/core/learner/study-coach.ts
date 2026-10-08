import type { RouteId } from '../types';

export type CoachRoute=Extract<RouteId,'review'|'learn'|'read'|'listen'|'speak'|'conversation'|'write'|'words'>;
export interface CoachInput{
  due:number;
  newLimit:number;
  remainingSession:number;
  activeConversation?:boolean;
  recent:{reviews:number;reading:number;listening:number;speaking:number;conversation?:number;writing?:number};
}
export interface CoachAction{
  id:'resume'|'conversation-resume'|'review'|'learn'|'read'|'listen'|'speak'|'conversation'|'write';
  route:CoachRoute;
  title:string;
  detail:string;
  action:string;
  score:number;
}
function count(value:number):number{return Number.isFinite(value)?Math.max(0,Math.floor(value)):0;}
export function rankNativeActivities(raw:CoachInput):CoachAction[]{
  const due=count(raw.due),newLimit=count(raw.newLimit),remaining=count(raw.remainingSession);
  const r=raw.recent;
  const candidates:CoachAction[]=[];
  if(raw.activeConversation)candidates.push({
    id:'conversation-resume',route:'conversation',title:'Resume your conversation',
    detail:'An unfinished exchange is waiting; return to the next French turn.',
    action:'Resume conversation',score:1100
  });
  if(remaining>0)candidates.push({
    id:'resume',route:'review',title:'Finish your session',
    detail:remaining+' saved item'+(remaining===1?'':'s')+' to complete. Keep your current study order.',
    action:'Resume session',score:1000
  });
  if(due>0)candidates.push({
    id:'review',route:'review',title:'Review what is due',
    detail:due+' scheduled skill'+(due===1?'':'s')+' due now. Retrieval has priority over new content.',
    action:'Review due items',score:220+Math.min(80,due*2)
  });
  if(newLimit>0)candidates.push({
    id:'learn',route:'learn',title:'Learn new French',
    detail:'Add vocabulary at your daily pace, with staged active recall.',
    action:'Open learning',score:125+(count(r.reviews)===0?65:0)-(due>=40?55:0)
  });
  // These launchable modes provide practice evidence but do not certify CEFR mastery.
  const streams=[
    {id:'read' as const,route:'read' as const,title:'Read in context',action:'Open reading',detail:'Work through a graded text and save useful discoveries.',recent:count(r.reading),base:104},
    {id:'listen' as const,route:'listen' as const,title:'Train your listening',action:'Open listening',detail:'Listen first and check what you understood.',recent:count(r.listening),base:102},
    {id:'speak' as const,route:'speak' as const,title:'Practise speaking',action:'Open speaking',detail:'Produce French aloud with support-aware feedback.',recent:count(r.speaking),base:100}
  ];
  for(const stream of streams)candidates.push({
    ...stream,score:stream.base+Math.round(32/(1+stream.recent))
  });
  candidates.push({
    id:'write',route:'write',title:'Write in French',
    detail:'Construct expressions and apply sentences in new situations.',
    action:'Open writing',score:112+Math.round(36/(1+count(r.writing??0)))
  });
  candidates.push({
    id:'conversation',route:'conversation',title:'Practise a real exchange',
    detail:'Fifteen text-first scenarios, real-world missions and adaptive sets.',
    action:'Open conversation',score:99+Math.round(32/(1+count(r.conversation??0)))
  });
  return candidates.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
