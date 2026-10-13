import {ALL_B1_ORIGINAL_READINGS,listeningQuestionsForU12Course,oralResponseForU12,validateU12OriginalMaterials} from './u12-material.ts';
import {ORIGINAL_TRANSFER_SCENARIOS} from './u13-course.ts';
import type {A1Unit} from './u6-a1-model.ts';
import type {B1Reading} from './u10-readings-01-07.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import type {TransferEvidence,TransferQuestion} from './u13-transfer-model.ts';

export const ALL_ORIGINAL_CONNECTED_READINGS:readonly B1Reading[]=Object.freeze([
 ...ALL_B1_ORIGINAL_READINGS,...ORIGINAL_TRANSFER_SCENARIOS.map(x=>x.reading)
]);
export function getOriginalConnectedReading(id:string):B1Reading|null{
 return ALL_ORIGINAL_CONNECTED_READINGS.find(x=>x.unitId===id)??null;
}
export function originalTransferEvidence(id:string):Readonly<{sources:readonly TransferEvidence[];questions:readonly TransferQuestion[]}>|null{
 const scenario=ORIGINAL_TRANSFER_SCENARIOS.find(x=>x.unit.id===id);
 return scenario?{sources:scenario.evidence,questions:scenario.crossQuestions}:null;
}
export function listeningQuestionsForU13(unit:A1Unit):readonly A1ListeningQuestion[]{
 return ORIGINAL_TRANSFER_SCENARIOS.find(s=>s.unit.id===unit.id)?.listening??
  listeningQuestionsForU12Course(unit);
}
export function originalOralResponseU13(id:string){
 return ORIGINAL_TRANSFER_SCENARIOS.find(s=>s.unit.id===id)?.oral??oralResponseForU12(id);
}
export function validateU13OriginalMaterials():readonly string[]{
 const issues=[...validateU12OriginalMaterials()];
 if(ALL_ORIGINAL_CONNECTED_READINGS.length!==57)issues.push('Expected 42 inherited plus fifteen transfer readings');
 for(const scenario of ORIGINAL_TRANSFER_SCENARIOS){
  const id=scenario.unit.id,reading=getOriginalConnectedReading(id);
  if(!reading||reading.questions.length!==3)issues.push(id+' reading');
  const source=originalTransferEvidence(id);
  if(!source||source.sources.length!==2||source.questions.length!==2)
   issues.push(id+' cross-source reasoning');
  if(listeningQuestionsForU13(scenario.unit).length!==2)
   issues.push(id+' original listening');
  if(!originalOralResponseU13(id))issues.push(id+' independent speaking preparation');
 }
 return issues;
}
