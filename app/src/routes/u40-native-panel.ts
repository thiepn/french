import {resolveU40LessonLinks,handoffU40CanonicalWord,type U40LessonLinks} from '../core/unified/u40-lexical-bridge';
import {readSrsByNoteIds,readActiveStudySession} from '../core/learner/repository';
import {createU40LessonVocabularySession} from '../core/learner/study-session-builder';
import type {CanonicalSrsRecordV1} from '../core/learner/model';
import './unified-u40.css';

type Options={
 signal:AbortSignal;
 onReview:()=>void;
 onLearn:()=>void;
 onWords:(id:string)=>void;
};
const el=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,cls?:string)=>{
 const item=document.createElement(tag);if(text!==undefined)item.textContent=text;
 if(cls)item.className=cls;return item;
};
const action=(title:string,run:()=>void)=>{
 const b=el('button',title,'secondary-action compact-action');b.type='button';b.addEventListener('click',run);return b;
};
export function handoffU40Word(id:string):void{handoffU40CanonicalWord(id);}
function statusOf(records:readonly CanonicalSrsRecordV1[],now:number):string{
 if(records.some(s=>s.status!=='new'&&!s.suspended&&s.dueAt>0&&
    s.dueAt<=now&&(!s.buriedUntil||s.buriedUntil<=now)))return'Due for native review';
 if(records.some(s=>s.status!=='new'&&s.seen>0))return'Studied · next review scheduled';
 if(records.some(s=>s.suspended))return'Native card suspended';
 return'Not introduced in native Review';
}
export async function mountU40NativeLesson(host:HTMLElement,lessonId:string,opts:Options):Promise<void>{
 host.replaceChildren(el('p','Matching original lesson expressions against canonical Words…','u40-muted'));
 const live=()=>!opts.signal.aborted&&host.isConnected;
 try{
  const mapped=await resolveU40LessonLinks(lessonId,opts.signal);
  if(!live())return;
  const ids=[...new Set(mapped.links.flatMap(item=>item.native?[item.native.id]:[]))];
  const [records,active]=await Promise.all([readSrsByNoteIds(ids),readActiveStudySession()]);
  if(!live())return;
  host.replaceChildren();
  const heading=el('h3','Native vocabulary connections');
  const summary=el('p',mapped.matched+' uniquely matched · '+mapped.ambiguous+
    ' ambiguous · '+mapped.unmatched+' not linked, of '+mapped.links.length+' original expressions.','u40-muted');
  const notice=el('p','Matches require exact French forms and English gloss clauses. Different senses or inflections stay unlinked. Original examples are authored context, not scheduled grades.','u40-muted');
  const tool=el('div',undefined,'u40-toolbar');
  const result=el('p','','u40-result');result.setAttribute('role','status');
  const start=action(active?'Resume existing native session':'Study linked due + new',()=>{
   if(active){opts.onReview();return;}
   start.disabled=true;result.textContent='Preparing native study…';
   void createU40LessonVocabularySession(lessonId).then(out=>{
    if(!live())return;
    if(out.kind==='empty'){
     result.textContent='No eligible matched cards under your current daily limits. Existing due dates remain unchanged.';
     start.disabled=false;
    }else opts.onReview(); // Existing session, native grading, undo and resume.
   }).catch(error=>{
    if(live()){start.disabled=false;result.textContent='Could not start native study. No original exercise grade was imported.';}
    console.error('U40 native session start failed',error);
   });
  });
  start.disabled=!active&&mapped.matched===0;
  tool.append(start,action('All scheduled reviews',opts.onReview),
    action('Learn from full canonical corpus',opts.onLearn));
  const list=el('ul',undefined,'u40-lexemes');
  const now=Date.now();
  for(const link of mapped.links){
   const item=el('li',undefined,'u40-lexeme');
   const title=el('strong',link.source.french);title.lang='fr';
   item.append(title,el('span',' — '+link.source.english,'u40-gloss'));
   item.append(el('p',link.source.context,'u40-context'));
   const detail=el('p',link.native?
      'Canonical '+link.native.word+' · '+link.native.meaning+' · '+
      statusOf(records.get(link.native.id)||[],now):
      link.explanation,'u40-muted');
   item.append(detail);
   if(link.native){
    const id=link.native.id;
    item.append(action('Open matched word in Words',()=>opts.onWords(id)));
   }
   list.append(item);
  }
  host.append(heading,summary,notice,tool,result,list);
 }catch(error){
  if(!live())return;
  host.replaceChildren(el('p','Canonical vocabulary index is unavailable. Continue with the original source vocabulary below; no note or review data was changed.','u40-muted'));
  console.error('U40 matching failed',error);
 }
}
