/* U1: immutable provenance boundaries. No content redistribution or SRS mutation. */
export type Source='lcf'|'f22'|'french'|'languages';
export type Kind='session'|'unit'|'lesson'|'review'|'grammar'|'example'|'input'|'vocab'|'card'|'sense';
export interface Custody{repo:string;commit:string;blob?:string;rights:'HOLD'|'MIXED_RESTRICTED';canPublishRaw:false;canPublishDerived:false;}
export const SOURCES:Readonly<Record<Source,Custody>>=Object.freeze({
lcf:Object.freeze({repo:'thiepn/french-a1-a2',commit:'211208195e37dcb430e2321098c3ab545821548b',blob:'bff302c2d1ec594ddcff5dda8ccc4d331c1b0afb',rights:'HOLD',canPublishRaw:false,canPublishDerived:false}),
f22:Object.freeze({repo:'thiepn/french2.2',commit:'a4840e1db9376147d79dbc39d9e742023d773e47',blob:'8951d2151925b1129e3560c25b4b589aea67b1ec',rights:'HOLD',canPublishRaw:false,canPublishDerived:false}),
french:Object.freeze({repo:'thiepn/french',commit:'022a815df744e740ad187554b800daffaec21701',rights:'MIXED_RESTRICTED',canPublishRaw:false,canPublishDerived:false}),
languages:Object.freeze({repo:'thiepn/languages',commit:'b909b37c0e2a54e5ca93ba6880dbda1ad14d3405',rights:'HOLD',canPublishRaw:false,canPublishDerived:false})
});
const SAFE=/^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/;
export function sourceId(source:Source,kind:Kind,id:string):string{
if(!SOURCES[source]||!['session','unit','lesson','review','grammar','example','input','vocab','card','sense'].includes(kind)||!SAFE.test(id))throw Error('INVALID_SOURCE_ID');
return 'fru1:'+source+':'+kind+':'+id;
}
export function immutableRef(source:Source,kind:Kind,id:string):string{return sourceId(source,kind,id)+'@'+SOURCES[source].commit;}
export interface LexicalRow{source:Source;id:string;form:string;pos?:string;senseId?:string;}
export interface Candidate{sourceId:string;targets:string[];status:'NONE'|'CANDIDATE'|'AMBIGUOUS';automaticMerge:false;}
export function lexicalCrosswalk(sources:readonly LexicalRow[],targets:readonly LexicalRow[]):Candidate[]{
const norm=(x:string)=>x.normalize('NFC').toLocaleLowerCase('fr-FR').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const index=new Map<string,LexicalRow[]>();
for(const row of targets){const k=norm(row.form);index.set(k,[...(index.get(k)??[]),row]);}
return sources.map(row=>{const found=(index.get(norm(row.form))??[]).filter(x=>!row.pos||!x.pos||x.pos===row.pos);
return{sourceId:sourceId(row.source,'vocab',row.id),targets:found.map(x=>sourceId(x.source,'vocab',x.id)),
status:found.length===0?'NONE':found.length===1?'CANDIDATE':'AMBIGUOUS',automaticMerge:false};});
}
export interface ReviewLink{source:string;target:string;sourceSense:string;targetSense:string;reviewEvidenceId:string;approved:boolean;}
export function isReviewedLink(x:ReviewLink):boolean{
return x.approved===true&&SAFE.test(x.sourceSense)&&SAFE.test(x.targetSense)&&SAFE.test(x.reviewEvidenceId)
&&/^fru1:[a-z0-9]+:vocab:[A-Za-z0-9._-]+$/.test(x.source)
&&/^fru1:[a-z0-9]+:vocab:[A-Za-z0-9._-]+$/.test(x.target)&&x.source!==x.target;
}