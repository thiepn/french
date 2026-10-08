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
  if(signal.aborted)return;
  let busy=false,lastSubmission:{key:string;at:number}|null=null;
  let lastResult:ConversationResult|null=null,lastMissionResult:MissionResult|null=null;
  let lastAdaptiveResult:AdaptiveResult|null=null;
  const save=async(next:ConversationState)=>{
    await persistConversationState(next);
    state=next;
  };
  const select=async(id:string)=>{
    if(busy||state.active||state.mission||state.adaptive||signal.aborted)return;
    busy=true;
    try{await save(startConversation(state,id));lastResult=null;lastMissionResult=null;lastAdaptiveResult=null;render();}
    catch(error){status.textContent='Could not start this conversation. Your saved data was not changed.';console.error(error);}
    finally{busy=false;}
  };
  const selectMission=async(id:string)=>{
    if(busy||state.active||state.mission||state.adaptive||signal.aborted)return;
    busy=true;
    try{
      await save(beginMission(state,id));lastResult=null;lastMissionResult=null;lastAdaptiveResult=null;render();
    }catch(error){
      status.textContent='Could not start this mission. Your progress remains saved.';console.error(error);
    }finally{busy=false;}
  };
  const selectAdaptive=async()=>{
    if(busy||state.active||state.mission||state.adaptive||signal.aborted)return;
    busy=true;
    try{
      await save(beginAdaptiveSet(state));lastResult=null;lastMissionResult=null;lastAdaptiveResult=null;render();
    }catch(error){
      status.textContent='Could not build a three-task set. Existing work was preserved.';console.error(error);
    }finally{busy=false;}
  };
  const updateCeiling=async(level:ConversationLevel)=>{
    if(busy||state.active||state.mission||state.adaptive)return;
    busy=true;
    try{await save(changeConversationCeiling(state,level));renderHome();}
    catch(error){status.textContent='Could not save the practice level.';console.error(error);}
    finally{busy=false;}
  };
  const renderHome=()=>{
    stage.replaceChildren();
    const intro=item('p','Practise a short, structured exchange. The checker looks for required language patterns, not full conversational meaning. Your typed responses are not saved.','conversation-intro');
    stage.append(intro);
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
    picker.disabled=Boolean(state.active||state.mission||state.adaptive);
    picker.addEventListener('change',()=>void updateCeiling(picker.value as ConversationLevel));
    levelRow.append(picker);lesson.append(levelRow);
    const picks=rankedNativeScenarios(state.functionEvents,state.history,state.levelCeiling);
    if(picks.length){
      const top=picks[0],summary=item('div','','conversation-next');
      summary.append(item('strong','Recommended · '+top.title),
        item('small',top.reason+' · '+top.level));
      const go=button('Start recommendation','primary-action compact-action');
      go.disabled=Boolean(state.active||state.mission||state.adaptive);
      go.onclick=()=>void select(top.scenarioId);
      summary.append(go);lesson.append(summary);
    }
    const adaptive=item('div','','conversation-next');
    adaptive.append(item('strong','Adaptive set · 3 tasks'),
      item('small','Three distinct practice situations chosen from recent function evidence. This is practice, not a proficiency test.'));
    const startAdaptive=button('Start adaptive set','secondary-action compact-action');
    startAdaptive.disabled=Boolean(state.active||state.mission||state.adaptive);
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
        item('small','3 connected scenarios · '+mission.scenarioIds.map(id=>getConversationScenario(id)?.title??id).join(' → ')));
      choice.append(item('span',mission.level,'conversation-level'),words,item('span','→','conversation-arrow'));
      choice.disabled=Boolean(state.active||state.mission||state.adaptive)
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
      words.append(item('strong',scene.title),item('small',scene.setting+' · '+scene.turns.length+' turns'));
      control.append(item('span',scene.level,'conversation-level'),words,item('span','→','conversation-arrow'));
      control.disabled=Boolean(state.active||state.mission||state.adaptive)
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
    const goal=item('p',turn.goal,'conversation-goal');
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
    stage.append(context,track,exchange,goal,form,assistance,feedback,commands);
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
  const render=()=>{const active=state.active,scene=active?getConversationScenario(active.scenarioId):null;
    if(scene)renderActive(scene);else renderHome();};
  render();
}
