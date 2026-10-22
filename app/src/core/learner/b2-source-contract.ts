/**
 * U66: actual P35 SHA-pinned reading authority. This is not another source
 * store: loader verifies the bytes, manifest owns SHA, this function binds
 * a single exact pack revision to the original B2 task/question inventory.
 */
import type {ReadingPack,ReadingItem,ReadingQuestion} from '../content/loader.ts';
import type {ContentPackDescriptor} from '../content/manifest.ts';

export interface P32SourceAuthority{
 digest:string;revision:string;sourceBlob:string;sourceRuntime:string;
 readings:ReadingItem[];
}
const digest=(value:unknown):value is string=>typeof value==='string'&&/^[0-9a-f]{64}$/.test(value);
const blob=(value:unknown):value is string=>typeof value==='string'&&/^[0-9a-f]{40}$/.test(value);
export function originalP32Question(source:ReadingItem,questionId:string):ReadingQuestion|null{
 const q=source.questions.find(x=>x.id===questionId);
 return q&&typeof q.prompt==='string'&&q.prompt.trim().length>8&&
  Array.isArray(q.options)&&q.options.length>=2&&q.options.length<=5&&
  q.options.every(option=>typeof option==='string'&&option.trim().length>0)&&
  Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length?q:null;
}
export function verifyP32SourceAuthority(
 pack:ReadingPack,descriptor:ContentPackDescriptor|undefined
):P32SourceAuthority|null{
 if(!descriptor||descriptor.id!=='reading-stable-p35'||descriptor.kind!=='reading'||
  !digest(descriptor.sha256)||!blob(pack.sourceBlob)||!pack.sourceRuntime||
  pack.schema!=='thiepn-french-reading-pack-v1'||pack.id!=='reading-stable-p35'||
  pack.revision!==pack.sourceBlob.slice(0,12)||descriptor.revision!==pack.revision||
  !Array.isArray(pack.readings))return null;
 const selected=pack.readings.filter(row=>
  row.level==='B2'&&typeof row.id==='string'&&/^read-b2-[a-z0-9-]+$/.test(row.id)&&
  typeof row.sourceLabel==='string'&&row.sourceLabel.trim()!==''&&
  typeof row.license==='string'&&row.license.trim()!==''&&
  Array.isArray(row.sentences)&&row.sentences.length>=4&&
  row.sentences.every(s=>typeof s.fr==='string'&&s.fr.trim().length>=12)&&
  Array.isArray(row.questions)&&row.questions.length>=2&&
  row.questions.slice(0,2).every(q=>originalP32Question(row,q.id)!==null)&&
  row.questions[0].id!==row.questions[1].id);
 if(selected.length!==6||new Set(selected.map(s=>s.id)).size!==6)return null;
 return{digest:descriptor.sha256,revision:pack.revision,
  sourceBlob:pack.sourceBlob,sourceRuntime:pack.sourceRuntime,readings:selected};
}
export function sourceMatchesAuthority(
 authority:P32SourceAuthority,source:ReadingItem,questionId:string
):boolean{
 return authority.readings.some(row=>row===source)&&Boolean(originalP32Question(source,questionId));
}
