import './write.css';
import type {RouteContext} from '../core/types';
import {loadStableSentenceExercises,loadStableUsageCorpus} from '../core/content/loader';
import {diagnoseSentence,type SentenceDiagnosis} from '../core/content/sentence-diagnosis';
import {recordPracticeEvidence} from '../core/learner/repository';
import {
  WRITING_MODES,currentWritingExercise,completeWritingAttempt,revealWritingSupport,
  writingExercises,type WritingMode,type WritingState,type WritingAttempt
} from '../core/writing/session';
import {loadWritingState,saveWritingState} from '../core/writing/storage';
import {
  USAGE_MODES,currentUsageRecord,repairCandidates,revealUsageSupport,completeUsageAttempt,
  diagnoseUsage,usageCue,safeUsageState,type UsageMode,type UsageState,type UsageDiagnosis,type UsageOutcome
} from '../core/usage/session';
import {loadUsageState,saveUsageState} from '../core/usage/storage';
import {rankUsageCandidates,usageAggregate,transferCueVariant,usageRecordMastery} from '../core/usage/mastery';

function element<K extends keyof HTMLElementTagNameMap>(tag:K,content='',className=''):HTMLElementTagNameMap[K]{
  const e=document.createElement(tag);if(content)e.textContent=content;if(className)e.className=className;return e;
}
function control(label:string,className='secondary-action compact-action'):HTMLButtonElement{
  const e=element('button',label,className);e.type='button';return e;
}
const TITLES:Record<WritingMode,string>={phrase:'Build a phrase',sentence:'Construct a sentence',transfer:'Transfer to a new situation'};
const CAPTIONS:Record<WritingMode,string>={
  phrase:'Complete or construct useful French expressions.',
  sentence:'Translate or transform full sentences in context.',
  transfer:'Apply a familiar construction to a different situation.'
};
export async function mount({main,signal}:RouteContext):Promise<void>{
  const host=element('section','','page write-workspace');
  host.append(element('p','ACTIVE PRODUCTION','eyebrow'),element('h1','Write'),
    element('p','Produce French from a prompt, inspect deterministic feedback, and decide whether the answer needs more practice. This does not change scheduled SRS.','lede'));
  const switcher=element('div','','write-switcher');
  switcher.setAttribute('role','group');switcher.setAttribute('aria-label','Writing workspaces');
  const tabs=element('div','','write-modes');tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Writing practice track');
  const message=element('p','Loading sentence exercises…','inline-status');message.setAttribute('aria-live','polite');
  const stage=element('div','','write-stage');
  host.append(switcher,tabs,message,stage);main.replaceChildren(host);

  const [pack,stateValue,usagePack,usageSaved]=await Promise.all([
    loadStableSentenceExercises(signal),loadWritingState(),loadStableUsageCorpus(signal),loadUsageState()
  ]);
  if(signal.aborted)return;
  let state:WritingState=stateValue,mode:WritingMode='phrase',busy=false,started=performance.now();
  let family:'writing'|'usage'='writing',usageMode:UsageMode='usage';
  let usageState:UsageState=safeUsageState(usageSaved,usagePack),usageStarted=performance.now();
  const save=async(next:WritingState)=>{await saveWritingState(next);state=next;};

  const drawUsage=()=>{
    const titles:Record<UsageMode,string>={
      usage:'Verified usage',production:'Active phrase production',
      transfer:'Phrase transfer',repair:'Repair previous errors'
    };
    tabs.replaceChildren();
    for(const name of USAGE_MODES){
      const count=name==='repair'?repairCandidates(usagePack,usageState).length:
        rankUsageCandidates(usagePack,usageState,name).length;
      const label=name==='usage'?'Usage':name==='production'?'Produce ('+count+')':name==='transfer'?'Transfer ('+count+')':'Repair ('+count+')';
      const btn=control(label,'write-tab'+(usageMode===name?' is-active':''));
      btn.setAttribute('aria-pressed',String(usageMode===name));
      btn.onclick=()=>{if(busy)return;usageMode=name;usageStarted=performance.now();draw();};
      tabs.append(btn);
    }
    const ranked=rankUsageCandidates(usagePack,usageState,usageMode);
    const rows=ranked.map(entry=>entry.record);
    const record=currentUsageRecord(usagePack,usageState,usageMode);
    const overview=usageAggregate(usagePack,usageState);
    stage.replaceChildren();
    if(!record){
      message.textContent=overview.sourceFrames+' source-tagged P10 frames · '+overview.usageSecure+' usage-secure · '+overview.transferSecure+' transfer-secure';
      const reason=usageMode==='repair'?'No unresolved phrase errors.':
        usageMode==='production'?'Complete a verified usage attempt to unlock full-frame production.':
        usageMode==='transfer'?'Transfer unlocks after two independent-source-frame practice attempts on the same construction.':
        'No source frames are available.';
      stage.append(element('p',reason,'write-note'));
      return;
    }
    const completed=usageState.history.filter(row=>row.mode===usageMode).length;
    message.textContent=overview.sourceFrames+' source-tagged P10 frames · '+completed+
      ' recorded '+usageMode+' attempts · '+rows.length+' eligible · practice-only';
    const metrics=element('div','','write-mastery-overview');
    for(const [label,value] of [
      ['Usage secure',overview.usageSecure],['Transfer ready',overview.transferReady],
      ['Transfer secure',overview.transferSecure],['Need refresh',overview.refresh],['Repair queue',overview.repair]
    ] as const){
      const item=element('div','','write-mastery-stat');
      item.append(element('strong',String(value)),element('span',label));metrics.append(item);
    }
    stage.append(metrics);
    const mastery=usageRecordMastery(record.id,usageState);
    const heading=element('div','','write-heading');
    heading.append(element('p','P10 / P11 · '+record.kind,'write-context'),
      element('h2',titles[usageMode]),
      element('p','Original P35 threshold: usage 3 attempts at 80%, refresh after 60 days; transfer 2 at 80%. C3 requires independent exact answers and distinct structural cues. These are practice indicators, not CEFR certification.','write-note'));
    const progress=element('div','','write-progress');
    progress.append(element('strong','Frame '+((usageState.modes[usageMode].index%rows.length)+1)+' / '+rows.length),
      element('small','Record '+record.id+' · '+mastery.usage.status+' usage · '+
        (mastery.transfer.secure?'transfer secure':mastery.transfer.ready?'transfer ready':'transfer locked')));
    const cueVariant=usageMode==='transfer'?transferCueVariant(usageState,record.id):0;
    const task=element('article','','write-task');
    task.append(element('p','SOURCE-FRAME TASK · '+ranked.find(item=>item.record.id===record.id)?.reason,'write-label'),
      element('p',usageCue(record,usageMode,cueVariant),'write-prompt'));
    if(usageMode==='transfer')task.append(element('p','Structural cue '+(cueVariant+1)+' of 3 · exact-source-frame exercise, not unrestricted conversation.','write-note'));
    const form=element('form','','write-form');
    const input=element('textarea','','write-answer');
    input.setAttribute('aria-label','Your French usage or phrase answer');
    input.rows=usageMode==='usage'?2:3;input.maxLength=400;input.spellcheck=true;
    input.placeholder=usageMode==='usage'?'Write the missing French element…':'Write the complete French frame…';
    const actions=element('div','','write-actions');
    const check=control('Check phrase','primary-action compact-action');check.type='submit';
    const hint=control('Show cue');const reference=control('Show verified frame');
    actions.append(check,hint,reference);form.append(input,actions);
    const support=element('p','','write-support');
    const showSupport=()=>{
      const level=usageState.modes[usageMode].support;
      support.textContent=level===2?'Verified frame · '+record.frame:
        level===1?'Hint · '+record.kind+'; anchor '+record.anchor:'';
    };
    showSupport();
    const feedback=element('div','','write-feedback');feedback.setAttribute('role','status');
    const decision=element('div','','write-assess');
    decision.setAttribute('aria-label','Save usage practice result');
    task.append(form,support,feedback,decision);
    const source=usagePack.sources[record.sourceKey];
    if(source?.url){
      const attribution=element('p','','write-source');
      attribution.append(document.createTextNode('P35 provenance · '));
      const link=element('a',source.label);link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';
      attribution.append(link);task.append(attribution);
    }
    stage.append(heading,progress,task);
    let diagnosis:UsageDiagnosis|null=null,submitted='';
    const setSupport=async(level:1|2)=>{
      if(busy)return;busy=true;
      try{usageState=revealUsageSupport(usageState,usageMode,level);await saveUsageState(usageState);showSupport();}
      catch(error){feedback.textContent='Could not persist the hint. Try again.';console.error(error);}
      finally{busy=false;}
    };
    hint.onclick=()=>void setSupport(1);
    reference.onclick=()=>void setSupport(2);
    const persist=async(outcome:UsageOutcome)=>{
      if(busy||!diagnosis)return;
      busy=true;decision.querySelectorAll('button').forEach(node=>(node as HTMLButtonElement).disabled=true);
      try{
        const at=Date.now();
        const next=completeUsageAttempt(usagePack,usageState,usageMode,record.id,outcome,diagnosis.code,at,cueVariant);
        // Atomic learner/activity/meta IDB transaction: no double-credited
        // activity when a separate progress write would otherwise fail.
        await recordPracticeEvidence({
          noteId:'usage:'+record.id,skill:'production',practice:'verified-usage-'+usageMode,
          direction:'en-fr',typed:true,correct:outcome==='matched'&&usageState.modes[usageMode].support===0,
          typedQuality:outcome==='matched'&&usageState.modes[usageMode].support===0?'exact':
            outcome==='self-assessed'?'manual-self-assessed':'review',
          responseMs:Math.max(0,Math.round(performance.now()-usageStarted)),
          supportLevel:usageState.modes[usageMode].support,errorCategory:diagnosis.code,
          theme:record.kind,manualJudgment:outcome
        },at,{key:'native-usage-v1',value:next});
        usageState=next;usageStarted=performance.now();draw();
      }catch(error){
        decision.querySelectorAll('button').forEach(node=>(node as HTMLButtonElement).disabled=false);
        feedback.textContent='The practice result was not committed. Please retry.';console.error(error);
      }finally{busy=false;}
    };
    form.addEventListener('submit',event=>{
      event.preventDefault();if(busy)return;
      submitted=input.value.trim();
      if(!submitted){feedback.textContent='Write an answer before checking.';return;}
      diagnosis=diagnoseUsage(submitted,record,usageMode,usagePack.records);
      feedback.replaceChildren(element('strong',diagnosis.label),element('p',diagnosis.detail),
        element('p','Verified reference · '+(usageMode==='usage'?record.blank:record.frame),'write-reference'));
      decision.replaceChildren();
      if(diagnosis.correct){
        const matched=control(usageState.modes[usageMode].support?'Save supported & next':'Save exact & next',
          'primary-action compact-action');
        matched.onclick=()=>void persist('matched');decision.append(matched);
      }else{
        const manual=control('Mark as self-assessed','primary-action compact-action');
        manual.onclick=()=>void persist('self-assessed');decision.append(manual);
      }
      const missed=control('Needs practice & next');
      missed.onclick=()=>void persist('needs-practice');
      const retry=control('Edit answer');
      retry.onclick=()=>{diagnosis=null;decision.replaceChildren();feedback.textContent='Edit and recheck to continue.';input.focus();};
      decision.append(missed,retry);
    });
    input.addEventListener('input',()=>{
      if(diagnosis&&input.value.trim()!==submitted){
        diagnosis=null;decision.replaceChildren();feedback.textContent='Answer changed. Recheck before saving.';
      }
    });
    input.focus({preventScroll:true});
  };
  const draw=()=>{
    if(signal.aborted)return;
    switcher.replaceChildren();
    for(const choice of ['writing','usage'] as const){
      const btn=control(choice==='writing'?'Sentence writing (P12)':'Usage & phrase transfer (P10/P11)',
        'write-switch'+(family===choice?' is-active':''));
      btn.setAttribute('aria-pressed',String(family===choice));
      btn.onclick=()=>{if(busy)return;family=choice;started=performance.now();usageStarted=performance.now();draw();};
      switcher.append(btn);
    }
    if(family==='usage'){drawUsage();return;}
    tabs.replaceChildren();
    for(const name of WRITING_MODES){
      const btn=control(name==='phrase'?'Phrases':name==='sentence'?'Sentences':'Transfer','write-tab'+(mode===name?' is-active':''));
      btn.setAttribute('aria-pressed',String(mode===name));
      btn.addEventListener('click',()=>{if(busy)return;mode=name;started=performance.now();draw();});
      tabs.append(btn);
    }
    const rows=writingExercises(pack,mode);
    const exercise=currentWritingExercise(pack,state,mode);
    stage.replaceChildren();
    if(!exercise){
      stage.append(element('p','No verified prompts available for this track.','write-note'));
      message.textContent='No exercises available.';return;
    }
    const current=state.modes[mode];
    const completed=state.history.filter(row=>row.mode===mode).length;
    message.textContent=rows.length+' verified prompts in this track · '+completed+' recorded attempts · local-first';
    const heading=element('div','','write-heading');
    heading.append(element('p',exercise.context+' · '+exercise.type,'write-context'),element('h2',TITLES[mode]),
      element('p',CAPTIONS[mode],'write-note'));
    const progress=element('div','','write-progress');
    progress.append(element('strong','Prompt '+((current.index%rows.length)+1)+' / '+rows.length),
      element('small',completed+' recorded attempts'));
    const task=element('article','','write-task');
    task.append(element('p','PROMPT','write-label'),element('p',exercise.prompt,'write-prompt'));
    const form=element('form','','write-form');
    const answer=element('textarea','','write-answer');answer.setAttribute('aria-label','Your written French answer');
    answer.placeholder='Écrivez votre réponse en français…';answer.rows=4;answer.maxLength=1200;answer.spellcheck=true;
    const actions=element('div','','write-actions');
    const check=control('Check answer','primary-action compact-action');check.type='submit';
    const hint=control('Hint');const model=control('Show reference');
    actions.append(check,hint,model);form.append(answer,actions);
    const support=element('p','','write-support');
    if(current.support>=1)support.textContent=current.support===2?'Reference · '+exercise.expected:'Construction · '+exercise.frame;
    const feedback=element('div','','write-feedback');feedback.setAttribute('role','status');
    const next=element('div','','write-assess');next.setAttribute('aria-label','Save writing assessment');
    task.append(form,support,feedback,next);
    stage.append(heading,progress,task);
    let diagnosis:SentenceDiagnosis|null=null;
    let submitted='';
    const setSupport=async(level:1|2)=>{
      if(busy)return;busy=true;
      try{await save(revealWritingSupport(state,mode,level));support.textContent=level===2?'Reference · '+exercise.expected:'Construction · '+exercise.frame;}
      catch(error){feedback.textContent='Could not save support state. Try again.';console.error(error);}
      finally{busy=false;}
    };
    hint.onclick=()=>void setSupport(1);
    model.onclick=()=>void setSupport(2);
    const record=async(outcome:WritingAttempt['outcome'])=>{
      if(busy||!diagnosis)return;
      busy=true;next.querySelectorAll('button').forEach(node=>(node as HTMLButtonElement).disabled=true);
      const currentSupport=state.modes[mode].support;
      // Only exact, independently produced answers receive objective credit.
      // A revealed hint or human self-assessment is practice, not verified skill.
      const correct=outcome==='matched'&&diagnosis.quality==='exact'&&currentSupport===0;
      try{
        const at=Date.now();
        const updated=completeWritingAttempt(pack,state,mode,exercise.id,outcome,diagnosis.code,at);
        // C4: save P12 cursor and practice evidence in one IDB transaction.
        await recordPracticeEvidence({
          noteId:'sentence:'+exercise.id,skill:'production',practice:'written-'+mode,
          direction:'en-fr',correct,typed:true,
          typedQuality:correct?diagnosis.quality:
            outcome==='self-assessed'?'manual-self-assessed':'review',
          responseMs:Math.max(0,Math.round(performance.now()-started)),
          supportLevel:currentSupport,errorCategory:diagnosis.code,
          sentenceExerciseId:exercise.id,sentenceDiagnosis:diagnosis.code,
          theme:exercise.context,manualJudgment:outcome
        },at,{key:'native-writing-v1',value:updated});
        state=updated;
        started=performance.now();draw();
      }catch(error){
        next.querySelectorAll('button').forEach(node=>(node as HTMLButtonElement).disabled=false);
        feedback.textContent='The result was not committed. Please retry.';console.error(error);
      }finally{busy=false;}
    };
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(busy)return;
      const entered=answer.value.trim();
      if(!entered){feedback.textContent='Write your sentence before checking it.';return;}
      diagnosis=diagnoseSentence(entered,exercise);submitted=entered;
      feedback.replaceChildren(element('strong',diagnosis.label),element('p',diagnosis.detail),
        element('p','Reference · '+exercise.expected,'write-reference'));
      next.replaceChildren();
      if(diagnosis.correct===true){
        const label=state.modes[mode].support?'Save supported & next':
          diagnosis.quality==='exact'?'Save correct & next':'Save close & next';
        const yes=control(label,'primary-action compact-action');
        yes.onclick=()=>void record('matched');next.append(yes);
      }else if(diagnosis.correct===null){
        const manual=control('Self-assess correct','primary-action compact-action');
        manual.onclick=()=>void record('self-assessed');next.append(manual);
      }
      const missed=control('Needs practice & next');
      missed.onclick=()=>void record('needs-practice');
      const retry=control('Edit answer');
      retry.onclick=()=>{diagnosis=null;submitted='';feedback.textContent='You can edit and check again.';next.replaceChildren();answer.focus();};
      next.append(missed,retry);
    });
    answer.addEventListener('input',()=>{
      if(diagnosis&&answer.value.trim()!==submitted){
        diagnosis=null;next.replaceChildren();feedback.textContent='Answer changed. Check again before saving.';
      }
    });
    answer.focus({preventScroll:true});
  };
  draw();
}
