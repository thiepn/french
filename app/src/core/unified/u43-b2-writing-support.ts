/** B2 writing-length guidance from explicit original lesson prompts, not an
 * examiner, grammar checker or CEFR score. No learner answer is persisted.
 */
export type B2WritingMode='fromListening'|'fromSources'|'fromDebate';
export type TargetRange=Readonly<{min:number;max:number}>;
// A null target means the source task intentionally has no numeric requirement.
const TARGETS:Readonly<Record<string,Readonly<Record<B2WritingMode,TargetRange|null>>>>=Object.freeze({
 'transfer-151':Object.freeze({
  fromListening:{min:150,max:200},fromSources:{min:170,max:220},fromDebate:{min:180,max:220}
 }),
 'transfer-152':Object.freeze({
  fromListening:{min:160,max:220},fromSources:{min:170,max:230},fromDebate:null
 }),
 'transfer-153':Object.freeze({
  fromListening:{min:150,max:210},fromSources:{min:170,max:220},fromDebate:{min:170,max:220}
 }),
 'transfer-154':Object.freeze({fromListening:{min:150,max:200},fromSources:{min:170,max:220},fromDebate:{min:180,max:220}}),
 'transfer-155':Object.freeze({fromListening:{min:150,max:200},fromSources:{min:170,max:220},fromDebate:{min:180,max:220}}),
 'transfer-156':Object.freeze({fromListening:{min:160,max:220},fromSources:{min:180,max:230},fromDebate:{min:190,max:240}}),
 'transfer-157':Object.freeze({fromListening:{min:170,max:220},fromSources:{min:180,max:230},fromDebate:{min:190,max:240}}),
 'transfer-158':Object.freeze({fromListening:{min:170,max:230},fromSources:{min:180,max:240},fromDebate:{min:190,max:250}}),
 'transfer-159':Object.freeze({fromListening:{min:170,max:230},fromSources:{min:190,max:250},fromDebate:{min:200,max:260}}),
 'transfer-160':Object.freeze({fromListening:{min:180,max:230},fromSources:{min:190,max:250},fromDebate:{min:210,max:260}}),
 'transfer-161':Object.freeze({fromListening:{min:180,max:230},fromSources:{min:190,max:250},fromDebate:{min:210,max:270}}),
 'transfer-162':Object.freeze({fromListening:{min:190,max:240},fromSources:{min:200,max:260},fromDebate:{min:220,max:280}}),
 'transfer-163':Object.freeze({fromListening:{min:190,max:240},fromSources:{min:200,max:260},fromDebate:{min:220,max:280}}),
 'transfer-164':Object.freeze({fromListening:{min:190,max:250},fromSources:{min:200,max:270},fromDebate:{min:220,max:290}}),
 'transfer-165':Object.freeze({fromListening:{min:190,max:250},fromSources:{min:200,max:270},fromDebate:{min:230,max:300}}),
 'transfer-166':Object.freeze({fromListening:{min:190,max:250},fromSources:{min:210,max:270},fromDebate:{min:220,max:290}}),
 'transfer-167':Object.freeze({fromListening:{min:190,max:250},fromSources:{min:210,max:270},fromDebate:{min:230,max:300}})
});
export function b2WritingTarget(id:string,mode:B2WritingMode):TargetRange|null{
 return TARGETS[id]?.[mode]??null;
}
/** French contractions and hyphenated compounds count as a single orthographic
 * word, consistently in the Course and the original Write workspace.
 */
export function countFrenchWritingWords(raw:string):number{
 return (raw.match(/[\p{L}\p{N}]+(?:[’'\-][\p{L}\p{N}]+)*/gu)??[]).length;
}
export function b2WritingLengthReview(id:string,mode:B2WritingMode,raw:string):Readonly<{
 words:number;target:TargetRange|null;status:'empty'|'short'|'within'|'long'|'unbounded';message:string
}>{
 const words=countFrenchWritingWords(raw),target=b2WritingTarget(id,mode);
 if(!words)return{words,target,status:'empty',message:target?
  '0 words · authored target '+target.min+'–'+target.max+'. Start with your own French argument.':
  '0 words · no encoded word target in this helper; follow the authored task prompt for this mode.'};
 if(!target)return{words,target,status:'unbounded',
  message:words+' words · no encoded word target in this helper; follow the authored task prompt. Check the task and its source-specific revision requirements.'};
 const status=words<target.min?'short':words>target.max?'long':'within';
 const hint=status==='short'?'Below the authored range; develop your sourced reasoning.':
  status==='long'?'Above the authored range; remove repetition without losing key evidence.':
   'Within the authored length range, not evidence of source accuracy or French proficiency.';
 return{words,target,status,
  message:words+' words · target '+target.min+'–'+target.max+'. '+hint};
}
