import {ORIGINAL_PATH_LESSONS,getLessonPath,missingPrerequisites} from './u3-pathways.ts';
import {SOURCES} from './source.ts';

/** Independent authored journeys. Suggestions, never unlock or mastery gates. */
export interface OriginalJourney{
 readonly id:string;
 readonly title:string;
 readonly purpose:string;
 readonly lessonIds:readonly string[];
 readonly revision:string;
 readonly source:'original';
}
const PLAN:readonly (readonly [string,string,string,readonly string[]])[]=[
 ['first-conversations','First conversations','Introduce yourself, order and describe preferences',
  ['greetings','cafe','preferences','market']],
 ['travel-day','Plan a journey','Arrange time, travel, react to delays',
  ['greetings','schedule','weekend','directions','travel','yesterday','late-train']],
 ['tell-your-story','Tell your story','Move from plans into completed actions and past habits',
  ['greetings','schedule','weekend','yesterday','memory','childhood-town','weekend-recap']],
 ['practical-appointments','Everyday appointments','Arrange an appointment, explain a problem and invite someone',
  ['greetings','cafe','preferences','schedule','appointment','health','invitation']]
];
export const ORIGINAL_JOURNEYS:readonly OriginalJourney[]=Object.freeze(PLAN.map(([id,title,purpose,lessonIds])=>
 Object.freeze({id,title,purpose,lessonIds:Object.freeze([...lessonIds]),
  revision:SOURCES.original.revision,source:'original' as const})));
export function validateJourneys():readonly string[]{
 const errors:string[]=[];
 const byId=new Map(ORIGINAL_PATH_LESSONS.map(lesson=>[lesson.id,lesson]));
 for(const journey of ORIGINAL_JOURNEYS){
  const seen=new Set<string>();
  for(const lessonId of journey.lessonIds){
   if(!byId.has(lessonId)){errors.push(journey.id+': unknown lesson '+lessonId);continue;}
   if(seen.has(lessonId)){errors.push(journey.id+': repeated lesson '+lessonId);continue;}
   const path=getLessonPath(lessonId);
   for(const dependency of path?.prerequisiteIds??[]){
    if(!seen.has(dependency))errors.push(journey.id+': prerequisite '+dependency+' comes after '+lessonId);
   }
   seen.add(lessonId);
  }
  if(journey.lessonIds.length<3)errors.push(journey.id+': journey too short');
 }
 if(new Set(ORIGINAL_JOURNEYS.map(j=>j.id)).size!==ORIGINAL_JOURNEYS.length)errors.push('duplicate journey');
 return errors;
}
export interface JourneyStatus{
 readonly practiced:number;
 readonly total:number;
 readonly suggestedId:string|null;
 readonly remaining:readonly string[];
 readonly advisoryMissing:readonly string[];
 readonly finishedInPage:boolean;
}
export function journeyStatus(id:string,practiced:ReadonlySet<string>):JourneyStatus|null{
 const journey=ORIGINAL_JOURNEYS.find(j=>j.id===id);
 if(!journey)return null;
 const remaining=journey.lessonIds.filter(lessonId=>!practiced.has(lessonId));
 const ready=remaining.find(lessonId=>missingPrerequisites(lessonId,practiced).length===0);
 const suggestedId=ready??remaining[0]??null;
 return {practiced:journey.lessonIds.length-remaining.length,total:journey.lessonIds.length,suggestedId,
  remaining,advisoryMissing:suggestedId?missingPrerequisites(suggestedId,practiced):[],
  finishedInPage:remaining.length===0};
}
export function upcomingInJourney(id:string,lessonId:string):string|null{
 const journey=ORIGINAL_JOURNEYS.find(j=>j.id===id);if(!journey)return null;
 const i=journey.lessonIds.indexOf(lessonId);
 return i>=0?journey.lessonIds[i+1]??null:null;
}
export function firstJourneyForLesson(lessonId:string):OriginalJourney|null{
 return ORIGINAL_JOURNEYS.find(j=>j.lessonIds.includes(lessonId))??null;
}
