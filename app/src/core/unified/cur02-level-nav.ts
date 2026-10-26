/** CEFR is a navigation grouping here, not a proficiency assessment. */
export const CUR02_LEVELS=['A1','A2','B1','B2','C1','C2'] as const;
export type Cur02Level=(typeof CUR02_LEVELS)[number];
export type OriginalCourseBand='A1'|'A2'|'B1'|'B1+'|'Early B2';
export function navLevelForOriginalBand(band:OriginalCourseBand):Cur02Level {
  const mapped:Record<OriginalCourseBand,Cur02Level>={A1:'A1',A2:'A2',B1:'B1','B1+':'B1','Early B2':'B2'};
  if(!(band in mapped))throw Error('CUR02_UNKNOWN_ORIGINAL_BAND:'+band);
  return mapped[band];
}
export interface OriginalCourseNavRecord {readonly id:string;readonly title:string;readonly level:OriginalCourseBand;readonly qualifiedId:string;readonly sourceRevision:string;readonly order:number;}
export function buildFrenchCourseNavigation(source:readonly OriginalCourseNavRecord[]){
 const used=new Set<string>();
 for(const row of source){
  navLevelForOriginalBand(row.level);
  if(!row.id||!row.title.trim()||!row.qualifiedId.trim()||!row.sourceRevision.trim()||
     !Number.isSafeInteger(row.order)||row.order<1||used.has(row.id))
   throw Error('CUR02_UNSAFE_OR_DUPLICATE_ORIGINAL:'+row.id);
  used.add(row.id);
 }
 return CUR02_LEVELS.map(level=>{
  const lessons=source.filter(item=>navLevelForOriginalBand(item.level)===level)
   .sort((a,b)=>a.order-b.order).map((row,i)=>({...row,number:i+1}));
  return {level,lessons,availability:lessons.length?'available' as const:'planned' as const,
    coverage:level==='B2'&&lessons.length?'Early B2 only':level==='B1'?'B1 including original B1+ practice':null};
 });
}
export function parseFrenchCourseLocation(hash:string,navigation:ReturnType<typeof buildFrenchCourseNavigation>){
 const match=/^#course\/(A1|A2|B1|B2|C1|C2)(?:\/([A-Za-z0-9-]+))?$/.exec(hash);
 if(!match)return null;
 const level=match[1] as Cur02Level,id=match[2]??null;
 if(id&&!navigation.find(item=>item.level===level)?.lessons.some(item=>item.id===id))return null;
 return {level,id};
}
export function frenchCourseLocation(level:Cur02Level,id?:string){
 return '#course/'+level+(id?'/'+id:'');
}
