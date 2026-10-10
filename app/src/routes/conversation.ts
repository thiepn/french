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
import {P35_P18_MISSIONS} from '../core/conversation/source-parity';
import {startSourceGraph,startSourceMission,sourceSupport,respondSourceGraph,cancelSourceGraph,
 sourcePrompt,type SourceGraphState} from '../core/conversation/p35-runtime';
import {loadSourceGraphState,persistSourceGraphState} from '../core/conversation/p35-storage';
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
  let sourcePaused=false,sourceNotice='';
  if(signal.aborted)return;
  let busy=false,lastSubmission:{key:string;at:number}|null=null;
  let lastResult:ConversationResult|null=null,lastMissionResult:MissionResult|null=null;
  let lastAdaptiveResult:AdaptiveResult|null=null;
  const saveOriginal=async(next:SourceGraphState)=>{
    await persistSourceGraphState(next);
    originalSource=next;
  };
  const canStartOriginal=()=>!busy&&!state.active&&!state.mission&&!state.adaptive&&!originalSource.active;
  const commitOriginal=async(work:()=>SourceGraphState,message:string)=>{
    if(busy||signal.aborted)return;
    busy=true;
    try{
      const next=work();
      await saveOriginal(next);
      sourceNotice=message;
      sourcePaused=false;
      busy=false;
      render();
    }catch(error){status.textContent='Source practice was not saved. No new step has been credited. '+String(error);}
    finally{busy=false;}
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
        ' · '+recent.independent+'/'+recent.turns+' unsupported matches · '+
        (recent.complete?'source objectives covered':'source goals incomplete')+'. This is rehearsed practice only.','muted-copy'));
    }
    originalDeck.append(item('h3','Source P18 missions'));
    const missionList=item('div','','source-graph-list');
    for(const mission of P35_P18_MISSIONS){
      const source=mission.scenarios.map(id=>getP35SourceScenario(id));
      const locked=source.some(g=>!g||['A1','A2','B1'].indexOf(g.level)>['A1','A2','B1'].indexOf(originalSource.maxLevel));
      const control=button(mission.title+' · 3 original source graphs','secondary-action compact-action');
      control.disabled=!canStartOriginal()||locked;
      control.onclick=()=>void commitOriginal(()=>startSourceMission(originalSource,mission.id,Date.now()),
        'Source mission started; response text is not retained.');
      missionList.append(control);
    }
    originalDeck.append(missionList,item('h3','Pinned original source scenarios'));
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
    const original=item('details','','conversation-source-parity');
    original.append(item('summary','Original P35 P20 functions · '+coverage.originalP20Functions+' source definitions'));
    original.append(item('p','Source identity is not a native mastery result: the existing 23 native function scores are separate. P35 also added six B2 functions later.','muted-copy'));
    for(const group of ['Foundation','Interaction','Problem solving','Planning & opinion','Narrative']){
      const section=item('section','','conversation-function-group');
      section.append(item('h3',group));
      for(const fn of P35_P20_FUNCTIONS.filter(fn=>fn.group===group)){
        const row=item('p','','conversation-source-function');
        row.append(item('strong',fn.label),item('span','Source '+fn.id+' · not independently assessed'));
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

  const renderOriginalSource=()=>{
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
      const mission=P35_P18_MISSIONS.find(m=>m.id===originalSource.mission?.id);
      banner.append(item('p','Source mission '+(mission?.title??originalSource.mission.id)+
        ' · task '+(originalSource.mission.index+1)+'/3 · earlier tasks '+
        originalSource.mission.completed.length,'conversation-mission-banner'));
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
    const form=item('form','','conversation-compose');
    const field=item('textarea','','conversation-input');field.rows=3;field.maxLength=650;
    field.autocomplete='off';field.setAttribute('aria-label','Reply to original source graph in French');
    field.placeholder='Répondez en français…';
    const assistance=item('p','','conversation-assistance');
    if(active.support>=1)assistance.append(item('span','Source hint · '+(node.hint??'Respond in French.')));
    if(active.support>=2)assistance.append(item('span','Source model · '+(node.phrases?.[0]??'No source example available')));
    const localStatus=item('p',sourceNotice,'conversation-feedback');
    localStatus.setAttribute('role','status');localStatus.setAttribute('aria-live','polite');
    const tools=item('div','','conversation-controls');
    const send=button('Check source rule','primary-action compact-action');send.type='submit';
    const hint=button('Show original hint');hint.onclick=()=>void commitOriginal(()=>
      sourceSupport(originalSource,1,Date.now()),'Original hint requested. Independent turn credit is reduced.');
    const example=button('Show source example');example.onclick=()=>void commitOriginal(()=>
      sourceSupport(originalSource,2,Date.now()),'Source phrase revealed; independent credit withheld.');
    const repeat=button('Ask for clarification');repeat.onclick=()=>void commitOriginal(()=>
      respondSourceGraph(originalSource,'Pardon, pouvez-vous répéter ?',Date.now()).state,
      node.clarify??'Bien sûr, je reformule la question.');
    const manual=button('Continue without evidence');manual.onclick=()=>{
      if(!confirm('Advance along the first pinned graph rule without scorer evidence? This turn will not count as independently matched.'))return;
      void submit(true);
    };
    tools.append(send,repeat,hint,example,manual);
    form.append(field,tools);
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
        sourcePaused=false;busy=false;render();
      }catch(error){localStatus.textContent='Source turn was not saved; no progress recorded. '+String(error);}
      finally{busy=false;}
    };
    form.onsubmit=event=>{event.preventDefault();void submit(false);};
    field.addEventListener('keydown',event=>{
      if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();form.requestSubmit();}
    });
    stage.append(banner,meter,partner,goal,form,assistance,localStatus,actions);
    field.focus({preventScroll:true});
  };

  const render=()=>{
    if(originalSource.active&&!sourcePaused){renderOriginalSource();return;}
    const active=state.active,scene=active?getConversationScenario(active.scenarioId):null;
    if(scene)renderActive(scene);else renderHome();
  };
  render();
}
