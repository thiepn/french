import { listContentPacks,loadContentPack,type VocabularyPack,type VocabularyWord } from './loader';

function hash(value:string):number{
  let h=2166136261;
  for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619);}
  return h>>>0;
}
function dayKey(now=Date.now()):string{
  const d=new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
export async function loadPracticeWords(
  preferredLevel='A1',
  limit=24,
  signal?:AbortSignal
):Promise<VocabularyWord[]>{
  const packs=(await listContentPacks(signal)).filter(pack=>pack.kind==='vocabulary');
  if(!packs.length)return[];
  const matching=packs.filter(pack=>pack.level===preferredLevel);
  const pool=matching.length?matching:packs;
  const selected=pool[hash(dayKey()+':'+preferredLevel)%pool.length];
  const pack=await loadContentPack<VocabularyPack>(selected.id,signal);
  const words=pack.words.filter(word=>word&&word.word&&word.meaning);
  if(words.length<=limit)return words;
  const offset=hash(dayKey()+':'+selected.id)%words.length;
  return Array.from({length:Math.min(limit,words.length)},(_,index)=>words[(offset+index)%words.length]);
}
