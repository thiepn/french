import {
 ORIGINAL_U22_CONNECTED_READINGS,u22OriginalEvidence,
 listeningQuestionsForU22,originalOralResponseU22,u22ProductionChoices
} from './u22-material.ts';
import {U42_B2_CASES,U46_B2_SEQUENCE,U49_B2_EXTENSION,U50_B2_SEQUENCE} from './u42-course.ts';
import type {A1Unit} from './u6-a1-model.ts';

const byId=new Map([...U42_B2_CASES,...U46_B2_SEQUENCE,...U49_B2_EXTENSION,...U50_B2_SEQUENCE].map(s=>[s.unit.id,s] as const));
export const ORIGINAL_U42_CONNECTED_READINGS=Object.freeze([
 ...ORIGINAL_U22_CONNECTED_READINGS,...U42_B2_CASES.map(s=>s.reading),...U46_B2_SEQUENCE.map(s=>s.reading),...U49_B2_EXTENSION.map(s=>s.reading),...U50_B2_SEQUENCE.map(s=>s.reading)
]);
export function u42OriginalEvidence(id:string){
 const story=byId.get(id);
 return story?{sources:story.evidence,questions:story.crossQuestions}:u22OriginalEvidence(id);
}
export function listeningQuestionsForU42(unit:A1Unit){
 return byId.get(unit.id)?.listening??listeningQuestionsForU22(unit);
}
export function originalOralResponseU42(id:string){
 return byId.get(id)?.oral??originalOralResponseU22(id);
}
export function u42ProductionChoices(id:string){
 return byId.get(id)?.writingChoices??u22ProductionChoices(id);
}
