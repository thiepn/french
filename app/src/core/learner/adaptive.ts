export type AdaptiveSkillId='recognition'|'article'|'production'|'spelling'|'listening'|'';

export interface AdaptiveVocabularyMeta {
  id:string;
  pos:string;
  article?:string;
}
export interface AdaptiveSrsRecord {
  skill:AdaptiveSkillId;
  status:'new'|'learning'|'learned';
  seen:number;
  successes:number;
  stability:number;
}
export interface AdaptiveReviewEvent {
  practiceOnly:boolean;
  correct:boolean;
  rating:'again'|'hard'|'good'|'easy';
}

function recentScheduledPerformance(events:AdaptiveReviewEvent[]){
  const scheduled=events.filter(event=>event.practiceOnly!==true);
  const reviewed=scheduled.length;
  const correct=scheduled.filter(event=>event.correct!==false&&event.rating!=='again').length;
  return{reviewed,correct,accuracy:reviewed?Math.round(correct/reviewed*100):null as number|null};
}

export function pacingDecision(
  dueTotal:number,
  remainingNew:number,
  reviewCapacity:number,
  events:AdaptiveReviewEvent[]
){
  const recent=recentScheduledPerformance(events);
  const cap=Math.max(0,Math.floor(reviewCapacity));
  const pressure=cap>0?dueTotal/Math.max(1,cap):0;
  let factor=1,reason='normal';
  if(cap>0&&pressure>=1){factor=0;reason='review backlog';}
  else if(cap>0&&pressure>=.65){factor=.5;reason='review pressure';}
  if(recent.reviewed>=30&&recent.accuracy!==null){
    if(recent.accuracy<72&&factor>.5){factor=.5;reason='recent recall needs consolidation';}
    else if(recent.accuracy<80&&factor>.75){factor=.75;reason='recent recall is still settling';}
  }
  const allowedNew=Math.min(Math.max(0,remainingNew),factor<=0?0:Math.ceil(Math.max(0,remainingNew)*factor));
  return{
    mode:factor===0?'recovery':factor<1?'cautious':'normal',
    factor,reason,dueTotal,pressure:Math.round(pressure*100)/100,
    remainingNew:Math.max(0,remainingNew),allowedNew,recent
  };
}

function bySkill(rows:AdaptiveSrsRecord[]):Map<AdaptiveSkillId,AdaptiveSrsRecord>{
  return new Map(rows.map(row=>[row.skill,row]));
}
function isUnseen(row:AdaptiveSrsRecord|undefined):boolean{
  return !row||(row.status==='new'&&row.seen===0);
}

export function nextAdaptiveSkill(meta:AdaptiveVocabularyMeta,rows:AdaptiveSrsRecord[]):AdaptiveSkillId|null{
  const skills=bySkill(rows);
  const recognition=skills.get('recognition');
  if(isUnseen(recognition))return'recognition';
  if(!recognition)return null;
  const recognitionReady=recognition.status==='learned'&&(recognition.stability>=1||recognition.successes>=3);
  if(!recognitionReady)return null;

  const noun=/noun/i.test(meta.pos)&&Boolean(meta.article);
  if(noun){
    const article=skills.get('article');
    if(isUnseen(article))return'article';
    if(article){
      const ready=article.status==='learned'||(article.successes>=2&&article.stability>=.5);
      if(!ready)return null;
    }
  }

  const production=skills.get('production');
  if(isUnseen(production))return'production';
  if(production){
    const ready=production.status==='learned'&&(production.stability>=1||production.successes>=3);
    if(!ready)return null;
  }

  const spelling=skills.get('spelling');
  if(isUnseen(spelling))return'spelling';
  if(spelling){
    const ready=spelling.status==='learned'||(spelling.successes>=2&&spelling.stability>=.5);
    if(!ready)return null;
  }

  const listening=skills.get('listening');
  if(isUnseen(listening))return'listening';
  return null;
}
