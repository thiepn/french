/**
 * Read-only, strictly bounded inspection of an explicitly selected JSON export.
 * This module never reads or writes browser storage, performs network requests,
 * changes SRS intervals, imports progress, or contacts the Account service.
 */
export type LegacySource='carnet'|'french22';
export interface PreflightResult {
  readonly schema:'thiepn-french-unified-preflight-v1';
  readonly source:LegacySource;
  readonly readOnly:true;
  readonly readyForImport:false;
  readonly observedBytes:number;
  readonly topLevelKeys:readonly string[];
  readonly recordEstimate:number;
  readonly issues:readonly string[];
  readonly status:'inspectable'|'blocked';
}
const MAX_BYTES=5*1024*1024;
const MAX_DEPTH=32;
const MAX_NODES=25000;
const MAX_ARRAY=15000;
const allowedRoot=new Set(['schema','version','v','exportedAt','savedAt','updatedAt','storageKey',
  'source','app','progress','state','cards','deck','reviews','reviewLog','history',
  'settings','stats','data','favorites','sessions','completed','lessons']);
const expectedKeys:Readonly<Record<LegacySource,string>>={
  carnet:'fr-a1a2-practice-v6',french22:'french_flashcards_L15_28_v1'
};
export function preflightLegacyJson(raw:string,source:LegacySource):PreflightResult {
  const bytes=new TextEncoder().encode(raw).byteLength;
  const issues:string[]=[];
  const finish=(keys:string[]=[],recordEstimate=0):PreflightResult=>({
    schema:'thiepn-french-unified-preflight-v1',source,readOnly:true,readyForImport:false,
    observedBytes:bytes,topLevelKeys:keys,recordEstimate,issues,
    status:issues.length?'blocked':'inspectable'
  });
  if(bytes>MAX_BYTES){issues.push('5 MiB size limit exceeded');return finish();}
  let parsed:unknown;
  try{parsed=JSON.parse(raw);}catch{issues.push('Invalid JSON');return finish();}
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)){
    issues.push('Expected one JSON object at the root');return finish();
  }
  const root=parsed as Record<string,unknown>;
  const keys=Object.keys(root).sort();
  if(keys.length>50||keys.some(key=>!allowedRoot.has(key)))issues.push('Unknown root fields');
  if('storageKey' in root&&root.storageKey!==expectedKeys[source])issues.push('Wrong source storage key');
  if('source' in root&&typeof root.source==='string'&&root.source!==source&&root.source!==expectedKeys[source])
    issues.push('Wrong source label');
  if(!keys.some(key=>['progress','state','cards','deck','reviews','data','history','sessions','lessons'].includes(key)))
    issues.push('No recognized learning data fields');
  let nodes=0,records=0;
  const work:Array<[unknown,number]>=[[root,0]];
  while(work.length>0){
    const [item,depth]=work.pop()!;
    if(++nodes>MAX_NODES){issues.push('Node budget exceeded');break;}
    if(depth>MAX_DEPTH){issues.push('Depth limit exceeded');break;}
    if(!item||typeof item!=='object')continue;
    if(Array.isArray(item)){
      if(item.length>MAX_ARRAY){issues.push('Array limit exceeded');break;}
      records+=item.length;
      for(const child of item)if(child&&typeof child==='object')work.push([child,depth+1]);
    }else{
      const entries=Object.entries(item as Record<string,unknown>);
      if(entries.some(([key])=>['__proto__','prototype','constructor'].includes(key))){
        issues.push('Unsafe nested object key');break;
      }
      for(const [,child] of entries)if(child&&typeof child==='object')work.push([child,depth+1]);
    }
  }
  return finish(keys,records);
}
