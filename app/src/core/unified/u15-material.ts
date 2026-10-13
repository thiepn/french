import {ORIGINAL_U14_CONNECTED_READINGS,getU14ConnectedReading,u14OriginalEvidence,
 listeningQuestionsForU14,originalOralResponseU14,u14ProductionChoices,validateU14Materials} from './u14-material.ts';
import {ORIGINAL_U15_SCENARIOS} from './u15-course.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import type {TransferEvidence,TransferQuestion} from './u13-transfer-model.ts';

export const ORIGINAL_U15_CONNECTED_READINGS:readonly B1Reading[]=Object.freeze([
 ...ORIGINAL_U14_CONNECTED_READINGS,...ORIGINAL_U15_SCENARIOS.map(s=>s.reading)
]);
export function getU15ConnectedReading(id:string):B1Reading|null{
 return ORIGINAL_U15_CONNECTED_READINGS.find(s=>s.unitId===id)??null;
}
export function u15OriginalEvidence(id:string):Readonly<{sources:readonly TransferEvidence[];questions:readonly TransferQuestion[]}>|null{
 const scenario=ORIGINAL_U15_SCENARIOS.find(s=>s.unit.id===id);
 return scenario?{sources:scenario.evidence,questions:scenario.crossQuestions}:u14OriginalEvidence(id);
}
export function listeningQuestionsForU15(unit:A1Unit):readonly A1ListeningQuestion[]{
 return ORIGINAL_U15_SCENARIOS.find(s=>s.unit.id===unit.id)?.listening??listeningQuestionsForU14(unit);
}
export function originalOralResponseU15(id:string){
 return ORIGINAL_U15_SCENARIOS.find(s=>s.unit.id===id)?.oral??originalOralResponseU14(id);
}
interface WriteOption{readonly prompt:string;readonly criteria:readonly string[];readonly model:string}
export type OriginalProductionChoices=Readonly<{
 fromListening:WriteOption;fromSources:WriteOption;fromDebate?:WriteOption;
}>;
export function u15ProductionChoices(id:string):OriginalProductionChoices|null{
 return ORIGINAL_U15_SCENARIOS.find(s=>s.unit.id===id)?.writingChoices??
   u14ProductionChoices(id);
}
export function validateU15Materials():readonly string[]{
 const issues=[...validateU14Materials()];
 if(ORIGINAL_U15_CONNECTED_READINGS.length!==87)
  issues.push('Expected 42 B1, 15 U13, 15 U14, and 15 U15 original readings');
 for(const scenario of ORIGINAL_U15_SCENARIOS){
  const id=scenario.unit.id;
  if(getU15ConnectedReading(id)?.questions.length!==3)issues.push(id+' reading');
  if(u15OriginalEvidence(id)?.questions.length!==2)issues.push(id+' source evidence');
  if(listeningQuestionsForU15(scenario.unit).length!==4)issues.push(id+' original listening');
  if(!originalOralResponseU15(id)||!u15ProductionChoices(id)?.fromDebate)
    issues.push(id+' autonomous debate production');
 }
 return issues;
}
