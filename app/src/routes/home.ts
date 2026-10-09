import './home.css';
import type { RouteContext } from '../core/types';
import { countDueSrs,readActiveStudySession,readCanonicalLearnerState,readRecentReviewEvents } from '../core/learner/repository';
import { rankNativeActivities,type CoachAction,type CoachInput } from '../core/learner/study-coach';
import {loadConversationState} from '../core/conversation/storage';
import {replaceCanonicalFeatureState} from '../core/learner/repository';
import {composeAdaptiveBlock,launchAdaptiveStep,observeNativeCompletion,normalizeAdaptiveBlock,type CompletionCounts,type AdaptiveBlock} from '../core/learner/adaptive-block';

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
    speaking:recent.filter(event=>/spoken|speaking|shadow/i.test(event.practice)).length,
    writing:recent.filter(event=>event.practice.startsWith('written-')).length
  };
}

function completionCounts(events:Awaited<ReturnType<typeof readRecentReviewEvents>>,
  learner:Awaited<ReturnType<typeof readCanonicalLearnerState>>,
  conversation:Awaited<ReturnType<typeof loadConversationState>>):CompletionCounts{
  const practices=events.map(e=>String(e.practice??''));
  const reading=learner?.featureState?.v550Reading as {history?:Record<string,{completionCount?:number}>}|undefined;
  const open=learner?.featureState?.v5120OpenWorld as {sessions?:unknown[]}|undefined;
  return {
    review:events.filter(e=>!e.practiceOnly).length,
    read:Object.values(reading?.history??{}).reduce((n,e)=>n+Math.max(0,Number(e.completionCount)||0),0),
    listen:practices.filter(p=>p.startsWith('contextual-listening')).length,
    speak:practices.filter(p=>p.startsWith('spoken-')).length,
    write:practices.filter(p=>p.startsWith('written-')||p.startsWith('verified-usage')).length,
    conversation:conversation.history.filter(x=>Number(x.completedAt)>0).length,
    'open-world':Array.isArray(open?.sessions)?open.sessions.length:0
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
    const counts=completionCounts(events,learner,conversation);
    let block=normalizeAdaptiveBlock(learner?.featureState?.v5130AdaptiveBlock);
    if(block&&block.status==='active'){
      const next=observeNativeCompletion(block,counts,Date.now());
      if(next.cursor!==block.cursor){
        await replaceCanonicalFeatureState('v5130AdaptiveBlock',next);
        block=next;
      }
    }
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
    const showBlock=(plan:AdaptiveBlock)=>{
      focus.replaceChildren(node('p','ADAPTIVE BLOCK','home-section-label'));
      if(plan.status==='completed'){
        focus.append(node('h2','Block completed'),node('p','This is observed activity completion, not proof of language mastery.','home-focus-detail'));
      }else{
        const step=plan.steps[plan.cursor];
        focus.append(node('h2','Step '+(plan.cursor+1)+' of '+plan.steps.length+': '+step.title),
          node('p',plan.steps.map((s,i)=>(i<plan.cursor?'✓ ':i===plan.cursor?'→ ':'· ')+s.title).join(' / '),'home-focus-detail'));
        const go=node('button',step.launchedAt?'Return to activity →':'Begin activity →','home-start');
        go.type='button';go.addEventListener('click',async()=>{
          if(signal.aborted)return;
          try{await replaceCanonicalFeatureState('v5130AdaptiveBlock',launchAdaptiveStep(plan,counts,Date.now()));navigate(step.route);}
          catch(error){console.warn('Could not preserve native activity ownership',error);}
        });focus.append(go);
      }
      const end=node('button','End block; keep study progress','home-end-block');end.type='button';
      end.addEventListener('click',async()=>{
        try{await replaceCanonicalFeatureState('v5130AdaptiveBlock',null);
          focus.replaceChildren(node('p','Block ended. Native study history remains unchanged.','home-note'));
          const back=node('button','Return to recommendations','home-start');back.type='button';
          back.addEventListener('click',()=>void mount({main,signal,navigate}));focus.append(back);
        }catch(error){console.warn('Could not end adaptive block',error);}
      });focus.append(end);
    };
    if(block)showBlock(block);
    else if(!remaining&&!conversation.active){
      const proposal=composeAdaptiveBlock(actions,Date.now());
      if(proposal){
        const build=node('button','Build a short adaptive block','home-build-block');build.type='button';
        build.addEventListener('click',async()=>{
          try{await replaceCanonicalFeatureState('v5130AdaptiveBlock',proposal);showBlock(proposal);}
          catch(error){console.warn('Could not save adaptive block',error);}
        });focus.append(build);
        focus.append(node('p','Up to three complementary activities, around 26 minutes. The native practice mode controls completion.','home-note'));
      }
    }

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
