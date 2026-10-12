import type {RouteContext} from '../core/types';
import {loadVocabularySearchIndex,type VocabularySearchRow} from '../core/content/loader';
import {normalizeFrenchSurface} from '../core/unified/crosswalk';
import {ORIGINAL_SENSES,makeReviewReport,buildReviewExport,type CandidateDecision} from '../core/unified/u2-review';
import {nativeQualifiedLexemeId} from '../core/unified/u3-native-id';
import {inspectReviewExport,type ReviewPreview} from '../core/unified/u3-review-import';
import './unified.css';
import './unified-u2.css';

function node<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string):HTMLElementTagNameMap[K]{
 const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;
}
export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
 main.innerHTML=`<section class="page unified-page">
  <p class="eyebrow">Unified learning · original/native mapping</p><h1>Sense links</h1>
  <p class="lede">Compare original U2 vocabulary with the existing native French index. Exact spellings are suggestions, never proof of equivalent senses. Review decisions remain in memory and can be exported as a draft, not imported into learner progress.</p>
  <div class="unified-alert" role="note">No automatic approval · no legacy textbook glosses · no write to SRS, FSRS, CEFR, Account, migration or native vocabulary records.</div>
  <div class="unified-tools"><button data-back class="secondary-action compact-action">Back to Course</button>
  <button data-export class="secondary-action compact-action" disabled>Export review draft</button>
  <button data-reset class="secondary-action compact-action">Clear draft decisions</button></div>
  <p class="unified-result" data-status role="status" aria-live="polite">Loading verified native vocabulary index on demand…</p>
  <div class="u2-review-summary" data-counts></div>
  <section class="u3-review-import" aria-labelledby="u3-import-title">
    <h2 id="u3-import-title">Reopen an exported review draft</h2>
    <p>Inspect one local JSON file. Invalid, stale or forged proposals are blocked atomically. No progress or account import is available.</p>
    <label>Choose review JSON <input data-import-file type="file" accept=".json,application/json"></label>
    <p data-import-status role="status">No review file selected.</p>
    <div data-import-queue></div>
    <div class="u3-import-actions">
      <button type="button" data-keep-pending class="secondary-action compact-action" disabled>Keep selected as local draft</button>
      <button type="button" data-dismiss-pending class="secondary-action compact-action" disabled>Discard selected proposal</button>
    </div>
  </section>
  <div class="u2-review-layout">
    <section class="u2-review-card"><h2>Original U2 senses</h2>
      <label>Filter terms<input data-search type="search" placeholder="Search French or English" autocomplete="off"></label>
      <div class="u2-review-list" data-list></div></section>
    <section class="u2-review-card"><h2>Manual review</h2><div data-detail aria-live="polite">Select an original sense.</div></section>
  </div>
 </section>`;
 main.querySelector('[data-back]')?.addEventListener('click',()=>navigate('course'));
 const status=main.querySelector<HTMLElement>('[data-status]')!;
 const list=main.querySelector<HTMLElement>('[data-list]')!;
 const detail=main.querySelector<HTMLElement>('[data-detail]')!;
 const counts=main.querySelector<HTMLElement>('[data-counts]')!;
 const search=main.querySelector<HTMLInputElement>('[data-search]')!;
 const exportButton=main.querySelector<HTMLButtonElement>('[data-export]')!;
 const decisions=new Map<string,CandidateDecision>();
 let chosen=ORIGINAL_SENSES[0]?.sourceId??'';
 let nativeRows:VocabularySearchRow[]=[];
 let revision:string|null=null;
 let report=makeReviewReport([],null);
 const byForm=new Map<string,VocabularySearchRow[]>();
 function matches(form:string):VocabularySearchRow[]{
  return byForm.get(normalizeFrenchSurface(form))??[];
 }
 const paintCounts=()=>{
  counts.textContent=ORIGINAL_SENSES.length+' authored senses · '+
   report.totals.ambiguous+' ambiguous · '+report.totals.unmatched+' unmatched · '+
   report.totals.insufficientSense+' lacking sense evidence · '+decisions.size+' reviewed drafts.';
  exportButton.disabled=decisions.size===0;
 };
 function paintDetail(){
  const item=ORIGINAL_SENSES.find(row=>row.sourceId===chosen);
  if(!item)return;
  detail.replaceChildren();
  const heading=node('h3',item.form),gloss=node('p','Original English gloss: '+item.gloss);
  const usage=node('p','Original lessons: '+item.lessonIds.join(', '));
  const identity=node('code',item.sourceId);
  detail.append(heading,gloss,usage,identity);
  const candidates=matches(item.form);
  const origin=node('p',candidates.length+' exact-form native candidate(s). Differences in usage, grammar, register or meaning may remain.');
  detail.append(origin);
  const current=decisions.get(chosen);
  const selection=node('label','Native candidate');
  const select=node('select');select.setAttribute('aria-label','Native candidate');
  const none=node('option','No candidate selected');none.value='';select.append(none);
  for(const candidate of candidates){
   const option=node('option',candidate.word+' · '+candidate.meaning+' · '+(candidate.pos||'POS unknown'));
   try{option.value=nativeQualifiedLexemeId(candidate.id);select.append(option);}
   catch{continue;} // Unsupported oversized native IDs cannot receive link authority.
  }
  select.value=current?.targetId??'';
  selection.append(select);detail.append(selection);
  const decision=node('label','Draft status');
  const statusPicker=node('select');statusPicker.setAttribute('aria-label','Draft status');
  for(const [key,value] of [
   ['needs-evidence','Needs more evidence'],['proposed-match','Propose a sense match (not approved)'],['rejected','Reject this candidate']
  ]){
   const option=node('option',value);option.value=key;statusPicker.append(option);
  }
  statusPicker.value=current?.status??'needs-evidence';
  decision.append(statusPicker);detail.append(decision);
  const notes=node('label','Evidence and rationale (required for proposed matches)');
  const area=node('textarea');area.rows=4;area.maxLength=600;
  area.setAttribute('aria-label','Evidence and rationale');
  area.placeholder='Compare the meaning in a full sentence; record uncertainty.';
  area.value=current?.note??'';notes.append(area);detail.append(notes);
  const feedback=node('p','No decision recorded.');feedback.className='u2-feedback';feedback.setAttribute('role','status');
  const save=node('button','Save draft decision');save.type='button';save.className='primary-action compact-action';
  save.addEventListener('click',()=>{
   const proposed=statusPicker.value==='proposed-match';
   if(proposed&&(!select.value||!area.value.trim())){
    feedback.textContent='Proposed matches require one selected candidate and written evidence.';return;
   }
   if(area.value.length>600){feedback.textContent='Limit evidence to 600 characters.';return;}
   const statusValue=statusPicker.value as CandidateDecision['status'];
   decisions.set(chosen,{sourceId:chosen,targetId:select.value||null,status:statusValue,note:area.value.trim()});
   feedback.textContent='Saved as local, unapproved draft only. Nothing was added to mastery.';
   paintCounts();paintList();
  });
  detail.append(save,feedback);
  if(candidates.length>1)detail.append(node('p','Ambiguity: multiple native rows share this spelling. Select one only after checking the full meaning.'));
  if(!candidates.length)detail.append(node('p','No exact-form candidate. You can document a gap, but cannot propose a link.'));
 }
 function paintList(){
  list.replaceChildren();
  const q=normalizeFrenchSurface(search.value);
  const filtered=ORIGINAL_SENSES.filter(item=>!q||normalizeFrenchSurface(item.form+' '+item.gloss).includes(q));
  for(const item of filtered){
   const button=node('button',item.form+' — '+item.gloss+(decisions.has(item.sourceId)?' · reviewed':''));
   button.type='button';button.className='u2-review-option';
   if(item.sourceId===chosen){button.classList.add('selected');button.setAttribute('aria-current','true');}
   button.addEventListener('click',()=>{chosen=item.sourceId;paintList();paintDetail();});
   list.append(button);
  }
  if(!filtered.length)list.append(node('p','No matching authored terms.'));
 }
 search.addEventListener('input',paintList);
 main.querySelector('[data-reset]')?.addEventListener('click',()=>{
  decisions.clear();status.textContent='Draft decisions cleared. Native progress was not affected.';
  paintCounts();paintList();paintDetail();
 });
 exportButton.addEventListener('click',()=>{
  const payload=buildReviewExport([...decisions.values()],report,revision);
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=node('a');a.href=url;a.download='french-u2-sense-review-draft.json';
  a.click();URL.revokeObjectURL(url);
  status.textContent='Downloaded a non-authoritative review draft. No data was imported or synchronized.';
 });
 paintCounts();paintList();paintDetail();
 try{
  const index=await loadVocabularySearchIndex(signal);
  if(signal.aborted)return;
  revision=index.revision;nativeRows=index.rows;
  for(const row of nativeRows){
   const key=normalizeFrenchSurface(row.word);
   byForm.set(key,[...(byForm.get(key)??[]),row]);
  }
  report=makeReviewReport(nativeRows,revision);
  status.textContent='Loaded '+nativeRows.length.toLocaleString()+' indexed native vocabulary rows from the existing verified on-demand content. Manual decisions cannot grant proficiency.';
  paintCounts();paintList();paintDetail();
 }catch(error){
  if(signal.aborted)return;
  status.textContent='Native index unavailable. You may record unlinked evidence locally; candidate matching is disabled.';
  console.error('U2 review native index unavailable',error);
 }
}
