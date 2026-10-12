export type SourceKey = 'native'|'carnet'|'french22'|'languages'|'original';
export type SourceKind = 'session'|'grammar'|'lexeme'|'sense'|'example'|'reading'|'exercise';
export type RightsState = 'existing-runtime-mixed'|'original-owned'|'review-required';
export interface SourceContract {
  readonly key: SourceKey;
  readonly repository: string;
  readonly revision: string;
  readonly rights: RightsState;
  readonly permitted: 'native-runtime'|'self-authored'|'metadata-only';
  readonly displayName: string;
}
export const SOURCES: Readonly<Record<SourceKey,SourceContract>> = Object.freeze({
  native: Object.freeze({key:'native',repository:'thiepn/french',revision:'74dc6fcf8eaa1b1b7a0ef6ea9f3d92625d5ee31f',rights:'existing-runtime-mixed',permitted:'native-runtime',displayName:'French vNext'}),
  carnet: Object.freeze({key:'carnet',repository:'thiepn/french-a1-a2',revision:'211208195e37dcb430e2321098c3ab545821548b',rights:'review-required',permitted:'metadata-only',displayName:'Le Carnet Français A1–A2'}),
  french22: Object.freeze({key:'french22',repository:'thiepn/french2.2',revision:'a4840e1db9376147d79dbc39d9e742023d773e47',rights:'review-required',permitted:'metadata-only',displayName:'French 2.2 German glosses'}),
  languages: Object.freeze({key:'languages',repository:'thiepn/languages',revision:'b909b37c0e2a54e5ca93ba6880dbda1ad14d3405',rights:'existing-runtime-mixed',permitted:'native-runtime',displayName:'THIEPN Languages adapter'}),
  original: Object.freeze({key:'original',repository:'thiepn/french',revision:'unified-u1-original-v1',rights:'original-owned',permitted:'self-authored',displayName:'U1 original teaching content'})
});
export interface QualifiedProvenance {
  readonly source:SourceKey;
  readonly sourceRevision:string;
  readonly localId:string;
  readonly kind:SourceKind;
  readonly qualifiedId:string;
  readonly rights:RightsState;
}
export function sourceId(source:SourceKey,kind:SourceKind,localId:string):string {
  if(!/^[A-Za-z0-9][A-Za-z0-9._/-]{0,127}$/.test(localId)) throw new Error('Invalid source-local ID');
  return 'fru1:'+source+'@'+SOURCES[source].revision+':'+kind+':'+encodeURIComponent(localId);
}
export function provenance(source:SourceKey,kind:SourceKind,localId:string):QualifiedProvenance {
  const item=SOURCES[source];
  return Object.freeze({source,sourceRevision:item.revision,localId,kind,qualifiedId:sourceId(source,kind,localId),rights:item.rights});
}
export function distributionAllowed(source:SourceKey):boolean {
  return SOURCES[source].permitted!=='metadata-only';
}
