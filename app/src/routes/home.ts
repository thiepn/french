import './home.css';
import type { RouteContext } from '../core/types';
import { countDueSrs,readActiveStudySession,readCanonicalLearnerState,readRecentReviewEvents } from '../core/learner/repository';
import { rankNativeActivities,type CoachAction,type CoachInput } from '../core/learner/study-coach';
import {loadConversationState} from '../core/conversation/storage';

const DAY=86_400_000;
function node<K extends keyof HTMLElementTagNameMap>(tag:K,text='',className=''):HTMLElementTagNameMap[K]{
  const item=document.createElement(tag);if(text)item.textContent=text;if(className)item.className=className;return item;
}
function quantity(value:unknown,fallback:number):number{
  const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):fallback;
}
function summarize(events:Awaited<ReturnType<typeof readRecentReviewEvents>>,now:number):CoachInput['recent']{
  const recent=events.filter(event=>event.t>=now-7*DAY&&event.t<=now+DAY);
  return{
    reviews:recent.filter(event=>!event.practiceOnly).length,
    reading:recent.filter(event=>/reading|read-/i.test(event.practice)).length,
    listening:recent.filter(event=>/listen/i.test(event.practice)).length,
    speaking:recent.filter(event=>/spoken|speaking|shadow/i.test(event.practice)).length
  };
}
export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
  const host=node('section','','page home-workbench');
  const top=node('header','','home-topline');
  const heading=node('h1','Continue French');
  const date=node('time',new Date().toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'}));
  top.append(heading,date);
  const mainGrid=node('div','','home-study-grid');
  const focus=node('section','','home-focus');
  focus.setAttribute('aria-label','Next action');
  const side=node('aside','','home-choices');
  side.setAttribute('aria-label','Other practice');
  mainGrid.append(focus,side);
  const footer=node('section','','home-evidence');
  footer.setAttribute('aria-label','Learning snapshot');
  footer.append(node('p','Loading your saved learning activity…','home-loading'));
  host.append(top,mainGrid,footer);main.replaceChildren(host);

  const now=Date.now();
  try{
    const [due,session,learner,events,conversation]=await Promise.all([
      countDueSrs(now),readActiveStudySession(now),readCanonicalLearnerState(),readRecentReviewEvents(400),loadConversationState()
    ]);
    if(signal.aborted)return;
    const remaining=session?Math.max(0,session.queueIds.length-session.cursor):0;
    const recent=summarize(events,now);
    const newLimit=quantity(learner?.settings?.dailyNewLimit,20);
    const actions=rankNativeActivities({
      due,newLimit,remainingSession:remaining,activeConversation:Boolean(conversation.active),
      recent:{...recent,conversation:conversation.history.filter(run=>run.completedAt>=now-7*DAY).length}
    });
    const first=actions[0];
    if(!first)return;
    const launch=(entry:CoachAction)=>{
      if(signal.aborted)return;
      // Review always respects the resumable session; the route owns fresh due-session creation.
      navigate(entry.route);
    };

    focus.replaceChildren();
    focus.append(node('p','NEXT ACTION','home-section-label'),node('h2',first.title),node('p',first.detail,'home-focus-detail'));
    const start=node('button',first.action+' →','home-start');
    start.type='button';start.addEventListener('click',()=>launch(first));focus.append(start);
    if(remaining>0)focus.append(node('p','An unfinished session takes priority over starting a new one.','home-note'));
    side.replaceChildren(node('h2','Other ways to practise'));
    const list=node('div','','home-option-list');
    for(const action of actions.slice(1,5)){
      const control=node('button','','home-option');control.type='button';
      const copy=node('span','','home-option-copy');
      copy.append(node('strong',action.title),node('small',action.detail));
      control.append(copy,node('span','↗','home-option-arrow'));
      control.addEventListener('click',()=>launch(action));
      list.append(control);
    }
    side.append(list);
    footer.replaceChildren();
    const metrics=node('div','','home-facts');
    const facts:Array<[string,string]>=[
      ['Due now',String(due)],
      ['Saved session',remaining?remaining+' left':'None'],
      ['Recent review answers',String(recent.reviews)],
      ['Study target',String(learner?.studyPlan?.targetLevel??'A1')]
    ];
    for(const [label,value] of facts){
      const cell=node('div','','home-fact');
      cell.append(node('span',label),node('strong',value));metrics.append(cell);
    }
    footer.append(metrics,node('p','Recommendations use stored learning activity and current scheduling, not a proficiency diagnosis.','home-disclaimer'));
  }catch(error){
    if(signal.aborted)return;
    focus.replaceChildren(node('p','STUDY','home-section-label'),node('h2','Your French practice'));
    const link=node('button','Open learning →','home-start');link.type='button';link.addEventListener('click',()=>navigate('learn'));focus.append(link);
    side.replaceChildren(node('p','Saved recommendations are unavailable. Your study data has not been changed.','home-note'));
    footer.replaceChildren(node('p','Local learning remains available even when the study summary cannot load.','home-disclaimer'));
    console.warn('Native French Study Coach is unavailable',error);
  }
}
