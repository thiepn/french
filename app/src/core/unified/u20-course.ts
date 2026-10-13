import {ORIGINAL_FRENCH_U19_COURSE,validateU19OriginalCourse} from './u19-course.ts';
import {U20_106_108} from './u20-106-108.ts';
import {U20_109_111} from './u20-109-111.ts';
import {U20_112_114} from './u20-112-114.ts';
import {U20_115_117} from './u20-115-117.ts';
import {U20_118_120} from './u20-118-120.ts';
import {validateU20Scenarios,type U20Scenario} from './u20-model.ts';
import {SOURCES} from './source.ts';
import type {A1Unit} from './u6-a1-model.ts';
/** All earlier original units stay authoritative, with unchanged stable identity. */
export const ORIGINAL_U20_SCENARIOS:readonly U20Scenario[]=Object.freeze([
 ...U20_106_108,...U20_109_111,...U20_112_114,...U20_115_117,...U20_118_120
]);
export const ORIGINAL_U20_UNITS:readonly A1Unit[]=Object.freeze(ORIGINAL_U20_SCENARIOS.map(s=>s.unit));
export const ORIGINAL_FRENCH_U20_COURSE:readonly A1Unit[]=Object.freeze([
 ...ORIGINAL_FRENCH_U19_COURSE,...ORIGINAL_U20_UNITS
]);
export function getU20OriginalUnit(id:string):A1Unit|null{
 return ORIGINAL_FRENCH_U20_COURSE.find(u=>u.id===id)??null;
}
export function suggestedU20OriginalUnit(practiced:ReadonlySet<string>):A1Unit|null{
 return ORIGINAL_FRENCH_U20_COURSE.find(u=>!practiced.has(u.id))??null;
}
export function u20PracticeStatus(id:string,answers:ReadonlyMap<string,boolean>){
 const u=getU20OriginalUnit(id);if(!u)return null;
 const correct=u.tasks.filter(t=>answers.get(t.id)===true).length;
 return {lessonId:id,correct,total:u.tasks.length,remaining:u.tasks.length-correct,locallyPracticed:correct===u.tasks.length};
}
export function validateU20OriginalCourse():readonly string[]{
 const issues=[...validateU19OriginalCourse(),...validateU20Scenarios(ORIGINAL_U20_SCENARIOS)];
 if(ORIGINAL_FRENCH_U20_COURSE.length!==214)issues.push('Expected 94 original full lessons plus 120 original U13–U20 transfer scenarios');
 if(new Set(ORIGINAL_FRENCH_U20_COURSE.map(u=>u.id)).size!==214)issues.push('Duplicate Course unit identity');
 for(const u of ORIGINAL_U20_UNITS)if(
  u.source.sourceRevision!==SOURCES.original.revision||
  u.source.qualifiedId!=='fru1:original@'+SOURCES.original.revision+':session:u20-'+u.id
 )issues.push('Unqualified U20 source '+u.id);
 return issues;
}
export async function loadU20OriginalFrenchCourse():Promise<readonly A1Unit[]>{
 const issues=validateU20OriginalCourse();
 if(issues.length)throw Error('Original French U20 Course invalid: '+issues.join('; '));
 return ORIGINAL_FRENCH_U20_COURSE;
}
