import type {RouteId} from '../core/types';
import {CUR02_LEVELS,buildFrenchCourseNavigation,navLevelForOriginalBand,parseFrenchCourseLocation,frenchCourseLocation,type Cur02Level} from '../core/unified/cur02-level-nav';
import {readOriginalContinuity,saveOriginalContinuity,discardOriginalContinuity,
 type ContinuityReview} from '../core/unified/u24-continuity';
import {loadU22OriginalFrenchCourse,suggestedU22OriginalUnit,u22PracticeStatus} from '../core/unified/u22-course';
import {
 browseOriginalMaterials,getOriginalUnit,getOriginalCatalogEntry,handoffOriginalLesson,
 neighboringOriginalLessons,takeOriginalHandoff,type OriginalLevel,type OriginalMaterialKind
} from '../core/unified/u23-registry';
import {u22ProductionChoices} from '../core/unified/u22-material';
import {ORIGINAL_PATHWAYS,originalPathSectionFor,originalNextActions} from '../core/unified/u25-pathways.ts';
import {U20_REVISION_GUIDES} from '../core/unified/u20-revision-guides';
import {U21_REVISION_GUIDES} from '../core/unified/u21-revision-guides';
import {U22_REVISION_GUIDES} from '../core/unified/u22-revision-guides';
import {appendOriginalB1Reading} from './u10-reading-panel';
import {mountA1Listening} from './u7-listening-panel';
import {appendOriginalOralJourney} from './u31-oral-panel';
import {checkPracticeAnswer} from '../core/unified/u2-grammar';
import {inspectDraftStructure} from '../core/unified/u3-writing';
import {appendU26GrammarPractice} from './u26-grammar-panel';
import {createOriginalPlacementPanel} from './u27-placement-panel';
import {originalPlacementPrerequisites,originalPlacementGrammarRefreshers} from '../core/unified/u27-placement.ts';
import {appendOriginalVocabularyJourney,createOriginalVocabularyDiscovery} from './u28-vocabulary-panel';
import {appendOriginalReadingJourney} from './u29-reading-panel';
import type {A1Task,A1Unit} from '../core/unified/u6-a1-model';
import './unified-u6.css';
import './unified-u8.css';
import './unified-u20.css';
type Stage='understand'|'words'|'dialogue'|'listen'|'practice'|'write';
const STAGES:readonly [Stage,string][]=[
 ['understand','1. Understand'],['words','2. Vocabulary'],['dialogue','3. Read'],
 ['listen','4. Listen'],['practice','5. Recall'],['write','6. Write']
];
function el<K extends keyof HTMLElementTagNameMap>(tag:K,content?:string,classes?:string):HTMLElementTagNameMap[K]{
 const node=document.createElement(tag);
 if(content!==undefined)node.textContent=content;
 if(classes)node.className=classes;
 return node;
}
function button(label:string,action:()=>void,classes='secondary-action compact-action'):HTMLButtonElement{
 const b=el('button',label,classes);b.type='button';b.addEventListener('click',action);return b;
}
export async function mountA1FullCourse(host:HTMLElement,navigate:(route:RouteId)=>void,signal:AbortSignal):Promise<void>{
 host.replaceChildren(el('p','Loading the original French full Course…'));
 try{
  const lessons=await loadU22OriginalFrenchCourse();
  const levelCatalog=buildFrenchCourseNavigation(ORIGINAL_PATHWAYS.flatMap(path=>path.sections.flatMap(section=>section.entries)));
  const requestedCourse=parseFrenchCourseLocation(location.hash,levelCatalog);
  if(signal.aborted||!host.isConnected)return;
  // Ephemeral course practice, deliberately independent of the canonical native scheduler.
  const answers=new Map<string,Map<string,boolean>>();
  const mistakes=new Map<string,Set<string>>();
  const drafts=new Map<string,string>();
  // Earlier draft snapshots for U20 self-revision; same page lifetime as original temporary drafts.
  const revisionSnapshots=new Map<string,string>();
  let continuity:ContinuityReview=await readOriginalContinuity();
  if(signal.aborted||!host.isConnected)return;
  const incoming=takeOriginalHandoff('course');
  const saved=continuity.status==='ready'?continuity.checkpoint:null;
  let current=getOriginalUnit(incoming?.id??requestedCourse?.id??saved?.id??'')??lessons[0],
    stage:Stage=incoming?.stage??saved?.stage??'understand',
    taskIndex=(!incoming&&saved?.id===current.id)?saved.taskIndex:0;
  let selectedCourseLevel:Cur02Level=requestedCourse?.level??navLevelForOriginalBand(getOriginalCatalogEntry(current.id)?.level??'A1');
  let stopAudio:(()=>void)|null=null;
  // Existing source-verified CAS, not another learner progress model.
  // Stale, blocked and unavailable positions are never overwritten automatically.
  let tracking=continuity.status==='ready'||continuity.status==='empty',
    reviewBusy=false,recoveryError='',saveChain=Promise.resolve();
  const hasPrivateDrafts=()=>[...drafts.values()].some(text=>text.trim().length>0)||
   !!host.querySelector<HTMLTextAreaElement>('.u28-writing textarea')?.value.trim()||
   !!host.querySelector<HTMLTextAreaElement>('.u29-summary-label textarea')?.value.trim()||
   !!host.querySelector<HTMLTextAreaElement>('.u30-interpretation textarea')?.value.trim()||
   !!host.querySelector<HTMLElement>('.u31-oral[data-has-private-draft="true"]');
  const allowExit=()=>!hasPrivateDrafts()||
   window.confirm('Leaving this Course discards unsent writing. Navigation checkpoints never include your text. Leave without the drafts?');
  const navigateSafely=(route:RouteId)=>{if(allowExit())navigate(route);};
  host.replaceChildren();host.className='u6-full-course course-focus-runner';
  const header=el('header',undefined,'u6-head');
  header.append(el('p','ORIGINAL COURSE · A1 TO EARLY B2','eyebrow'),
    el('h2','Choose where to learn'),
    el('p','244 original lessons from foundations to early B2. Learn in sequence, follow an authored pathway or find a topic. Original lesson exercises are ungraded; native Learn and Review retain their own progress.'));
  const status=el('p',undefined,'u6-course-status');status.setAttribute('role','status');
  const hero=el('section',undefined,'u25-hero');
  hero.setAttribute('aria-label','Start or continue original French');
  const pathways=el('nav',undefined,'u25-pathways');
  pathways.setAttribute('aria-label','Choose an original French level');
  const placement=el('div',undefined,'u27-course-entry');
  const vocabularyDiscovery=createOriginalVocabularyDiscovery(signal,id=>{
   const target=getOriginalCatalogEntry(id);if(!target)return;
   if(host.querySelector<HTMLTextAreaElement>('.u28-writing textarea')?.value.trim()&&
      !window.confirm('Leave your temporary original vocabulary writing draft? It is not saved.'))return;
   search.value='';levelFilter.value=target.level;materialFilter.value='all';
   openedGroups.clear();visible=60;
   open(id,'words',undefined,true);
  });
  const activities=el('details',undefined,'u25-activities u39-secondary-tools');
  activities.setAttribute('aria-label','Available original practice for the selected lesson');
  const layout=el('div',undefined,'u6-layout');
  const focusBar=el('div',undefined,'course-focus-bar');
  const levelChoices=el('div',undefined,'course-level-choices');
  levelChoices.setAttribute('role','group');
  levelChoices.setAttribute('aria-label','Choose your French level');
  for(const record of levelCatalog){
    const choice=button(record.level,()=>selectCourseLevel(record.level),'course-level-choice');
    choice.dataset.courseLevel=record.level;
    choice.title=record.availability==='planned'?record.level+' curriculum planned':'Open '+record.level+' course units';
    choice.setAttribute('aria-label',record.level+(record.coverage?' · '+record.coverage:'')+(record.availability==='planned'?' · planned':''));
    levelChoices.append(choice);
  }
  const levelLessonList=el('ol',undefined,'cur02-level-lesson-list');
  levelLessonList.setAttribute('aria-label','Numbered lessons in selected level');
  const lessonLabel=el('label','Lesson','course-lesson-picker');
  const lessonSelect=el('select');
  lessonSelect.setAttribute('aria-label','Choose an original lesson');
  for(const pathway of ORIGINAL_PATHWAYS){
    const group=el('optgroup');group.label=pathway.level;
    for(const section of pathway.sections)for(const entry of section.entries){
      const option=el('option',entry.title);option.value=entry.id;group.append(option);
    }
    lessonSelect.append(group);
  }
  lessonSelect.addEventListener('change',()=>open(lessonSelect.value,'understand',undefined,true));
  lessonLabel.append(lessonSelect);
  const sidebar=el('nav',undefined,'u6-lesson-index');sidebar.setAttribute('aria-label','Filterable original French course lesson index');
  const article=el('article',undefined,'u6-lesson-content');article.dataset.u6LessonContent='';
  const finder=el('section',undefined,'u23-course-finder');
  finder.setAttribute('role','search');finder.setAttribute('aria-label','Find original French lessons');
  const searchLabel=el('label','Search 244 original lessons');
  const search=el('input');search.type='search';search.autocomplete='off';
  search.placeholder='Title, French word, topic or grammar';
  search.setAttribute('aria-label','Search original course lessons');searchLabel.append(search);
  const levelLabel=el('label','Level'),levelFilter=el('select');
  for(const value of ['all','A1','A2','B1','B1+','Early B2'] as const){
   const option=el('option',value==='all'?'All levels':value);option.value=value;levelFilter.append(option);
  }levelLabel.append(levelFilter);
  const materialLabel=el('label','Material'),materialFilter=el('select');
  for(const [value,title] of [
   ['all','All lessons'],['reading','With connected reading'],['listening','With dialogue'],
   ['writing','With writing'],['source-comparison','With source comparison']
  ] as const){
   const option=el('option',title);option.value=value;materialFilter.append(option);
  }materialLabel.append(materialFilter);
  const matchCount=el('p','','u23-course-results');matchCount.setAttribute('role','status');
  let visible=60;
  const openedGroups=new Set<string>();
  const loadMore=button('Show next 60 lessons',()=>{visible+=60;renderIndex();});
  const resetFilters=button('Clear filters',()=>{
   search.value='';levelFilter.value='all';materialFilter.value='all';visible=60;renderIndex();search.focus();
  });
  finder.append(searchLabel,levelLabel,materialLabel,resetFilters,matchCount,loadMore);
  search.addEventListener('input',()=>{visible=60;renderIndex();});
  levelFilter.addEventListener('change',()=>{visible=60;renderIndex();});
  materialFilter.addEventListener('change',()=>{visible=60;renderIndex();});
  const recovery=el('section',undefined,'u24-recovery');
  recovery.setAttribute('aria-label','Original Course navigation recovery');
  const discovery=el('details',undefined,'u25-discovery');
  discovery.append(el('summary','Find a lesson · Search, level and material filters'),finder);
  const indexDetails=el('details',undefined,'u25-index-details');
  indexDetails.append(el('summary','Browse lesson groups'),sidebar);
  indexDetails.addEventListener('toggle',()=>layout.classList.toggle('u25-browse-open',indexDetails.open));
  layout.append(indexDetails,article);
  placement.append(createOriginalPlacementPanel({
   signal,
   onOpenCourse:id=>{
    const target=getOriginalCatalogEntry(id);if(!target)return;
    search.value='';levelFilter.value=target.level;materialFilter.value='all';
    visible=60;openedGroups.clear();
    open(target.id,'understand',undefined,true);
   },
   onOpenSurface:(surface,id)=>{
    if(!allowExit())return;
    if(handoffOriginalLesson(surface,id))navigate(surface);
   },
   onNativeReview:()=>navigateSafely('review')
  }));
  const browseButton=button('Browse',()=>{
    indexDetails.open=!indexDetails.open;
    browseButton.setAttribute('aria-expanded',String(indexDetails.open));
  },'course-browse-button');
  browseButton.setAttribute('aria-expanded','false');
  indexDetails.addEventListener('toggle',()=>{
    browseButton.setAttribute('aria-expanded',String(indexDetails.open));
  });
  const extra=el('details',undefined,'course-extra-tools');
  const extraSummary=el('summary','More learning tools');
  const extraContent=el('div',undefined,'course-extra-content');
  extraContent.append(header,hero,pathways,vocabularyDiscovery,placement,activities,recovery,status,discovery);
  extra.append(extraSummary,extraContent);
  focusBar.append(levelChoices,levelLessonList,lessonLabel,browseButton,extra);
  host.append(focusBar,layout);
  function updateSixLevelList(){
    levelLessonList.replaceChildren();
    const selected=levelCatalog.find(item=>item.level===selectedCourseLevel);
    for(const btn of levelChoices.querySelectorAll<HTMLButtonElement>('[data-course-level]')){
      const active=btn.dataset.courseLevel===selectedCourseLevel;
      btn.classList.toggle('is-selected',active);btn.setAttribute('aria-pressed',String(active));
    }
    if(!selected||!selected.lessons.length){
      levelLessonList.append(el('li',selectedCourseLevel+' curriculum planned · no source-approved original lessons yet.'));
      return;
    }
    if(selected.coverage)levelLessonList.append(el('li',selected.coverage+' · no full-level proficiency claim.'));
    for(const entry of selected.lessons){
      const row=el('li');
      row.append(button(String(entry.number).padStart(2,'0')+' · '+entry.title,
        ()=>open(entry.id,'understand',undefined,true),'cur02-lesson-link'));
      levelLessonList.append(row);
    }
  }
  function selectCourseLevel(level:Cur02Level){
    const selected=levelCatalog.find(item=>item.level===level);
    if(!selected)return;
    if(!allowExit())return;
    selectedCourseLevel=level;
    window.history.replaceState(window.history.state,'',frenchCourseLocation(level));
    if(selected.lessons.length)open(selected.lessons[0]!.id,'understand',undefined,true);
    else {
      updateSixLevelList();
      article.replaceChildren(el('h3',level+' curriculum planned'),
        el('p','No original source-approved lessons are available for this level.'));
      lessonSelect.hidden=true;
    }
  }
  function focusCourseLesson(){
   const body=article.querySelector<HTMLElement>('.u6-stage-body');
   if(body)body.scrollTop=0;
   const heading=article.querySelector<HTMLElement>('.u6-unit-header h3');
   if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
  }
  function openPath(level:OriginalLevel){
   const selected=ORIGINAL_PATHWAYS.find(path=>path.level===level);
   if(!selected?.firstId)return;
   levelFilter.value=level;materialFilter.value='all';search.value='';
   visible=60;openedGroups.clear();indexDetails.open=false;
   open(selected.firstId,'understand',undefined,true);
  }
  function renderLearningEntry(){
   const saved=continuity.status==='ready'&&!tracking?continuity.checkpoint:null;
   const entry=getOriginalCatalogEntry(current.id);
   hero.replaceChildren();
   hero.append(el('p',saved?'SAVED POSITION VERIFIED':'YOUR ORIGINAL LESSON','eyebrow'),
    el('h3',saved?'Return to '+(getOriginalCatalogEntry(saved.id)?.title??saved.id):current.title),
    el('p',saved?'Resume '+saved.stage+' · question '+(saved.taskIndex+1)+
       '. Your checkpoint contains navigation only, not answers or drafts.':
       (entry?.level??'Original')+' · '+current.goal,'u25-hero-description'));
   const primary=button(saved?'Resume verified lesson':
    current.id==='a1-01'&&stage==='understand'?'Start from A1':'Continue selected lesson',()=>{
    if(saved){
     tracking=true;recoveryError='';
     open(saved.id,saved.stage,saved.taskIndex,true);drawRecovery();
    }else open(current.id,stage,taskIndex,true);
   },'primary-action compact-action');
   const actions=el('div',undefined,'u25-hero-actions');
   actions.append(primary,button('Find my starting lesson',()=>{
     const disclosure=placement.querySelector<HTMLDetailsElement>('details');
     if(!disclosure)return;
     disclosure.open=true;disclosure.scrollIntoView({block:'start'});
     disclosure.querySelector<HTMLElement>('summary')?.focus({preventScroll:true});
    }),button('Native Review',()=>navigateSafely('review')),
    button('Find a lesson',()=>{
     discovery.open=true;indexDetails.open=true;
     search.focus({preventScroll:true});discovery.scrollIntoView({block:'start'});
    }));
   hero.append(actions);
   pathways.replaceChildren(el('h3','Choose a learning pathway'));
   const cards=el('div',undefined,'u25-pathway-list');
   for(const path of ORIGINAL_PATHWAYS){
    const card=button(path.title,()=>openPath(path.level),'u25-pathway');
    card.append(el('span',path.count+' lessons · '+path.readingCount+' linked readings'),
     el('small',path.description));
    if(path.level===entry?.level){card.classList.add('is-selected');card.setAttribute('aria-current','true');}
    cards.append(card);
   }
   pathways.append(cards);
   activities.replaceChildren(el('summary','More source-linked activities for this lesson'));
   const choices=el('div',undefined,'u25-activity-list');
   for(const next of originalNextActions(current.id).filter(action=>action.key!=='understand')){
    const card=button(next.title,()=>{
     if(next.destination==='course')open(next.id,next.stage,undefined,true);
     else if(allowExit()&&handoffOriginalLesson(next.destination,next.id))navigate(next.destination);
    },'u25-activity');
    card.append(el('span',next.detail));choices.append(card);
   }
   activities.append(choices,el('p','These are available authored activities, not due reviews or verified skill recommendations.','u6-small'));
  }
  function drawRecovery(){
   if(signal.aborted)return;
   const checkpoint=continuity.checkpoint;
   recovery.replaceChildren(el('h3','Return to your original lesson'));
   const message=el('p',continuity.message,'u24-recovery-copy');
   message.setAttribute('role','status');recovery.append(message);
   if(checkpoint)recovery.append(el('p',
    'Saved: '+(getOriginalCatalogEntry(checkpoint.id)?.title??checkpoint.id)+
    ' · '+checkpoint.stage+' · question '+(checkpoint.taskIndex+1)+
    ' · '+new Date(checkpoint.updatedAt).toLocaleString(),'u24-recovery-snapshot'));
   recovery.append(el('p','Only lesson identity, source revision, stage and question number are recoverable. Answers, essays, transcripts, audio and scores are not stored.','u24-recovery-copy'));
   const controls=el('div',undefined,'u24-recovery-actions');
   const add=(label:string,action:()=>void)=>{
    const item=button(label,action);item.disabled=reviewBusy;controls.append(item);
   };
   if(continuity.status==='ready'&&!tracking&&checkpoint)
    add('Resume saved lesson',()=>{
     tracking=true;recoveryError='';
     open(checkpoint.id,checkpoint.stage,checkpoint.taskIndex);
     const title=article.querySelector<HTMLElement>('.u6-unit-header h3');
     if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
    });
   if((continuity.status==='empty'||continuity.status==='ready')&&!tracking)
    add(continuity.status==='ready'?'Save this position instead':'Remember my lesson position',()=>{
     tracking=true;recoveryError='';
     schedulePosition(current.id,stage,taskIndex);drawRecovery();
    });
   if(tracking){
    add('Save position now',()=>schedulePosition(current.id,stage,taskIndex));
    add('Pause position saving',()=>{
     tracking=false;recoveryError='Automatic position updates paused; the last saved checkpoint is unchanged.';
     drawRecovery();
    });
   }
   if(continuity.status==='ready'||continuity.status==='stale'||
      (continuity.status==='blocked'&&continuity.expectedToken!==null))
    add('Discard saved position',()=>void discardSaved());
   if(continuity.status==='stale'||continuity.status==='blocked'||
      continuity.status==='unavailable'||recoveryError)
    add('Refresh saved-state review',()=>void refreshReview());
   recovery.append(controls);
   if(recoveryError)recovery.append(el('p',recoveryError,'u24-recovery-warning'));
   renderLearningEntry();
  }
  const schedulePosition=(id:string,next:Stage,index:number)=>{
   if(!tracking||signal.aborted)return;
   saveChain=saveChain.then(async()=>{
    if(!tracking)return;
    const result=await saveOriginalContinuity(continuity,id,next,index);
    continuity=result.review;
    if(result.outcome!=='saved'){
     tracking=false;
     recoveryError=result.outcome==='conflict'?
      'A newer checkpoint exists, possibly from another tab. Review it before making changes.':
      'This checkpoint or source cannot be updated safely.';
    }else recoveryError='';
    if(!signal.aborted)drawRecovery();
   }).catch(()=>{
    tracking=false;recoveryError='Saving failed. Course practice remains usable; do not rely on this position until it is saved.';
    if(!signal.aborted)drawRecovery();
   });
  };
  async function refreshReview(){
   reviewBusy=true;drawRecovery();await saveChain;
   continuity=await readOriginalContinuity();reviewBusy=false;recoveryError='';
   if(!signal.aborted)drawRecovery();
  }
  async function discardSaved(){
   if(!window.confirm('Discard only the saved lesson position? Existing graded study records are unchanged.'))return;
   tracking=false;reviewBusy=true;drawRecovery();await saveChain;
   try{
    const result=await discardOriginalContinuity(continuity);continuity=result.review;
    recoveryError=result.outcome==='discarded'?'Saved navigation position discarded.':
     result.outcome==='conflict'?'A newer checkpoint exists. Review it before discarding.':
     'The saved record cannot be discarded automatically.';
   }catch{recoveryError='Could not discard this checkpoint. No other learning record changed.';}
   reviewBusy=false;if(!signal.aborted)drawRecovery();
  }
  drawRecovery();
  const answerMap=(id:string)=>{
   let found=answers.get(id);
   if(!found){found=new Map();answers.set(id,found);}
   return found;
  };
  const practiced=()=>{
   const passed=new Set<string>();
   for(const [id,record] of answers)if(u22PracticeStatus(id,record)?.locallyPracticed)passed.add(id);
   return passed;
  };
  function renderIndex(){
   const done=practiced(),next=suggestedU22OriginalUnit(done);
   status.textContent=done.size+'/'+lessons.length+
    ' lesson exercise sets practiced in this page visit. '+
    (next?'Suggested next: '+next.title+'.':'Every lesson exercise set has a correct response recorded locally.');
   const matches=browseOriginalMaterials({
    query:search.value,level:levelFilter.value as OriginalLevel|'all',
    material:materialFilter.value as OriginalMaterialKind|'all',limit:visible
   });
   matchCount.textContent=matches.total+' matching lessons · '+matches.entries.length+' currently shown';
   loadMore.hidden=matches.entries.length>=matches.total;
   sidebar.replaceChildren(el('h3','A1–B2 lesson sequence'));
   if(!matches.total)sidebar.append(el('p','No original lessons match. Try a broader topic, level or material type.','u6-small'));
   let sectionId='',chapter:HTMLElement=sidebar;
   if(!matches.entries.some(row=>row.id===current.id)){
    const pinned=getOriginalCatalogEntry(current.id);
    if(pinned){
     const selected=button('Current lesson · '+pinned.title,
      ()=>open(pinned.id,'understand',undefined,true),'u6-unit-button selected');
     selected.dataset.u6Unit=pinned.id;
     selected.setAttribute('aria-current','true');
     sidebar.append(selected);
    }
   }
   for(const row of matches.entries){
    const unit=getOriginalUnit(row.id);
    const groupInfo=originalPathSectionFor(row.id);
    if(!unit||!groupInfo)continue;
    if(groupInfo.id!==sectionId){
     sectionId=groupInfo.id;
     const details=el('details',undefined,'u25-lesson-group');
     details.open=openedGroups.has(groupInfo.id)||
      groupInfo.entries.some(item=>item.id===current.id)||search.value.trim().length>0;
     const key=groupInfo.id;
     details.addEventListener('toggle',()=>{
      if(details.open)openedGroups.add(key);else openedGroups.delete(key);
     });
     details.append(el('summary',groupInfo.title),
      el('p',groupInfo.description,'u6-small'));
     chapter=el('div',undefined,'u25-group-items');
     details.append(chapter);sidebar.append(details);
    }
    const record=answers.get(unit.id);
    const practice=record?u22PracticeStatus(unit.id,record):null;
    const label=String(unit.order).padStart(3,'0')+' · '+unit.title+
     (practice?.correct?' ('+practice.correct+'/'+practice.total+' here)':'');
    const item=button(label,()=>open(unit.id,'understand',undefined,true),'u6-unit-button');
    item.dataset.u6Unit=unit.id;
    if(current.id===unit.id){item.classList.add('selected');item.setAttribute('aria-current','true');}
    chapter.append(item);
   }
   sidebar.append(el('p','Recommended order only. Browsing or local correctness never updates native mastery.','u6-small'));
  }
  function stepNavigation(step:Stage){
   const selected=STAGES.findIndex(([id])=>id===step);
   const next=STAGES[selected+1],previous=STAGES[selected-1];
   const row=el('div',undefined,'u6-stage-footer');
   if(previous)row.append(button('← '+previous[1],()=>open(current.id,previous[0],undefined,true)));
   if(next)row.append(button(next[1]+' →',()=>open(current.id,next[0],undefined,true),'primary-action compact-action'));
   else {
    const candidate=neighboringOriginalLessons(current.id).next;
    if(candidate)row.append(button('Continue to '+candidate.title+' →',()=>
     open(candidate.id,'understand',undefined,true),'primary-action compact-action'));
    else row.append(el('p','Final authored unit reached. This is not an official CEFR completion or mastery award.','u6-small'),
     button('Browse other lessons',()=>{
      discovery.open=true;indexDetails.open=true;search.focus({preventScroll:true});
     },'primary-action compact-action'));
    row.append(button('Practice native Review',()=>navigateSafely('review')));
   }
   return row;
  }
  function optionalGrammar(container:HTMLElement,id:string,mode:'course'|'write'){
    const details=el('details',undefined,'u39-context-tools');
    details.append(el('summary','Optional contextual grammar repair exercises'));
    const body=el('div',undefined,'u39-context-content');
    details.append(body);let mounted=false;
    details.addEventListener('toggle',()=>{
     if(!details.open||mounted||signal.aborted||!details.isConnected)return;
     mounted=true;appendU26GrammarPractice(body,id,mode);
    });
    container.append(details);
   }
   function renderUnderstand(unit:A1Unit,container:HTMLElement){
   container.append(el('p','Read each rule before trying the exercises. Examples and corrections are original teaching content.','u6-small'));
   for(const grammar of unit.grammar){
    const block=el('section',undefined,'u6-grammar-block');
    block.append(el('h4',grammar.heading),el('p',grammar.explanation));
    const examples=el('div',undefined,'u6-examples');
    for(const [french,english] of grammar.examples){
     const card=el('div',undefined,'u6-example');
     const fr=el('strong',french);fr.lang='fr';
     examples.append(card);card.append(fr,el('p',english));
    }
    block.append(examples);
    const [wrong,correct,why]=grammar.correction;
    const correction=el('div',undefined,'u6-worked-correction');
    correction.append(el('strong','Common mistake and correction'),
     el('s',wrong),el('p',correct),el('p',why));
    block.append(correction);container.append(block);
   }
   if(unit.grammarIds.length){
    const related=el('div',undefined,'u6-external-actions');
    related.append(el('p','Continue with the existing grammar reference:'));
    for(const grammarId of unit.grammarIds)related.append(button('Open '+grammarId.replaceAll('-',' ')+' guide',()=>{
     try{sessionStorage.setItem('french-u2-grammar-target',grammarId);}catch{}
     navigateSafely('grammar');
    }));
    container.append(related);
   }
  }
  function renderWords(unit:A1Unit,container:HTMLElement){
   const native=el('div',undefined,'u40-lesson-native');
   container.append(native);
   void import('./u40-native-panel').then(module=>{
    if(signal.aborted||!native.isConnected)return;
    void module.mountU40NativeLesson(native,unit.id,{
     signal,
     onReview:()=>navigateSafely('review'),
     onLearn:()=>navigateSafely('learn'),
     onWords:id=>{
      if(!allowExit())return;
      module.handoffU40Word(id);
      navigate('words');
     }
    });
   }).catch(error=>{
    if(!signal.aborted&&native.isConnected)native.textContent='Native lexical links unavailable. Original vocabulary below still works.';
    console.error('U40 lexical bridge unavailable',error);
   });
   appendOriginalVocabularyJourney(container,unit.id,{
    mode:'course',signal,
    onNativeReview:()=>navigateSafely('review'),
    onNativeLearn:()=>navigateSafely('learn'),
    onOpenCourse:id=>open(id,'words',undefined,true),
    onOpenSurface:(surface,id)=>{
     if(!allowExit())return;
     if(handoffOriginalLesson(surface,id))navigate(surface);
    }
   });
  }
  function renderDialogue(unit:A1Unit,container:HTMLElement){
   const translated=new Set([
    'transfer-91','transfer-92','transfer-93','transfer-106','transfer-107','transfer-108',
    'transfer-121','transfer-122','transfer-123','transfer-148','transfer-149','transfer-150'
   ]);
   const teachingSummary=unit.id.startsWith('transfer-')&&!translated.has(unit.id);
   const showText=teachingSummary?'Show English study note':'Show translation';
   const hideText=teachingSummary?'Hide English study note':'Hide translation';
   container.append(el('p',teachingSummary?
    'Read the complete French exchange first. These English study notes can summarize or explain rather than translate the wording. Do not quote them as a line-by-line translation.':
    'Read the complete French exchange first. Reveal translations only when needed, then return to the French without them.','u6-small'));
   for(const line of unit.dialogue){
    const row=el('div',undefined,'u6-dialogue-turn');
    const name=el('strong',line.speaker),fr=el('p',line.fr);
    fr.lang='fr';const english=el('p',line.en,'u6-gloss');english.hidden=true;
    const toggle=button(showText,()=>{
     english.hidden=!english.hidden;
     toggle.textContent=english.hidden?showText:hideText;
     toggle.setAttribute('aria-expanded',String(!english.hidden));
    });
    toggle.setAttribute('aria-expanded','false');
    row.append(name,fr,toggle,english);container.append(row);
   }
   const entry=getOriginalCatalogEntry(unit.id);
   const supplementary=el('details',undefined,'u39-context-tools');
   supplementary.append(el('summary','Optional connected reading and source analysis'));
   const advanced=el('div',undefined,'u39-context-content');
   supplementary.append(advanced);
   let mounted=false;
   supplementary.addEventListener('toggle',()=>{
    if(!supplementary.open||mounted||signal.aborted||!supplementary.isConnected)return;
    mounted=true;
    if(unit.id.startsWith('b1-')||unit.id.startsWith('transfer-'))appendOriginalB1Reading(advanced,unit);
    appendOriginalReadingJourney(advanced,unit.id,{
     mode:'course',signal,
     onOpenCourse:id=>open(id,'words',undefined,true),
     onOpenSurface:(surface,linkedId)=>{
      if(!allowExit())return;
      if(handoffOriginalLesson(surface,linkedId))navigate(surface);
     },
     onNativeReview:()=>navigateSafely('review')
    });
   });
   container.append(supplementary);
   if(entry?.reading)container.append(button('Continue this lesson in native Read →',()=>{
    if(allowExit()&&handoffOriginalLesson('read',unit.id))navigate('read');
   },'primary-action compact-action'));
   container.append(el('p','Next, listen to the original French dialogue without revealing the English support.','u6-small'));
  }
  function renderPractice(unit:A1Unit,container:HTMLElement){
   const record=answerMap(unit.id);
   const practicedCount=u22PracticeStatus(unit.id,record)!;
   const errors=mistakes.get(unit.id)??new Set<string>();
   container.append(el('p',practicedCount.correct+'/'+practicedCount.total+
    ' correct tasks during this temporary page visit. No FSRS or CEFR score is recorded.','u6-practice-status'));
   const nav=el('div',undefined,'u6-task-navigation');nav.setAttribute('role','group');nav.setAttribute('aria-label','Practice task navigation');
   unit.tasks.forEach((task,i)=>{
    const b=button(String(i+1)+(record.get(task.id)?' ✓':''),()=>{taskIndex=i;render();schedulePosition(current.id,stage,taskIndex);},'u6-task-button');
    b.setAttribute('aria-label','Open task '+(i+1));
    if(i===taskIndex){b.setAttribute('aria-current','step');b.classList.add('active');}
    nav.append(b);
   });
   container.append(nav);
   const task=unit.tasks[taskIndex],card=el('section',undefined,'u6-active-task');
   const kind=task.type==='reading'?'Reading comprehension':task.type==='order'?'Sentence order':
    task.type==='choice'?'Choose in context':'Complete the French';
   card.append(el('p','Question '+(taskIndex+1)+' of '+unit.tasks.length+' · '+kind,'eyebrow'),
    el('h4',task.prompt));
   const form=el('form',undefined,'u6-answer-form');
   let getAnswer:()=>string=()=>'',reset:()=>void=()=>{};
   if(task.type==='choice'||task.type==='reading'){
    const select=el('select');select.setAttribute('aria-label','Answer question '+(taskIndex+1));
    const empty=el('option','Choose an answer');empty.value='';select.append(empty);
    for(const option of task.options){const row=el('option',option);row.value=option;select.append(row);}
    form.append(select);getAnswer=()=>select.value;reset=()=>{select.value='';};
   }else if(task.type==='order'){
    const words=el('div',undefined,'u6-order-words');
    const assembled=el('p','Your sentence: —','u6-assembled');assembled.setAttribute('role','status');
    const picked:string[]=[];const available:HTMLButtonElement[]=[];
    for(const token of task.options){
     const tokenButton=button(token,()=>{
      picked.push(token);tokenButton.disabled=true;
      assembled.textContent='Your sentence: '+picked.join(' ');
     },'u6-word-token');
     available.push(tokenButton);words.append(tokenButton);
    }
    const erase=button('Reset word order',()=>{
     picked.length=0;available.forEach(b=>{b.disabled=false;});assembled.textContent='Your sentence: —';
    });
    form.append(words,assembled,erase);getAnswer=()=>picked.join(' ');
    reset=()=>erase.click();
   }else{
    const input=el('input');input.type='text';input.lang='fr';input.autocomplete='off';input.maxLength=140;
    input.setAttribute('aria-label','Answer question '+(taskIndex+1));
    form.append(input);getAnswer=()=>input.value;reset=()=>{input.value='';};
   }
   const result=el('p','','u6-answer-feedback');result.setAttribute('role','status');
   const help=el('div',undefined,'u6-answer-help');
   const submit=el('button','Check answer','primary-action compact-action');submit.type='submit';
   form.addEventListener('submit',event=>{
    event.preventDefault();
    const value=getAnswer().trim();
    if(!value){result.textContent='Enter or select an answer before checking.';return;}
    const passed=checkPracticeAnswer(value,task.answer);
    if(passed){
     record.set(task.id,true);
     result.textContent='Correct. '+task.explanation;
     help.replaceChildren();
    }else{
     errors.add(task.focus);mistakes.set(unit.id,errors);
     const authoredMistake=task.misconceptionFeedback?.[value];
     result.textContent=authoredMistake?
      'Not yet. '+authoredMistake+' '+task.explanation+' Try again.':
      'Not yet. '+task.explanation+' Revisit the '+task.focus+' point, then try again.';
     help.replaceChildren(button('Review lesson explanation',()=>open(unit.id,'understand')));
    }
    // Refresh counters and side navigation without removing typed answer or feedback.
    renderIndex();
    const label=nav.querySelector<HTMLButtonElement>('button:nth-child('+(taskIndex+1)+')');
    if(label&&passed)label.textContent=String(taskIndex+1)+' ✓';
    container.querySelector<HTMLElement>('.u6-practice-status')!.textContent=
     u22PracticeStatus(unit.id,record)!.correct+'/'+unit.tasks.length+
     ' correct tasks this visit · ungraded and not saved.';
   });
   const reveal=button('Show worked answer (assisted)',()=>{
    help.replaceChildren(el('p','Model answer: '+task.answer+'. '+task.explanation));
   });
   const next=button(taskIndex===unit.tasks.length-1?'Return to first question':'Next question →',()=>{
    taskIndex=(taskIndex+1)%unit.tasks.length;render();schedulePosition(current.id,stage,taskIndex);
   });
   form.append(submit,reveal,result,help,next);card.append(form);container.append(card);
   if(errors.size)container.append(el('p','Recommended review topics from your attempts: '+[...errors].join(', ')+'.','u6-recommendation'));
   const resetAll=button('Clear this lesson’s temporary answers',()=>{
    answers.delete(unit.id);mistakes.delete(unit.id);taskIndex=0;reset();render();
   });
   container.append(resetAll);
  }
  function renderWrite(unit:A1Unit,container:HTMLElement){
   const variants=u22ProductionChoices(unit.id);
   let onWritingModeChanged=()=>{};
   let mode:'fromSources'|'fromListening'|'fromDebate'='fromSources';
   const chosen=()=>variants?(variants[mode]??variants.fromSources):unit.writing;
   const draftKey=()=>variants?unit.id+'::'+mode:unit.id;
   const heading=el('h4','Independent writing');
   const prompt=el('p',chosen().prompt,'u14-production-prompt');
   const items=el('ul',undefined,'u6-write-criteria');
   const editor=el('textarea');editor.rows=8;editor.lang='fr';editor.maxLength=3500;
   editor.setAttribute('aria-label','Independent original French writing response');
   const result=el('p','Your text remains in memory only until this Course view closes.','u6-small');
   const model=el('blockquote',chosen().model,'u6-model');model.lang='fr';model.hidden=true;
   const compare=button('Reveal original sample answer',()=>{
    model.hidden=!model.hidden;
    compare.textContent=model.hidden?'Reveal original sample answer':'Hide sample answer';
    compare.setAttribute('aria-expanded',String(!model.hidden));
   });
   compare.setAttribute('aria-expanded','false');
   const updatePrompt=()=>{
    const choice=chosen();
    prompt.textContent=choice.prompt;
    items.replaceChildren();
    for(const criterion of choice.criteria)items.append(el('li',criterion));
    editor.value=drafts.get(draftKey())??'';
    model.textContent=choice.model;model.hidden=true;
    compare.textContent='Reveal original sample answer';compare.setAttribute('aria-expanded','false');
    result.textContent='Your text stays in this Course page memory only. The selected task is not graded or uploaded.';
    onWritingModeChanged();
   };
   if(variants){
    const options=el('div',undefined,'u14-writing-mode');
    const label=el('label','Choose an independent communication task');
    const select=el('select');
    select.setAttribute('aria-label','Choose evidence-to-writing transfer mode');
    const source=el('option','Compare two source documents');source.value='fromSources';
    const listening=el('option','Listen and write a neutral summary');listening.value='fromListening';
    select.append(source,listening);
    if(variants.fromDebate){const argument=el('option','Make a reasoned recommendation and address a counterargument');argument.value='fromDebate';select.append(argument);}
    select.addEventListener('change',()=>{
     mode=select.value==='fromListening'?'fromListening':select.value==='fromDebate'&&variants.fromDebate?'fromDebate':'fromSources';
     updatePrompt();
    });
    label.append(select);
    const revisit=button('Review supporting sources',()=>{
     open(unit.id,mode==='fromListening'?'listen':'dialogue');
    });
    options.append(label,el('p','Choose original source synthesis, dialogue-to-writing, or—where available—an independent argument with an explicit counterpoint. Each has a distinct prompt, rubric and model; no proficiency is automatically graded.','u6-small'),revisit);
    container.append(options);
   }
   editor.addEventListener('input',()=>drafts.set(draftKey(),editor.value));
   const check=button('Check structure (not grammar grading)',()=>{
    result.textContent=inspectDraftStructure(editor.value).join(' ')+
     ' Meaning, grammar and source fidelity require your own comparison; no automatic grade is awarded.';
   });
   const clear=button('Clear selected writing draft',()=>{
    editor.value='';drafts.delete(draftKey());
    result.textContent='Only the currently selected temporary draft was cleared. No account data changed.';
   });
   container.append(heading,prompt,items,editor,check,compare,clear,result,model,
    el('p','Review your answer against the source and dialogue. Writing remains independent and session-only.','u6-small'));
   const revisionPrompts=U22_REVISION_GUIDES[unit.id]??U21_REVISION_GUIDES[unit.id]??U20_REVISION_GUIDES[unit.id];
   if(revisionPrompts){
    const studio=el('section',undefined,'u20-revision-studio');
    studio.append(el('h4','Revise your argument · ungraded'));
    const instructions=el('p','Write independently first. Capture a version, revise it, then compare both versions yourself. No automatic claim of grammar, source correctness or level is made.','u6-small');
    const questions=el('ol');
    for(const item of revisionPrompts)questions.append(el('li',item));
    const comparison=el('div',undefined,'u20-revision-comparison');
    comparison.setAttribute('role','status');
    onWritingModeChanged=()=>{
     comparison.replaceChildren(el('p','Select a writing mode and capture an initial draft to compare revisions in this visit.','u6-small'));
    };
    const capture=button('Capture this draft as the earlier version',()=>{
     if(!editor.value.trim()){comparison.textContent='Write a draft before capturing a version.';return;}
     revisionSnapshots.set(draftKey(),editor.value);
     comparison.textContent='Earlier version captured in this page visit. Revise the text above, then compare.';
    });
    const show=button('Compare revised draft with captured version',()=>{
     const before=revisionSnapshots.get(draftKey());
     if(!before){comparison.textContent='Capture an earlier version of this writing mode first.';return;}
     comparison.replaceChildren();
     const columns=el('div',undefined,'u20-revision-columns');
     const old=el('div'),newDraft=el('div');
     old.append(el('h5','Earlier version'),el('p',before,'u20-revision-copy'));
     newDraft.append(el('h5','Current version'),el('p',editor.value||'(empty draft)','u20-revision-copy'));
     columns.append(old,newDraft);
     comparison.append(columns,el('p','Review changed claims, source attribution, counterargument and conditional language. Only you decide whether the revision is accurate.','u6-small'));
    });
    const discard=button('Discard captured version',()=>{
     revisionSnapshots.delete(draftKey());
     comparison.textContent='Only the earlier temporary snapshot for this selected writing mode was discarded.';
    });
    const actions=el('div',undefined,'u20-revision-actions');actions.append(capture,show,discard);
    studio.append(instructions,questions,actions,comparison);
    container.append(studio);
    onWritingModeChanged();
   }
   updatePrompt();
  }
  function render(){
   if(signal.aborted)return;
   article.replaceChildren();
   lessonSelect.value=current.id;
   const currentLevel=getOriginalCatalogEntry(current.id)?.level;
   updateSixLevelList();
   lessonSelect.hidden=false;
   const head=el('header',undefined,'u6-unit-header');
   const lessonKind=current.id.startsWith('transfer-')?'TRANSFER SCENARIO':'LESSON';
   const lessonNumber=current.id.startsWith('transfer-')?current.id.slice(9):current.id.slice(3);
   head.append(el('p',(getOriginalCatalogEntry(current.id)?.level??'Original')+
    ' · '+lessonKind+' '+lessonNumber+' · ABOUT '+current.minutes+' MINUTES','eyebrow'),
    el('h3',current.title),el('p',current.goal));
   const pre=el('p',current.prerequisites.length?
    'Suggested foundation: '+(getOriginalUnit(current.prerequisites[0])?.title??current.prerequisites[0])+'. The lesson is not locked.':
    'Start here: no prior lesson is required.','u6-small');
   const lessonReferences=el('details',undefined,'course-lesson-references');
   lessonReferences.append(el('summary','References'),pre);
   const entryLevel=getOriginalCatalogEntry(current.id);
   if(entryLevel?.foundationBand){
    lessonReferences.append(el('p','B1 integrated reading and response · grammar focus: '+
     entryLevel.foundationBand+'. Earlier grammar forms are review, not a CEFR proficiency result.','u6-small'));
   }
   const refreshers=originalPlacementGrammarRefreshers(current.id);
   if(refreshers.length){
    const details=el('details',undefined,'u27-foundations');
    details.append(el('summary','Optional earlier grammar refreshers ('+refreshers.length+')'),
     el('p','Topic-linked original lessons; these are not mandatory authorial prerequisites or proof of prior mastery.','u6-small'));
    const targets=el('div',undefined,'u27-foundation-list');
    for(const item of refreshers){
     const go=button(item.level+' · '+item.title,()=>open(item.id,'understand',undefined,true));
     go.title='Original source '+item.qualifiedId+'; opening does not imply any CEFR result.';
     targets.append(go);
    }
    details.append(targets);lessonReferences.append(details);
   }
   const foundations=originalPlacementPrerequisites(current.id,3);
   if(foundations.length){
    const details=el('details',undefined,'u27-foundations');
    details.append(el('summary','Review '+foundations.length+' suggested foundation'+(foundations.length===1?'':'s')+' · optional'));
    const list=el('div',undefined,'u27-foundation-list');
    for(const p of foundations){
     const item=button(p.level+' · '+p.title,()=>open(p.id,'understand',undefined,true));
     item.title='Original source '+p.qualifiedId+'; opening a foundation does not mark any lesson complete.';
     list.append(item);
    }
    details.append(el('p','Original author-listed prerequisites, not a pass requirement or a verified assessment.','u6-small'),list);
    lessonReferences.append(details);
   }
   const cross=el('nav',undefined,'u23-course-handoffs');
   cross.setAttribute('aria-label','Open this lesson in another workspace');
   const entry=getOriginalCatalogEntry(current.id);
   if(entry){
    for(const [dest,title,available] of [
     ['read','Open Read',entry.reading],['listen','Open Listen',entry.listening],
     ['write','Open Write',entry.writing]
    ] as const){
     if(!available)continue;
     cross.append(button(title,()=>{
      if(!allowExit())return;
      if(handoffOriginalLesson(dest,current.id))navigate(dest);
     }));
    }
   }
   const neighbors=neighboringOriginalLessons(current.id);
   if(neighbors.previous)cross.append(button('← Previous lesson',()=>open(neighbors.previous!.id,'understand',undefined,true)));
   if(neighbors.next)cross.append(button('Next lesson →',()=>open(neighbors.next!.id,'understand',undefined,true)));
   lessonReferences.append(cross);head.append(lessonReferences);article.append(head);
   const stageNav=el('div',undefined,'u6-stage-nav');stageNav.setAttribute('role','group');stageNav.setAttribute('aria-label','Lesson learning stages');
   for(const [id,title] of STAGES){
    const tab=button(title,()=>open(current.id,id,undefined,true),'u6-stage-button');
    if(stage===id){tab.classList.add('active');tab.setAttribute('aria-current','step');}
    stageNav.append(tab);
   }
   article.append(stageNav);
   const content=el('div',undefined,'u6-stage-body');content.dataset.u6Stage=stage;
   switch(stage){
    case 'understand':renderUnderstand(current,content);optionalGrammar(content,current.id,'course');break;
    case 'words':renderWords(current,content);break;
    case 'dialogue':renderDialogue(current,content);break;
    case 'listen':{
     const stopEarlier=mountA1Listening(content,current,signal);
     let stopOral:()=>void=()=>{},oralMounted=false;
     const extra=el('details',undefined,'u39-context-tools');
     extra.append(el('summary','Optional speaking, debate and advanced source practice'));
     const oralHost=el('div',undefined,'u39-context-content');extra.append(oralHost);
     extra.addEventListener('toggle',()=>{
      if(!extra.open||oralMounted||signal.aborted||!extra.isConnected)return;
      oralMounted=true;
      stopOral=appendOriginalOralJourney(oralHost,current.id,{
       mode:'course',signal,parentHandlesDraftExit:true,
       onOpenSurface:(surface,id)=>{
        if(!allowExit())return;
        if(surface==='course')open(id,'listen',undefined,true);
        else if(handoffOriginalLesson(surface,id))navigate(surface);
       },
       onNativeReview:()=>navigateSafely('review')
      });
     });
     content.append(extra,button('Open separate dictation practice →',()=>{
      if(allowExit()&&handoffOriginalLesson('listen',current.id))navigate('listen');
     }));
     stopAudio=()=>{stopEarlier();stopOral();};
     break;
    }
    case 'practice':renderPractice(current,content);optionalGrammar(content,current.id,'course');break;
    case 'write':renderWrite(current,content);optionalGrammar(content,current.id,'write');break;
   }
   article.append(content,stepNavigation(stage));
   const trace=el('p','Source: '+current.source.qualifiedId+
    ' · original-owned. Course exercise results are temporary, not native FSRS/CEFR grades.','u6-provenance');
   article.append(trace);
  }
  function open(id:string,next:Stage,resumeIndex?:number,focus=false){
   const lesson=getOriginalUnit(id);if(!lesson)return;
   if((id!==current.id||next!==stage)&&
      (host.querySelector<HTMLTextAreaElement>('.u28-writing textarea')?.value.trim()||
       host.querySelector<HTMLTextAreaElement>('.u29-summary-label textarea')?.value.trim()||
       host.querySelector<HTMLTextAreaElement>('.u30-interpretation textarea')?.value.trim()||
       host.querySelector<HTMLElement>('.u31-oral[data-has-private-draft="true"]'))&&
      !window.confirm('Your temporary vocabulary or reading summary draft is unsent. Leave this learning stage and discard its text?'))return;
   stopAudio?.();stopAudio=null;
   if(id!==current.id)taskIndex=0;
   if(resumeIndex!==undefined)taskIndex=Math.min(Math.max(0,resumeIndex),lesson.tasks.length-1);
   current=lesson;stage=next;
   selectedCourseLevel=navLevelForOriginalBand(getOriginalCatalogEntry(id)?.level??'A1');
   window.history.replaceState(window.history.state,'',frenchCourseLocation(selectedCourseLevel,id));
   // Browsing is a temporary selector, not an extra destination after tapping a lesson.
   if(indexDetails.open)indexDetails.open=false;
   renderIndex();render();renderLearningEntry();schedulePosition(current.id,stage,taskIndex);
   if(focus)focusCourseLesson();
  }
  sidebar.addEventListener('keydown',event=>{
   if(!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
   const buttons=[...sidebar.querySelectorAll<HTMLButtonElement>('[data-u6-unit]')].filter(item=>{
    const group=item.closest('details');return !group||group.open;
   });
   const at=buttons.indexOf(document.activeElement as HTMLButtonElement);
   if(at<0)return;
   event.preventDefault();
   const selected=event.key==='Home'?0:event.key==='End'?buttons.length-1:
    (at+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
   const chosen=getOriginalUnit(buttons[selected]?.dataset.u6Unit??'');
   if(chosen){open(chosen.id,'understand');
    sidebar.querySelector<HTMLButtonElement>('[data-u6-unit="'+chosen.id+'"]')?.focus();}
  });
  const beforeUnload=(event:BeforeUnloadEvent)=>{
   if(!hasPrivateDrafts())return;
   event.preventDefault();event.returnValue='';
  };
  window.addEventListener('beforeunload',beforeUnload);
  signal.addEventListener('abort',()=>{
   stopAudio?.();window.removeEventListener('beforeunload',beforeUnload);
  },{once:true});
  levelFilter.value=getOriginalCatalogEntry(current.id)?.level??'all';
  open(current.id,stage);
  if(requestedCourse&&!requestedCourse.id)selectCourseLevel(requestedCourse.level);
 }catch(error){
  if(signal.aborted)return;
  host.replaceChildren(el('p','Original French lessons unavailable. Existing native Learn and Review remain unaffected.'));
  console.error('U6 original A1 course could not be loaded',error);
 }
}
