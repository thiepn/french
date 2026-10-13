import {
 originalIntegratedReading,compareReadingChoice,originalReadingCorrection,
 type OriginalReadingDecision,type OriginalReadingDecisionKind
} from '../core/unified/u29-reading.ts';
import {getOriginalCatalogEntry,type OriginalSurface} from '../core/unified/u23-registry.ts';
import './u29-reading-panel.css';

type Mode='course'|'read';
interface Options{
 readonly mode:Mode;
 readonly signal:AbortSignal;
 readonly onOpenCourse?:(id:string)=>void;
 readonly onOpenSurface?:(surface:Exclude<OriginalSurface,'course'>,id:string)=>void;
 readonly onNativeReview?:()=>void;
}
const KIND:readonly [OriginalReadingDecisionKind,string][]=[
 ['locate','Locate evidence'],['meaning','Vocabulary in context'],
 ['inference','Interpret and infer'],['reference','Resolve references'],
 ['source','Compare documents']
];
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',cls=''):HTMLElementTagNameMap[K]{
 const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;
}
function button(text:string,fn:()=>void,cls='secondary-action compact-action'):HTMLButtonElement{
 const n=el('button',text,cls);n.type='button';n.addEventListener('click',fn);return n;
}
/** Interactive source reader supplements original U10/U22 reading rather than replacing its keyed questions. */
export function appendOriginalReadingJourney(host:HTMLElement,id:string,opts:Options):void{
 const reading=originalIntegratedReading(id),entry=getOriginalCatalogEntry(id);
 if(!reading||!entry||!reading.decisions.length)return;
 const root=el('section','','u29-reader');
 root.setAttribute('aria-label','Original evidence-based reading and lexical transfer');
 const disclosure=el('details','','u29-reader-disclosure');
 disclosure.open=opts.mode==='read';
 disclosure.append(el('summary','Reading evidence lab · '+reading.decisions.length+' source-linked decisions'));
 const body=el('div','','u29-reader-body');
 disclosure.append(body);root.append(disclosure);host.append(root);
 const heading=el('h3','Read, locate and explain');
 const description=el('p','Practice locating genuine original evidence, assigning claims to their actual source, and distinguishing lexical meanings. Source text and answer keys remain original-owned. No grades or CEFR credit are recorded.','u29-note');
 const category=el('div','','u29-kind-tabs');
 category.setAttribute('role','group');category.setAttribute('aria-label','Reading decision kind');
 const article=el('details','','u29-original-source');
 article.append(el('summary','Open numbered original reading and attributed documents'));
 const sourceBody=el('div','','u29-documents');
 reading.paragraphs.forEach((p,i)=>{
  const block=el('article','','u29-paragraph');block.id='u29-'+id+'-p-'+(i+1);
  block.append(el('h4',(opts.mode==='read'?'Paragraph ':'Text segment ')+(i+1)));
  const text=el('p',p,'u29-fr');text.lang='fr';block.append(text);sourceBody.append(block);
 });
 reading.documents.forEach((doc,i)=>{
  const card=el('article','','u29-document');
  card.append(el('h4','Document '+(i+1)+' · '+doc.label+' ('+doc.type+')'));
  const text=el('p',doc.text,'u29-fr');text.lang='fr';card.append(text);sourceBody.append(card);
 });
 article.append(sourceBody);
 const questionPane=el('div','','u29-question-content');
 const actionBar=el('div','','u29-activity-actions');
 const transfer=el('section','','u29-transfer');
 const live=el('p','','u29-live');live.setAttribute('role','status');
 body.append(heading,description,category,article,questionPane,actionBar,transfer,live);
 const decisions=reading.decisions;
 const answered=new Map<string,{answer:string;matched:boolean}>();
 let categoryValue:OriginalReadingDecisionKind=decisions[0].kind,index=0;
 let draftInput:HTMLTextAreaElement|null=null;
 const hasDraft=()=>!!draftInput?.value.trim();
 const allowExit=()=>!hasDraft()||window.confirm(
  'This original summary draft is temporary and not saved. Discard it before leaving this reading activity?'
 );
 const eligible=()=>decisions.filter(d=>d.kind===categoryValue);
 const drawCategories=()=>{
  category.replaceChildren();
  for(const [kind,label] of KIND){
   const pool=decisions.filter(q=>q.kind===kind);
   if(!pool.length)continue;
   const b=button(label+' · '+pool.length,()=>{
    categoryValue=kind;index=0;draw();
   },'u29-kind');
   if(categoryValue===kind){b.setAttribute('aria-pressed','true');b.classList.add('is-active');}
   else b.setAttribute('aria-pressed','false');
   category.append(b);
  }
 };
 const drawTransfer=()=>{
  transfer.replaceChildren();
  const details=el('details','','u29-synthesis');
  details.append(el('summary','Independent summary, spoken explanation and connected transfer'));
  const section=el('div','','u29-transfer-body');
  section.append(el('h4','Create your own reading synthesis'),
   el('p','Using only the original reading, write a concise French summary (4–7 sentences): identify two observations, distinguish a stated proposal or inference, and identify one limitation. Cite the particular paragraph or independent document rather than inventing support.','u29-note'));
  const criteria=el('ul','','u29-criteria');
  for(const criterion of [
   'My summary identifies who made each consequential claim.',
   'At least one claim is supported by the right paragraph or named document.',
   'Observed facts, opinions, proposals and uncertainties remain distinct.',
   'I used an original contextual expression without changing its meaning.',
   'I have not treated a source allegation, forecast or model as proof.'
  ])criteria.append(el('li',criterion));
  section.append(criteria);
  const label=el('label','Temporary independent French summary','u29-summary-label');
  const editor=el('textarea');editor.rows=6;editor.maxLength=4500;editor.lang='fr';
  editor.spellcheck=true;editor.placeholder='Écrivez votre résumé…';
  editor.setAttribute('aria-label','Independent original-source reading summary');
  draftInput=editor;label.append(editor);section.append(label);
  const hints=el('details','','u29-summary-hints');
  hints.append(el('summary','Optional summary plan and source reminders'),
   el('p','1. Introduce the situation using the original reading title. 2. State a witnessed fact with a paragraph reference. 3. Describe a different view or constraint. 4. Explain what still cannot be concluded. 5. End with a provisional next step, if supported.','u29-note'));
  section.append(hints);
  section.append(el('p','For speaking: explain the distinction between an observation and an inference aloud without reading your summary. Pronunciation is not recorded, recognized or graded.','u29-note'));
  const tools=el('div','','u29-activity-actions');
  const read=button('Show original text above',()=>{
   article.open=true;article.scrollIntoView({block:'start'});
   article.querySelector<HTMLElement>('summary')?.focus({preventScroll:true});
  });
  tools.append(read);
  if(opts.onOpenSurface&&entry.listening)tools.append(button('Listen to original dialogue',()=>{
   opts.onOpenSurface?.('listen',id);
  }));
  if(opts.onOpenSurface&&entry.writing)tools.append(button('Continue in independent Write',()=>{
   opts.onOpenSurface?.('write',id);
  }));
  if(opts.onOpenCourse)tools.append(button('Review source vocabulary in Course',()=>{
   opts.onOpenCourse?.(id);
  }));
  if(opts.onNativeReview)tools.append(button('Go to native scheduled Review',()=>{
   opts.onNativeReview?.();
  }));
  section.append(tools,el('p','Only you can decide whether the summary is accurate. No automatic scoring, upload, draft persistence or native mastery update is performed.','u29-note'));
  details.append(section);transfer.append(details);
 };
 const draw=()=>{
  if(opts.signal.aborted)return;
  questionPane.replaceChildren();actionBar.replaceChildren();
  const pool=eligible(),task=pool[index];
  if(!task)return;
  const wrap=el('article','','u29-decision');
  wrap.append(el('p','Independent question '+(index+1)+' of '+pool.length+
   ' · '+task.kind+' · '+reading.level,'u29-eyebrow'),
   el('h4',task.question));
  const source=el('p','Qualified source: '+reading.qualifiedId+' · '+task.sourceLabel,'u29-source-label');
  wrap.append(source);
  const phrase=el('p','','u29-evidence');phrase.hidden=task.kind==='inference'||task.kind==='reference';
  phrase.textContent=task.evidence;
  phrase.lang='fr';
  if(!phrase.hidden)wrap.append(el('p','Verbatim source evidence to locate or interpret:','u29-note'),phrase);
  const form=el('form','','u29-form');
  const label=el('label','Choose the best authored source-supported answer','u29-answer-label');
  const select=el('select');select.setAttribute('aria-label','Answer source reading question');
  const start=el('option','Choose an answer');start.value='';select.append(start);
  for(const option of task.options){const row=el('option',option);row.value=option;select.append(row);}
  const previous=answered.get(task.id);
  if(previous)select.value=previous.answer;
  label.append(select);
  const feedback=el('p','','u29-feedback');feedback.setAttribute('role','status');
  if(previous)feedback.textContent=(previous.matched?'Matches the authored answer. ':originalReadingCorrection(task,previous.answer)+' ')+
   (previous.matched?task.explanation:'');
  const hint=el('p',task.hint,'u29-hint');hint.hidden=true;
  const evidence=el('p','Source excerpt: '+task.evidence,'u29-evidence');evidence.lang='fr';evidence.hidden=true;
  const revealHint=button('Hint for locating evidence',()=>{
   hint.hidden=!hint.hidden;revealHint.setAttribute('aria-expanded',String(!hint.hidden));
  });revealHint.setAttribute('aria-expanded','false');
  const reveal=button('Reveal anchored excerpt',()=>{
   evidence.hidden=!evidence.hidden;reveal.setAttribute('aria-expanded',String(!evidence.hidden));
  });reveal.setAttribute('aria-expanded','false');
  const check=el('button','Compare with authored answer','primary-action compact-action');check.type='submit';
  form.addEventListener('submit',e=>{
   e.preventDefault();if(!select.value){feedback.textContent='Choose a response or inspect the source.';return;}
   const ok=compareReadingChoice(select.value,task.answer);
   answered.set(task.id,{answer:select.value,matched:ok});
   feedback.textContent=ok?
    'Matches this original evidence key. '+task.explanation:
    originalReadingCorrection(task,select.value);
   live.textContent=answered.size+' distinct authored questions compared in this temporary session. No native review records were written.';
  });
  select.addEventListener('change',()=>{feedback.textContent='Response changed. Compare again to receive source-specific feedback.';});
  const controls=el('div','','u29-activity-actions');
  controls.append(check,revealHint,reveal);
  form.append(label,controls,feedback,hint,evidence);
  wrap.append(form);questionPane.append(wrap);
  actionBar.append(button('← Previous decision',()=>{index=Math.max(0,index-1);draw();}));
  const next=pool[index+1];
  if(next)actionBar.append(button('Next decision →',()=>{index++;draw();},'primary-action compact-action'));
  else actionBar.append(button('Independent summary and transfer →',()=>{
   const details=transfer.querySelector<HTMLDetailsElement>('details');
   if(details){details.open=true;details.scrollIntoView({block:'start'});}
  },'primary-action compact-action'));
  if(task.kind==='locate')actionBar.append(button('Show original numbered paragraphs',()=>{
   article.open=true;article.scrollIntoView({block:'start'});
  }));
 };
 const revalidate=()=>{
  if(opts.signal.aborted)return;
  drawCategories();draw();
 };
 revalidate();drawTransfer();
 opts.signal.addEventListener('abort',()=>{answered.clear();draftInput=null;},{once:true});
}
