import './conversation.css';
import type {RouteContext} from '../core/types';
import {CONVERSATION_STARTERS,getConversationScenario,type ConversationScenario} from '../core/conversation/scenarios';
import {MISSION_CHAINS,getMission} from '../core/conversation/missions';
import {
  startConversation,beginMission,endConversation,submitConversationResponse,raiseConversationSupport,
  type ConversationState,type ConversationResult,type MissionResult
} from '../core/conversation/engine';
import {loadConversationState,persistConversationState} from '../core/conversation/storage';
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
  const save=async(next:ConversationState)=>{
    await persistConversationState(next);
    state=next;
  };
  const select=async(id:string)=>{
    if(busy||state.active||state.mission||signal.aborted)return;
    busy=true;
    try{await save(startConversation(state,id));lastResult=null;lastMissionResult=null;render();}
    catch(error){status.textContent='Could not start this conversation. Your saved data was not changed.';console.error(error);}
    finally{busy=false;}
  };
  const selectMission=async(id:string)=>{
    if(busy||state.active||state.mission||signal.aborted)return;
    busy=true;
    try{
      await save(beginMission(state,id));lastResult=null;lastMissionResult=null;render();
    }catch(error){
      status.textContent='Could not start this mission. Your progress remains saved.';console.error(error);
    }finally{busy=false;}
  };
  const renderHome=()=>{
    stage.replaceChildren();
    const intro=item('p','Practise a short, structured exchange. The checker looks for required language patterns, not full conversational meaning. Your typed responses are not saved.','conversation-intro');
    stage.append(intro);
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
    if(lastResult&&!lastMissionResult){
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
        active.append(item('strong',mission?'Mission · '+mission.title:'Unfinished · '+resumed.title),
          item('span',(mission?'Task '+(state.mission!.step+1)+' / 3 · ':'')+
            'Turn '+(state.active.cursor+1)+' of '+resumed.turns.length));
        const resume=button('Resume active','primary-action compact-action');
        resume.onclick=()=>renderActive(resumed);
        active.append(resume);stage.append(active);
      }
    }
    const missions=item('div','','conversation-mission-list');
    for(const mission of MISSION_CHAINS){
      const choice=button('','conversation-choice conversation-mission-choice');
      const words=item('span','','conversation-choice-copy');
      words.append(item('strong',mission.title),
        item('small','3 connected scenarios · '+mission.scenarioIds.map(id=>getConversationScenario(id)?.title??id).join(' → ')));
      choice.append(item('span',mission.level,'conversation-level'),words,item('span','→','conversation-arrow'));
      choice.disabled=Boolean(state.active||state.mission);
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
    for(const scene of CONVERSATION_STARTERS){
      const control=button('','conversation-choice');
      const words=item('span','','conversation-choice-copy');
      words.append(item('strong',scene.title),item('small',scene.setting+' · '+scene.turns.length+' turns'));
      control.append(item('span',scene.level,'conversation-level'),words,item('span','→','conversation-arrow'));
      control.disabled=Boolean(state.active||state.mission);
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
    status.textContent=state.active?'An unfinished exchange is saved. Resume or end it before choosing another.':'Choose a situation. Work stays on this device unless you explicitly enable Account sync.';
  };
  const renderActive=(scene:ConversationScenario,preservedText='')=>{
    const active=state.active;if(!active||active.scenarioId!==scene.id){renderHome();return;}
    const turn=scene.turns[active.cursor];if(!turn){renderHome();return;}
    stage.replaceChildren();
    const context=item('div','','conversation-context');
    context.append(item('span',scene.level+' · '+scene.setting,'conversation-scene'),item('span','Turn '+(active.cursor+1)+' / '+scene.turns.length));
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
    exchange.append(item('p',scene.partner,'conversation-speaker'),item('blockquote',turn.partner,'conversation-prompt'));
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
    const manual=button('My response fits');
    manual.title='Continue without scoring this turn as independently matched.';
    controls.append(send,hint,example,manual);form.append(field,controls);
    const assistance=item('p','','conversation-assistance');
    const feedback=item('p','','conversation-feedback');feedback.setAttribute('role','status');
    if(active.support>=1)assistance.textContent=active.support===2?'Example · '+turn.model:'Hint · '+turn.hint;
    const commands=item('div','','conversation-bottom');
    const pause=button('Pause & home','conversation-link');
    const quit=button(state.mission?'End unfinished mission':'End unfinished exchange','conversation-link conversation-danger');
    pause.onclick=()=>renderHome();
    quit.onclick=async()=>{
      if(busy||!confirm(state.mission
        ?'End this unfinished mission? Completed individual conversations will remain in history, but this mission will not count as completed.'
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
        const outcome=submitConversationResponse(state,raw,isManual);
        await save(outcome.state);
        if(previousMission&&!outcome.state.mission&&outcome.state.missionHistory.length)
          lastMissionResult=outcome.state.missionHistory[0];
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
