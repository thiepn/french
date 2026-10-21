import './conversation.css';
import type {RouteContext} from '../core/types';
import {CONVERSATION_STARTERS,getConversationScenario,type ConversationScenario} from '../core/conversation/scenarios';
import {MISSION_CHAINS,getMission} from '../core/conversation/missions';
import {
  startConversation,beginMission,beginAdaptiveSet,changeConversationCeiling,
  endConversation,submitConversationResponse,raiseConversationSupport,requestConversationRepeat,
  type ConversationState,type ConversationResult,type MissionResult,type AdaptiveResult
} from '../core/conversation/engine';
import {loadConversationState,persistConversationState} from '../core/conversation/storage';
import {partnerWording} from '../core/conversation/variants';
import {getP35SourceScenario,P35_SOURCE_SCENARIOS} from '../core/conversation/p35-graphs';
import {P35_P18_MISSIONS,P35_P30_B2_SCENES,P35_P30_B2_PRACTICE_CHAINS,P35_LATER_B2_FUNCTIONS} from '../core/conversation/source-parity';
import {startSourceGraph,startSourceMission,startB2SourceGraph,startB2SourcePracticeChain,
 sourceSupport,respondSourceGraph,cancelSourceGraph,
 sourcePrompt,matchingP35AuthoredExamples,type SourceGraphState} from '../core/conversation/p35-runtime';
import {loadSourceGraphState,persistSourceGraphState,SourceGraphWriteConflictError} from '../core/conversation/p35-storage';
import {createSourceHandoff,consumeSourceDraft,SOURCE_HANDOFF_KEY,type SourceHandoff} from '../core/conversation/source-transfer';
import {originalRepairTargets,originalMissionRepairStages} from '../core/conversation/source-practice-review';
import {rankSourceMissionContinuity} from '../core/conversation/source-mission-continuity';
import {sourceFunctionPracticePlan} from '../core/conversation/source-function-practice';
import {deriveB2ContextTransfer} from '../core/conversation/b2-context-transfer';
import {P35_P20_FUNCTIONS,legacySceneId,legacyMissionId,originalScenarioGoal,inspectP35ConversationCoverage,auditSourceLinkedMissions} from '../core/conversation/source-parity';
import {
  FUNCTION_CATALOG,functionProfiles,rankedNativeScenarios,rankNativeMissions,
  allowedConversationLevel,type ConversationLevel
} from '../core/conversation/curriculum';
function item<K extends keyof HTMLElementTagNameMap>(tag:K,text='',className=''):HTMLElementTagNameMap[K]{
  const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;
}
function button(text:string,kind='secondary-action compact-action'):HTMLButtonElement{
  const control=item('button',text,kind);control.type='button';return control;
}
function summary(result:ConversationResult):string{
  return result.independentTurns+' / '+result.totalTurns+' first-try independent turns · '+
    result.manualTurns+' manual continuations · '+result.repairAttempts+' retries.';
}
export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
  const host=item('section','','page conversation-workspace');
  const top=item('header','','conversation-top');
  const back=button('← Home','conversation-link');
  back.addEventListener('click',()=>navigate('home'));
  top.append(back,item('h1','Conversation'));
  const status=item('p','','conversation-status');status.setAttribute('aria-live','polite');
  const stage=item('div','','conversation-stage');
  host.append(top,status,stage);main.replaceChildren(host);
  let state=await loadConversationState();
  let originalSource=await loadSourceGraphState();
  // Explicit in-memory Write draft is offered once and never persisted.
  let returnedSourceDraft=consumeSourceDraft(originalSource,Date.now());
  let sourcePaused=false,sourceNotice='';
  if(signal.aborted)return;
  let busy=false,lastSubmission:{key:string;at:number}|null=null;
  let lastResult:ConversationResult|null=null,lastMissionResult:MissionResult|null=null;
  let lastAdaptiveResult:AdaptiveResult|null=null;
  const saveOriginal=async(next:SourceGraphState)=>{
    // The expected snapshot is the state this tab actually rendered.
    // The original meta owner checks it atomically before any source write.
    originalSource=await persistSourceGraphState(next,originalSource);
  };
  const recoverOriginalConflict=async(error:unknown,reply=''):Promise<boolean>=>{
    if(!(error instanceof SourceGraphWriteConflictError))return false;
    const previous=originalSource.active;
    const latest=await loadSourceGraphState();
    originalSource=latest;sourcePaused=false;
    sourceNotice='Another tab saved a newer original dialogue. The latest checkpoint is loaded; your stale answer was not saved.';
    if(signal.aborted)return true;
    const sameTask=Boolean(previous&&latest.active&&
      previous.runId===latest.active.runId&&previous.nodeId===latest.active.nodeId);
    if(sameTask&&reply){
      // Safe to edit and retry only if the exact run AND node still match.
      renderOriginalSource(reply);
    }else{
      render();
      if(reply){
        // Different node or mission: retain text only in this tab's DOM for
        // copying. Never place a stale response in the new node's input.
        const recovery=item('section','','source-conflict-reply');
        recovery.append(item('p','Unsent reply from the previous source task (not submitted or stored). Copy it if needed.','conversation-feedback'));
        const draft=item('textarea');draft.value=reply;draft.readOnly=true;
        draft.setAttribute('aria-label','Unsent reply from outdated source task');
        recovery.append(draft);stage.prepend(recovery);
      }
    }
    status.textContent=sourceNotice;
    return true;
  };
  const canStartOriginal=()=>!busy&&!state.active&&!state.mission&&!state.adaptive&&!originalSource.active;
  const handoffOriginal=async(kind:SourceHandoff['kind'],level:1|2)=>{
    if(busy||signal.aborted||!originalSource.active)return;
    busy=true;
    try{
      // Record the assistance before leaving Conversation. A future response
      // cannot regain unassisted source rule credit by visiting Write/Listen.
      const current=sourceSupport(originalSource,level,Date.now());
      await saveOriginal(current);
      if(signal.aborted)return;
      sessionStorage.setItem(SOURCE_HANDOFF_KEY,JSON.stringify(
        createSourceHandoff(originalSource,kind,Date.now())));
      navigate(kind);
    }catch(error){
      if(!await recoverOriginalConflict(error))
        status.textContent='Source transfer was not opened; saved original dialogue remains available.';
      console.error('Original source companion transfer failed',error);
    }finally{busy=false;}
  };
  const commitOriginal=async(work:()=>SourceGraphState,message:string,preservedSourceReply?:string)=>{
    if(busy||signal.aborted)return;
    busy=true;
    try{
      const next=work();
      await saveOriginal(next);
      sourceNotice=message;
      sourcePaused=false;
      busy=false;
      // Hints and clarification must never erase an unsent learner reply.
      if(preservedSourceReply!==undefined&&originalSource.active)
        renderOriginalSource(preservedSourceReply);
      else render();
    }catch(error){
      if(!await recoverOriginalConflict(error,preservedSourceReply))
        status.textContent='Source practice was not saved. No new step has been credited. '+String(error);
    }finally{busy=false;}
  };
  const save=async(next:ConversationState)=>{
    await persistConversationState(next);
    state=next;
  };
  const select=async(id:string)=>{
    if(busy||state.active||state.mission||state.adaptive||originalSource.active||signal.aborted)return;
    busy=true;
    try{await save(startConversation(state,id));lastResult=null;lastMissionResult=null;lastAdaptiveResult=null;render();}
    catch(error){status.textContent='Could not start this conversation. Your saved data was not changed.';console.error(error);}
    finally{busy=false;}
  };
  const selectMission=async(id:string)=>{
    if(busy||state.active||state.mission||state.adaptive||originalSource.active||signal.aborted)return;
    busy=true;
    try{
      await save(beginMission(state,id));lastResult=null;lastMissionResult=null;lastAdaptiveResult=null;render();
    }catch(error){
      status.textContent='Could not start this mission. Your progress remains saved.';console.error(error);
    }finally{busy=false;}
  };
  const selectAdaptive=async()=>{
    if(busy||state.active||state.mission||state.adaptive||originalSource.active||signal.aborted)return;
    busy=true;
    try{
      await save(beginAdaptiveSet(state));lastResult=null;lastMissionResult=null;lastAdaptiveResult=null;render();
    }catch(error){
      status.textContent='Could not build a three-task set. Existing work was preserved.';console.error(error);
    }finally{busy=false;}
  };
  const updateCeiling=async(level:ConversationLevel)=>{
    if(busy||state.active||state.mission||state.adaptive||originalSource.active)return;
    busy=true;
    try{await save(changeConversationCeiling(state,level));renderHome();}
    catch(error){status.textContent='Could not save the practice level.';console.error(error);}
    finally{busy=false;}
  };
  const renderHome=()=>{
    stage.replaceChildren();
    const intro=item('p','Practise a short, structured exchange. The checker looks for required language patterns, not full conversational meaning. Your typed responses are not saved.','conversation-intro');
    stage.append(intro);
    const originalDeck=item('section','','source-graph-deck');
    originalDeck.append(item('h2','Original P35 dialogue graphs'),
      item('p','Real preserved P35 partner nodes and deterministic branch rules. The independent source bridge records practice-only metadata, never typed replies or SRS/CEFR scores. Similarity and open-ended meaning are not certified.','muted-copy'));
    const sourceSelection=item('label','','conversation-level-picker');
    sourceSelection.append(item('span','Original graph practice ceiling'));
    const sourceCeiling=item('select');sourceCeiling.setAttribute('aria-label','Original graph practice level');
    for(const level of ['A1','A2','B1'] as const){
      const option=item('option',level);option.value=level;sourceCeiling.append(option);
    }
    sourceCeiling.value=originalSource.maxLevel;
    sourceCeiling.disabled=!canStartOriginal();
    sourceCeiling.onchange=()=>void commitOriginal(()=>({...originalSource,maxLevel:sourceCeiling.value as 'A1'|'A2'|'B1'}),'Original practice level saved.');
    sourceSelection.append(sourceCeiling);originalDeck.append(sourceSelection);
    if(originalSource.active){
      const current=getP35SourceScenario(originalSource.active.scenarioId);
      originalDeck.append(item('p','Saved original source task · '+(current?.title??originalSource.active.scenarioId)+
        (originalSource.mission?' · mission task '+(originalSource.mission.index+1)+'/3':'')+
        ' · position '+originalSource.active.nodeId,'source-running'));
      const resume=button('Resume original dialogue','primary-action compact-action');
      resume.onclick=()=>{sourcePaused=false;render();};originalDeck.append(resume);
    }
    if(originalSource.history.length){
      const recent=originalSource.history[0];
      const graph=getP35SourceScenario(recent.scenarioId);
      originalDeck.append(item('p','Recent original graph: '+(graph?.title??recent.scenarioId)+
        ' · '+recent.independent+'/'+recent.turns+' original rule-matched independent turns · '+
        (recent.complete?'source objectives covered':'source goals incomplete')+'. This is rehearsed practice only.','muted-copy'));
      if(graph&&graph.level!=='B2'){
        const repeatOriginal=button('Replay recent original dialogue · next partner wording','secondary-action compact-action');
        repeatOriginal.disabled=!canStartOriginal()||
          ['A1','A2','B1'].indexOf(graph.level)>['A1','A2','B1'].indexOf(originalSource.maxLevel);
        repeatOriginal.onclick=()=>void commitOriginal(()=>
          startSourceGraph(originalSource,graph.id,Date.now()),
          'Source-owned partner wording advances on repetition. No CEFR or FSRS score was created.');
        originalDeck.append(repeatOriginal);
      }
    }
    // P30 source-authored B2 graph practice. Exact P35 scene IDs/partner
    // nodes and the original source matcher; neither B2 level promotion nor
    // P28 B2 benchmark authority is exposed here.
    const b2Deck=item('section','','source-b2-practice');
    b2Deck.append(item('h3','Original B2 dialogue practice'));
    b2Deck.append(item('h3','Original B2 function contexts:'));
    const contrastRows=item('div','','source-b2-transfer');
    for(const plan of deriveB2ContextTransfer(originalSource)){
      const row=item('section','','source-b2-transfer-row');
      row.append(item('h4',plan.label));
      const context=plan.completedUnassistedContexts+' / '+plan.authoredContexts+
        ' completed original settings with unassisted rule matches';
      const details=[context,plan.unassistedRuleMatches+' first-try source-rule matches'];
      if(plan.supportedOnlyContexts)
        details.push(plan.supportedOnlyContexts+' settings with supported-only answers');
      if(plan.unfinishedUnassistedContexts)
        details.push(plan.unfinishedUnassistedContexts+' unfinished source settings');
      const summary=item('p',details.join(' · '),'source-b2-transfer-data');
      row.append(summary);
      if(plan.nextSceneId&&plan.nextSceneTitle){
        const reason=plan.nextAction==='different-context'?'Different original setting':
          plan.nextAction==='retry-without-help'?'Retry source dialogue without help':
          plan.nextAction==='new-original-variant'?'Other original prompt variant':
          'First source dialogue';
        const open=button('Practise B2 function · '+plan.label,'secondary-action compact-action');
        open.disabled=!canStartOriginal();
        const target=plan.nextSceneId;
        open.onclick=()=>void commitOriginal(()=>
          startB2SourceGraph(originalSource,target,Date.now()),
          'Opened original P35 source graph; completed goal/rule matches remain practice only.');
        row.append(item('p',reason+' · '+plan.nextSceneTitle,'source-b2-transfer-next'),open);
      }
      contrastRows.append(row);
    }
    b2Deck.append(contrastRows,item('h3','Original B2 source situations'));
    for(const id of P35_P30_B2_SCENES){
      const graph=getP35SourceScenario(id);
      if(!graph||graph.level!=='B2')continue;
      const recent=originalSource.history.filter(row=>row.scenarioId===id);
      const control=button('Practise original B2 · '+graph.title,'secondary-action compact-action');
      control.disabled=!canStartOriginal();
      control.onclick=()=>void commitOriginal(()=>
        startB2SourceGraph(originalSource,id,Date.now()),
        'Opened original P35 B2 dialogue for practice. No benchmark or CEFR score.');
      b2Deck.append(control);
      const summary=item('p',graph.goal+' · '+recent.filter(row=>row.complete).length+
        ' completed source-objective runs','source-b2-goal');
      b2Deck.append(summary);
    }
    b2Deck.append(item('h3','B2 three-scenario practice sequences'));
    for(const chain of P35_P30_B2_PRACTICE_CHAINS){
      const earlier=(originalSource.missionHistory??[]).filter(row=>row.missionId===chain.id);
      const start=button('Practise B2 sequence · '+chain.title,'secondary-action compact-action');
      start.disabled=!canStartOriginal();
      start.onclick=()=>void commitOriginal(()=>
        startB2SourcePracticeChain(originalSource,chain.id,Date.now()),
        'P30-informed practice sequence started using original source graphs. No P28 benchmark was created.');
      b2Deck.append(start);
      const detail=item('p',chain.scenarios.map(id=>getP35SourceScenario(id)?.title??id).join(' → ')+
        ' · '+earlier.length+' completed practice runs','source-b2-goal');
      b2Deck.append(detail);
    }
    b2Deck.append(item('p','Practice only. Original P35 P28 B2 qualification and P29 maintenance are not available in this runtime.','source-b2-boundary'));
    originalDeck.append(b2Deck);
    originalDeck.append(item('h3','Source P18 missions'));
    const missionList=item('div','','source-graph-list');
    for(const recommendation of rankSourceMissionContinuity(originalSource)){
      const mission=P35_P18_MISSIONS.find(row=>row.id===recommendation.id)!;
      const locked=recommendation.locked;
      const control=button(mission.title+' · 3 original source graphs','secondary-action compact-action');
      control.disabled=!canStartOriginal()||locked;
      control.onclick=()=>void commitOriginal(()=>startSourceMission(originalSource,mission.id,Date.now()),
        'Source mission started; response text is not retained.');
      missionList.append(control);
      if(!locked)missionList.append(item('p',recommendation.practised+
        ' of 3 original scenario goals previously revisited · '+
        recommendation.completedMissionRuns+' complete three-stage source mission runs'+
        (recommendation.latestMissionGoals!==null?
          ' · last run '+recommendation.latestMissionGoals+'/3 source objectives observed':'')+
        '. Original practice only.','muted-copy'));
      if(recommendation.missing.length&&!locked)
        missionList.append(item('p','Source practice to revisit: '+recommendation.missing.join(' · ')+
        '. Recommendation is based on original task history, not CEFR proficiency.','muted-copy'));
      if(recommendation.missing.length&&!locked){
        const missingScene=mission.scenarios.find(id=>!originalSource.history.some(
          run=>run.scenarioId===id&&run.complete));
        if(missingScene){
          const focused=getP35SourceScenario(missingScene);
          const focus=button('Rehearse mission task · '+(focused?.title??missingScene),'secondary-action compact-action');
          focus.disabled=!canStartOriginal();
          focus.onclick=()=>void commitOriginal(()=>
            startSourceGraph(originalSource,missingScene,Date.now()),
            'Opened original P35 mission task for focused rehearsal, separate from a full mission run.');
          missionList.append(focus);
        }
      }
    }
    originalDeck.append(missionList);
    if(originalSource.missionHistory?.length){
      const prior=item('section','','source-mission-history');
      prior.append(item('h3','Completed original P35 mission practice'));
      for(const result of originalSource.missionHistory.slice(0,8)){
        const mission=P35_P18_MISSIONS.find(m=>m.id===result.missionId);
        if(!mission)continue;
        const row=item('div','','source-mission-history-row');
        row.append(item('p',mission.title+' · '+result.stages.filter(s=>s.complete).length+
          '/3 source objectives observed · '+result.stages.reduce((sum,s)=>sum+s.independent,0)+
          ' independent rule-matched turns · practice only.'));
        const repeat=button('Replay original mission · '+mission.title,'secondary-action compact-action');
        repeat.disabled=!canStartOriginal()||mission.scenarios.some(id=>{
          const graph=getP35SourceScenario(id);
          return !graph||graph.level==='B2'||
            ['A1','A2','B1'].indexOf(graph.level)>['A1','A2','B1'].indexOf(originalSource.maxLevel);
        });
        repeat.onclick=()=>void commitOriginal(()=>startSourceMission(originalSource,mission.id,Date.now()),
          'Replay of original mission started; previous source runs remain intact.');
        row.append(repeat);prior.append(row);
      }
      originalDeck.append(prior);
    }
    const review=item('section','','source-practice-review');
    review.append(item('h3','Next original-source practice'),
      item('p','Suggestions use only P35 authored nodes and your local rule-match history. A suggestion is not a proficiency rating.','muted-copy'));
    for(const target of originalRepairTargets(originalSource,5)){
      const row=item('div','','source-repair-row');
      const reason=target.reason==='repair'?'clarification used':
        target.reason==='supported'?'model or hints used':
        target.reason==='unseen'?'no stored source-rule attempt':'revisit original rule';
      row.append(item('p',target.title+' · '+target.functionId+' · '+
        target.nodeId+' · '+reason+' · '+target.independent+
        ' independent original-rule matches','muted-copy'));
      const open=button('Practise source function · '+target.title+' / '+target.functionId,
        'secondary-action compact-action');
      open.disabled=!canStartOriginal();
      open.onclick=()=>void commitOriginal(()=>
        startSourceGraph(originalSource,target.scenarioId,Date.now()),
        'Original scenario opened at its authored first node; practise '+target.functionId+
        ' when it occurs. No function mastery is awarded.');
      row.append(open);review.append(row);
    }
    const missionReview=item('details','','source-mission-repair');
    missionReview.append(item('summary','Rehearse weaker stages in original P18 missions'));
    for(const mission of originalMissionRepairStages(originalSource)){
      if(!mission.eligible||!mission.target)continue;
      const line=item('div','','source-repair-row');
      line.append(item('p',mission.title+' · suggested source stage '+(mission.target.index+1)+
        '/3 · '+mission.target.title+' · '+mission.target.independent+
        ' independent original-rule matches','muted-copy'));
      const rehearse=button('Rehearse source mission stage · '+mission.target.title,
        'secondary-action compact-action');
      rehearse.disabled=!canStartOriginal();
      const targetId=mission.target.scenarioId;
      rehearse.onclick=()=>void commitOriginal(()=>
        startSourceGraph(originalSource,targetId,Date.now()),
        'Source mission stage opened for isolated practice; full mission history is preserved.');
      line.append(rehearse);missionReview.append(line);
    }
    review.append(missionReview);
    originalDeck.append(review,item('h3','Pinned original source scenarios'));
    const sourceList=item('div','','source-graph-list');
    for(const graph of P35_SOURCE_SCENARIOS){
      const control=button(graph.level+' · '+graph.title+
        (graph.level==='B2'?' · B2 source reference only':' · original graph'),'secondary-action compact-action');
      control.disabled=!canStartOriginal()||graph.level==='B2'||
        ['A1','A2','B1'].indexOf(graph.level)>['A1','A2','B1'].indexOf(originalSource.maxLevel);
      control.onclick=()=>void commitOriginal(()=>startSourceGraph(originalSource,graph.id,Date.now()),
        'Pinned original '+graph.id+' graph started.');
      sourceList.append(control);
    }
    originalDeck.append(sourceList);
    if(sourceNotice)originalDeck.append(item('p',sourceNotice,'conversation-evidence'));
    stage.append(originalDeck);
    const functionSummary=functionProfiles(state.functionEvents);
    const known=functionSummary.filter(row=>row.state==='functional'||row.state==='secure').length;
    const lesson=item('section','','conversation-curriculum');
    const heading=item('div','','conversation-curriculum-heading');
    heading.append(item('h2','Communicative practice'),item('span',known+' / '+FUNCTION_CATALOG.length+' functions with functional evidence'));
    lesson.append(heading);
    const levelRow=item('label','','conversation-level-picker');
    levelRow.append(item('span','Practice up to level'));
    const picker=item('select');picker.setAttribute('aria-label','Conversation practice level');
    for(const level of ['A1','A2','B1'] as const){
      const option=item('option',level);option.value=level;picker.append(option);
    }
    picker.value=state.levelCeiling;
    picker.disabled=Boolean(state.active||state.mission||state.adaptive||originalSource.active);
    picker.addEventListener('change',()=>void updateCeiling(picker.value as ConversationLevel));
    levelRow.append(picker);lesson.append(levelRow);
    const picks=rankedNativeScenarios(state.functionEvents,state.history,state.levelCeiling);
    if(picks.length){
      const top=picks[0],summary=item('div','','conversation-next');
      summary.append(item('strong','Recommended · '+top.title),
        item('small',top.reason+' · '+top.level));
      const go=button('Start recommendation','primary-action compact-action');
      go.disabled=Boolean(state.active||state.mission||state.adaptive||originalSource.active);
      go.onclick=()=>void select(top.scenarioId);
      summary.append(go);lesson.append(summary);
    }
    const adaptive=item('div','','conversation-next');
    adaptive.append(item('strong','Adaptive set · 3 tasks'),
      item('small','Three distinct practice situations chosen from recent function evidence. This is practice, not a proficiency test.'));
    const startAdaptive=button('Start adaptive set','secondary-action compact-action');
    startAdaptive.disabled=Boolean(state.active||state.mission||state.adaptive||originalSource.active);
    startAdaptive.onclick=()=>void selectAdaptive();
    adaptive.append(startAdaptive);lesson.append(adaptive);
    const map=item('details','','conversation-function-map');
    map.append(item('summary','Function map · '+state.functionEvents.length+' recorded attempts'));
    for(const group of ['Foundation','Interaction','Problem solving','Planning & opinion','Narrative']){
      const section=item('section','','conversation-function-group');
      section.append(item('h3',group));
      for(const profile of functionSummary.filter(row=>row.group===group)){
        const row=item('div','','conversation-function-row');
        row.append(item('span',profile.label),item('span',profile.state+' · '+
          profile.independentSuccesses+' independent · '+profile.contexts+' situations'));
        section.append(row);
      }
      map.append(section);
    }
    lesson.append(map);
    const coverage=inspectP35ConversationCoverage();
    const sourceFunctionRows=new Map(sourceFunctionPracticePlan(originalSource).map(row=>[row.id,row]));
    const original=item('details','','conversation-source-parity');
    original.append(item('summary','Original P35 P20 functions · '+coverage.originalP20Functions+' source definitions'));
    original.append(item('p','Source identity is not a native mastery result: the existing 23 native function scores are separate. P35 also added six B2 functions later.','muted-copy'));
    for(const group of ['Foundation','Interaction','Problem solving','Planning & opinion','Narrative']){
      const section=item('section','','conversation-function-group');
      section.append(item('h3',group));
      for(const fn of P35_P20_FUNCTIONS.filter(fn=>fn.group===group)){
        const row=item('p','','conversation-source-function');
        const status=sourceFunctionRows.get(fn.id);
        row.append(item('strong',fn.label),
          item('span','Source '+fn.id+' · not independently assessed'),
          item('span',(status?.independentRuleMatches??0)+
            ' original rule-matched independent practice turns across '+
            (status?.practisedScenes??0)+' scenes · no proficiency certification'));
        if(status?.nextSceneId){
          const sceneId=status.nextSceneId;
          const practice=button('Practise original '+fn.label+' in '+status.nextSceneTitle,
            'secondary-action compact-action');
          practice.disabled=!canStartOriginal();
          practice.onclick=()=>void commitOriginal(()=>
            startSourceGraph(originalSource,sceneId,Date.now()),
            'Opened original source dialogue '+sceneId+' for '+fn.label+'. Practice only.');
          row.append(practice);
        }else{
          row.append(item('small',status?.totalSourceScenes?
            'Source scenario is beyond your selected practice ceiling.':
            'No original P35 non-B2 graph rule for this function.','muted-copy'));
        }
        section.append(row);
      }
      original.append(section);
    }
    original.append(item('p',coverage.mappedSourceScenes+' / '+coverage.sourceScenarioCount+
      ' original P17 scene identities mapped. Original graph and scoring parity remain OPEN.','muted-copy'));
    lesson.append(original);
    const divergences=auditSourceLinkedMissions();
    lesson.append(item('p',divergences.length?
      'P35 mission source divergence: '+divergences.join('; '):
      'Five native chains match their P35 P18 source scenario identities. This does not establish dialogue or grading equivalence.',
      'muted-copy'));
    lesson.append(item('p','Pattern matching is limited. Function evidence is confidence-damped and cannot certify independent proficiency.','muted-copy'));
    stage.append(lesson);
    if(lastAdaptiveResult){
      const completedSet=item('section','','conversation-result');
      completedSet.append(item('h2','Adaptive set complete'),
        item('p',lastAdaptiveResult.independentTurns+' / '+lastAdaptiveResult.totalTurns+
          ' independent turns across three practice tasks.'),
        item('p','Task performance only; no CEFR award.','muted-copy'));
      stage.append(completedSet);
    }
    if(lastMissionResult){
      const finishedMission=item('section','','conversation-result');
      const definition=getMission(lastMissionResult.missionId);
      finishedMission.append(
        item('h2','Mission complete'),
        item('p',(definition?.title??'Mission')+' · '+
          (lastMissionResult.independencePass?'Independence pass':'Completed with support')),
        item('p',lastMissionResult.independentTurns+' / '+lastMissionResult.totalTurns+' independent turns · '+
          lastMissionResult.manualTurns+' manually continued.'),
        item('p','Scripted-turn credit: '+Math.round(lastMissionResult.averageEvidence*100)+
          '% · maximum support '+lastMissionResult.maxSupport+' · '+
          (lastMissionResult.fullyUnsupported?'Fully unsupported on these tasks':'Some support or retries recorded')+'.','conversation-evidence'),
        item('p','P18 independence threshold: 3 completed tasks, ≥80% independent turns, no manual continuation, maximum support level 1, and average scripted credit ≥55%. This is not a CEFR level.','muted-copy'),
        item('p','These results describe three practised tasks, not a CEFR certificate.','muted-copy')
      );
      stage.append(finishedMission);
    }
    if(lastResult&&!lastMissionResult&&!lastAdaptiveResult){
      const finished=item('section','','conversation-result');
      finished.append(item('h2','Conversation complete'),item('p',summary(lastResult)),
        item('p','These results describe this practice scenario, not a CEFR proficiency score.','muted-copy'));
      stage.append(finished);
    }
    if(state.active){
      const resumed=getConversationScenario(state.active.scenarioId);
      if(resumed){
        const active=item('section','','conversation-resume');
        const mission=state.mission?getMission(state.mission.missionId):null;
        active.append(item('strong',mission?'Mission · '+mission.title:
          state.adaptive?'Adaptive set · '+resumed.title:'Unfinished · '+resumed.title),
          item('span',(mission?'Task '+(state.mission!.step+1)+' / 3 · ':
            state.adaptive?'Adaptive task '+(state.adaptive.step+1)+' / 3 · ':'')+
            'Turn '+(state.active.cursor+1)+' of '+resumed.turns.length));
        const resume=button('Resume active','primary-action compact-action');
        resume.onclick=()=>renderActive(resumed);
        active.append(resume);stage.append(active);
      }
    }
    const missions=item('div','','conversation-mission-list');
    const missionRanking=rankNativeMissions(state.functionEvents,state.missionHistory,state.levelCeiling);
    for(const mission of [...missionRanking,
      ...MISSION_CHAINS.filter(row=>!missionRanking.some(m=>m.id===row.id))]){
      const choice=button('','conversation-choice conversation-mission-choice');
      const words=item('span','','conversation-choice-copy');
      words.append(item('strong',mission.title),
        item('small','3 connected scenarios · '+mission.scenarioIds.map(id=>getConversationScenario(id)?.title??id).join(' → ')),
        item('small','P35 source chain: '+(legacyMissionId(mission.id)??'unmapped')+' · vNext-authored dialogue'));
      choice.append(item('span',mission.level,'conversation-level'),words,item('span','→','conversation-arrow'));
      choice.disabled=Boolean(state.active||state.mission||state.adaptive||originalSource.active)
        ||!allowedConversationLevel(mission.level,state.levelCeiling);
      choice.onclick=()=>void selectMission(mission.id);
      missions.append(choice);
    }
    stage.append(item('h2','Real-world missions'),missions);
    if(state.missionHistory.length){
      const records=item('section','','conversation-history');
      records.append(item('h2','Mission history'));
      for(const run of state.missionHistory.slice(0,5)){
        const mission=getMission(run.missionId);
        if(mission)records.append(item('p',mission.title+' · '+
          (run.independencePass?'independence pass':'completed with support')+
          ' · '+run.independentTurns+' / '+run.totalTurns+' independent turns','conversation-history-row'));
      }
      stage.append(records);
    }
    const list=item('div','','conversation-list');
    const ordered=rankedNativeScenarios(state.functionEvents,state.history,state.levelCeiling)
      .map(row=>getConversationScenario(row.scenarioId))
      .filter((row):row is ConversationScenario=>Boolean(row));
    for(const scene of [...ordered,...CONVERSATION_STARTERS.filter(row=>!ordered.some(s=>s.id===row.id))]){
      const control=button('','conversation-choice');
      const words=item('span','','conversation-choice-copy');
      words.append(item('strong',scene.title),item('small',scene.setting+' · '+scene.turns.length+' turns'),
        item('small',legacySceneId(scene.id)?'P35 source: '+legacySceneId(scene.id)+' · vNext dialogue':'Native-only practice; no original P17 graph match'));
      control.append(item('span',scene.level,'conversation-level'),words,item('span','→','conversation-arrow'));
      control.disabled=Boolean(state.active||state.mission||state.adaptive||originalSource.active)
        ||!allowedConversationLevel(scene.level,state.levelCeiling);
      control.onclick=()=>void select(scene.id);
      list.append(control);
    }
    stage.append(item('h2','Practice situations'),list);
    if(state.history.length){
      const history=item('section','','conversation-history');
      history.append(item('h2','Recent runs'));
      for(const run of state.history.slice(0,5)){
        const scene=getConversationScenario(run.scenarioId);
        if(!scene)continue;
        history.append(item('p',scene.title+' · '+summary(run),'conversation-history-row'));
      }
      stage.append(history);
    }
    status.textContent=state.active?'Unfinished conversation or task set saved. Resume or end it before choosing another.':
      'Choose a task. Function evidence remains local unless you explicitly enable Account sync.';
  };
  const renderActive=(scene:ConversationScenario,preservedText='')=>{
    const active=state.active;if(!active||active.scenarioId!==scene.id){renderHome();return;}
    const turn=scene.turns[active.cursor];if(!turn){renderHome();return;}
    const originalScenario=legacySceneId(scene.id);
    stage.replaceChildren();
    const context=item('div','','conversation-context');
    context.append(item('span',scene.level+' · '+scene.setting,'conversation-scene'),item('span','Turn '+(active.cursor+1)+' / '+scene.turns.length));
    if(state.adaptive){
      const banner=item('div','','conversation-mission-banner');
      banner.append(item('strong','Adaptive set · 3 tasks'),
        item('span','Adaptive task '+(state.adaptive.step+1)+' of 3 · '+scene.title));
      stage.append(banner);
    }
    if(state.mission){
      const definition=getMission(state.mission.missionId);
      const banner=item('div','','conversation-mission-banner');
      banner.append(item('strong',definition?.title??'Real-world mission'),
        item('span','Mission '+(state.mission.step+1)+' of 3 · '+scene.title));
      stage.append(banner);
    }
    const track=item('div','','conversation-track');track.setAttribute('role','progressbar');
    track.setAttribute('aria-label','Conversation progress');track.setAttribute('aria-valuemin','0');
    track.setAttribute('aria-valuemax',String(scene.turns.length));track.setAttribute('aria-valuenow',String(active.cursor));
    const bar=item('div','','conversation-track-fill');bar.style.width=(active.cursor/scene.turns.length*100)+'%';track.append(bar);
    const exchange=item('div','','conversation-exchange');
    exchange.append(item('p',scene.partner,'conversation-speaker'),item('blockquote',partnerWording(scene.id,active.cursor,active.variant??0),'conversation-prompt'));
    exchange.append(item('p',originalScenario?'P35 source '+originalScenario+' · newly authored vNext wording, not original score parity':'Native-only scenario; no source-equivalent P35 grading','conversation-source-note'));
    const goal=item('p',turn.goal,'conversation-goal');
    const sourceGoal=originalScenarioGoal(scene.id);
    const sourceDetail=item('details','','conversation-original-goal');
    if(sourceGoal){
      sourceDetail.append(item('summary','Original P35 P17 scenario objective · '+sourceGoal.level),
        item('p',sourceGoal.goal),
        item('p',sourceGoal.level!==scene.level?
          'P35 source level is '+sourceGoal.level+'; the current native scenario is labelled '+scene.level+'. The original assessment is not reproduced.':
          'This original goal can contain steps not measured by the vNext three-turn checker. No equivalence credit is awarded.','muted-copy'));
    }
    const form=item('form','','conversation-compose');
    const field=item('textarea','','conversation-input');
    field.rows=3;field.placeholder='Répondez en français…';field.setAttribute('aria-label','Your French response');
    field.autocomplete='off';field.spellcheck=true;field.value=preservedText;
    field.maxLength=650;
    const controls=item('div','','conversation-controls');
    const send=button('Send response','primary-action compact-action');send.type='submit';
    const hint=button('Show hint');
    const example=button('Show model');
    const repeat=button('Ask to repeat');
    repeat.title='Ask the partner to rephrase the current turn. This counts as support, not an independent response.';
    const manual=button('My response fits');
    manual.title='Continue without scoring this turn as independently matched.';
    controls.append(send,repeat,hint,example,manual);form.append(field,controls);
    const assistance=item('p','','conversation-assistance');
    const feedback=item('p','','conversation-feedback');feedback.setAttribute('role','status');
    if((active.repairMoves??0)>0)assistance.append(item('span',
      'Partner repeats · '+partnerWording(scene.id,active.cursor,active.variant===1?0:1)));
    if(active.support>=1)assistance.append(item('span',
      active.support===2?'Example · '+turn.model:'Hint · '+turn.hint));
    const commands=item('div','','conversation-bottom');
    const pause=button('Pause & home','conversation-link');
    const quit=button(state.mission?'End unfinished mission':
      state.adaptive?'End adaptive set':'End unfinished exchange','conversation-link conversation-danger');
    pause.onclick=()=>renderHome();
    quit.onclick=async()=>{
      if(busy||!confirm(state.mission
        ?'End this unfinished mission? Completed individual conversations remain in history, but this mission will not count.'
        :state.adaptive?'End this adaptive set? Completed conversations stay in history, but the set will not count.'
        :'End this unfinished conversation? Completed runs will be kept.'))return;
      busy=true;
      try{await save(endConversation(state));renderHome();}
      catch(error){status.textContent='Could not end the exchange; saved progress was preserved.';console.error(error);}
      finally{busy=false;}
    };
    commands.append(pause,quit);
    stage.append(context,track,exchange,goal);
    if(sourceGoal)stage.append(sourceDetail);
    stage.append(form,assistance,feedback,commands);
    status.textContent='Text practice · '+(active.support?'support used':'try without hints')+' · '+(active.attempts?'retries: '+active.attempts:'first attempt');
    const showSupport=async(level:1|2)=>{
      if(busy)return;
      busy=true;
      try{await save(raiseConversationSupport(state,level));renderActive(scene,field.value);}
      catch(error){feedback.textContent='Could not save the hint state.';console.error(error);}
      finally{busy=false;}
    };
    hint.onclick=()=>void showSupport(1);
    example.onclick=()=>void showSupport(2);
    repeat.onclick=async()=>{
      if(busy||signal.aborted)return;
      busy=true;
      try{await save(requestConversationRepeat(state));renderActive(scene,field.value);}
      catch(error){feedback.textContent='Could not save this repeat request.';console.error(error);}
      finally{busy=false;}
    };
    const advance=async(isManual:boolean)=>{
      if(busy||signal.aborted)return;
      const raw=field.value.trim();
      if(!raw){feedback.textContent='Write your response before continuing.';return;}
      if(raw.length<2){feedback.textContent='Write a fuller response in French.';return;}
      const now=Date.now();
      // Debounce the same response on the same turn, not a legitimate quick
      // answer to the following turn after an asynchronous save completes.
      const activeNow=state.active;
      const key=(activeNow?.scenarioId??'')+':'+String(activeNow?.cursor??-1)+':'+raw+':'+String(isManual);
      if(lastSubmission?.key===key&&now-lastSubmission.at<900)return;
      lastSubmission={key,at:now};busy=true;
      try{
        const previousMission=state.mission;
        const previousAdaptive=state.adaptive;
        const outcome=submitConversationResponse(state,raw,isManual);
        await save(outcome.state);
        if(previousMission&&!outcome.state.mission&&outcome.state.missionHistory.length)
          lastMissionResult=outcome.state.missionHistory[0];
        if(previousAdaptive&&!outcome.state.adaptive&&outcome.state.adaptiveHistory.length)
          lastAdaptiveResult=outcome.state.adaptiveHistory[0];
        if(!outcome.accepted){
          feedback.textContent='The checker recognized '+outcome.matched+' / '+outcome.total+
            ' required patterns. Try another wording, ask for a hint, or continue manually without independence credit.';
          status.textContent='Practice response not yet recognized · '+String(outcome.state.active?.attempts??0)+' attempts';
          return;
        }
        if(outcome.finished)lastResult=outcome.state.history[0]??null;
        const next=outcome.state.active?getConversationScenario(outcome.state.active.scenarioId):null;
        if(next)renderActive(next);else renderHome();
      }catch(error){feedback.textContent='Could not save the turn. Try again; no progress has advanced.';console.error(error);}
      finally{busy=false;}
    };
    form.addEventListener('submit',event=>{event.preventDefault();void advance(false);});
    manual.onclick=()=>{
      if(confirm('Continue despite the checker being uncertain? This turn will not count as independent evidence.'))void advance(true);
    };
    field.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();form.requestSubmit();}});
    field.focus({preventScroll:true});
  };

  const renderOriginalSource=(preservedText='')=>{
    const active=originalSource.active;
    if(!active){renderHome();return;}
    const graph=getP35SourceScenario(active.scenarioId),node=graph?.nodes[active.nodeId];
    if(!graph||!node||node.end){renderHome();return;}
    stage.replaceChildren();
    const banner=item('section','','source-graph-deck');
    banner.append(item('p','Original P35 deterministic source · '+graph.id+' · '+graph.level,'eyebrow'),
      item('h2',graph.title),
      item('p',graph.goal,'conversation-goal'),
      item('p','Pinned source graph node '+active.nodeId+' · wording variant '+(active.variant+1)+'/'+graph.variantCount+
        ' · '+active.turns+' accepted steps · '+active.repairs+' clarification attempts. No automatic SRS, CEFR or true oral fluency award.','muted-copy'));
    if(originalSource.mission){
      const mission=[...P35_P18_MISSIONS,...P35_P30_B2_PRACTICE_CHAINS].find(m=>m.id===originalSource.mission?.id);
      banner.append(item('p','Source mission '+(mission?.title??originalSource.mission.id)+
        ' · task '+(originalSource.mission.index+1)+'/3 · earlier tasks '+
        originalSource.mission.completed.length,'conversation-mission-banner'));
      if(mission){
        const steps=item('ol','','source-mission-steps');
        for(let i=0;i<mission.scenarios.length;i++){
          const scene=getP35SourceScenario(mission.scenarios[i]);
          const summary=i<originalSource.mission.index?
            (originalSource.mission.completed[i]?.complete?'Original goals observed':'Completed with source goals incomplete'):
            i===originalSource.mission.index?'Current task':'Upcoming';
          steps.append(item('li',(scene?.title??mission.scenarios[i])+' · '+summary));
        }
        banner.append(steps);
      }
    }
    const meter=item('div','','conversation-track');meter.setAttribute('role','progressbar');
    meter.setAttribute('aria-label','Original source graph traversed steps');
    meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuemax','45');
    meter.setAttribute('aria-valuenow',String(active.visits));
    const fill=item('div','','conversation-track-fill');fill.style.width=(active.visits/45*100)+'%';meter.append(fill);
    const partner=item('div','','conversation-exchange');
    partner.append(item('p','Original P35 dialogue partner','conversation-speaker'),
      item('blockquote',sourcePrompt(active),'conversation-prompt'));
    const goal=item('p',node.hint??'Reply using appropriate French.','conversation-goal');
    const achieved=graph.requiredGoals.filter(id=>active.goals.includes(id));
    const remaining=graph.requiredGoals.filter(id=>!active.goals.includes(id));
    const sourceGoals=item('p',achieved.length+'/'+graph.requiredGoals.length+
      ' original source objectives evidenced by matched dialogue rules'+
      (remaining.length?' · remaining: '+remaining.join(', '):' · all observed')+
      '. Rule matching cannot certify independent conversational meaning.','muted-copy');
    banner.append(sourceGoals);
    const form=item('form','','conversation-compose');
    const field=item('textarea','','conversation-input');field.rows=3;field.maxLength=650;
    field.autocomplete='off';field.setAttribute('aria-label','Reply to original source graph in French');
    field.placeholder='Répondez en français…';
    const returned=returnedSourceDraft;
    returnedSourceDraft=null;
    field.value=preservedText||returned||'';
    const approvedExamples=matchingP35AuthoredExamples(graph,active.nodeId,active.slots);
    const assistance=item('p','','conversation-assistance');
    if(returned)assistance.append(item('span',
      'Explicit Write draft restored from same-tab memory only. Model support remains active; this reply cannot earn independent source evidence.'));
    if(active.support>=1)assistance.append(item('span','Source hint · '+(node.hint??'Respond in French.')));
    if(active.support>=2)assistance.append(item('span','Source model · '+(approvedExamples[0]??'No original exact-rule example available')));
    const authored=item('div','','source-authored-options');
    if(active.support>=2){
      authored.append(item('p','Original P35 authored examples accepted by this node’s rule matcher · supported practice only.','muted-copy'));
      const samples=approvedExamples.slice(0,8);
      for(const sample of samples){
        const choice=button('Use authored phrase · '+sample,'secondary-action compact-action');
        choice.onclick=()=>{field.value=sample;field.focus({preventScroll:true});};
        authored.append(choice);
      }
    }
    const localStatus=item('p',sourceNotice,'conversation-feedback');
    localStatus.setAttribute('role','status');localStatus.setAttribute('aria-live','polite');
    const tools=item('div','','conversation-controls');
    const send=button('Check source rule','primary-action compact-action');send.type='submit';
    const hint=button('Show original hint');hint.onclick=()=>void commitOriginal(()=>
      sourceSupport(originalSource,1,Date.now()),'Original hint requested. Independent turn credit is reduced.',field.value);
    const example=button('Show source example');example.disabled=approvedExamples.length===0;example.onclick=()=>void commitOriginal(()=>
      sourceSupport(originalSource,2,Date.now()),'Source phrase revealed; independent credit withheld.',field.value);
    const repeat=button('Ask for clarification');repeat.onclick=()=>void commitOriginal(()=>
      respondSourceGraph(originalSource,'Pardon, pouvez-vous répéter ?',Date.now()).state,
      node.clarify??'Bien sûr, je reformule la question.',field.value);
    const manual=button('Continue without evidence');manual.onclick=()=>{
      if(!confirm('Advance along the first pinned graph rule without scorer evidence? This turn will not count as independently matched.'))return;
      void submit(true);
    };
    tools.append(send,repeat,hint,example,manual);
    form.append(field,tools);
    const companions=item('div','','source-companion-actions');
    const listen=button('Listen to this original partner turn','secondary-action compact-action');
    listen.onclick=()=>void handoffOriginal('listen',1);
    const write=button('Rehearse this reply in Write','secondary-action compact-action');
    write.onclick=()=>void handoffOriginal('write',2);
    companions.append(listen,write,item('p',
      'Companion practice keeps the original turn and mission saved. It counts as supported practice, not an independent dialogue attempt.',
      'muted-copy'));
    const actions=item('div','','conversation-bottom');
    const pause=button('Pause original graph & home','conversation-link');
    pause.onclick=()=>{sourcePaused=true;renderHome();};
    const quit=button('End original graph (ungraded)','conversation-link conversation-danger');
    quit.onclick=()=>{if(confirm('End this unfinished source graph? No completion will be credited.'))
      void commitOriginal(()=>cancelSourceGraph(originalSource),'Unfinished original graph ended without mastery credit.');};
    actions.append(pause,quit);
    const submit=async(manual=false)=>{
      if(busy||signal.aborted)return;
      const reply=field.value.trim();
      if(!reply){localStatus.textContent='Write a response before submitting.';return;}
      busy=true;
      try{
        const outcome=respondSourceGraph(originalSource,reply,Date.now(),manual);
        await saveOriginal(outcome.state);
        sourceNotice=outcome.message;
        sourcePaused=false;busy=false;
        if(outcome.outcome==='uncertain'||outcome.outcome==='repair')renderOriginalSource(reply);
        else render();
      }catch(error){
        if(!await recoverOriginalConflict(error,reply))
          localStatus.textContent='Source turn was not saved; no progress recorded. '+String(error);
      }finally{busy=false;}
    };
    form.onsubmit=event=>{event.preventDefault();void submit(false);};
    field.addEventListener('keydown',event=>{
      if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();form.requestSubmit();}
    });
    stage.append(banner,meter,partner,goal,form,authored,companions,assistance,localStatus,actions);
    field.focus({preventScroll:true});
  };

  const render=()=>{
    if(originalSource.active&&!sourcePaused){renderOriginalSource();return;}
    const active=state.active,scene=active?getConversationScenario(active.scenarioId):null;
    if(scene)renderActive(scene);else renderHome();
  };
  render();
}
