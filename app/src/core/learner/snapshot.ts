import type {
  CanonicalLearnerStateV1,
  CanonicalMigrationV1,
  CanonicalReviewEventV1,
  CanonicalSrsRecordV1,
  CanonicalUserContentV1
} from './model';
import { legacyEnvelopeToCanonical } from './from-legacy';
import type { JsonObject,LegacySnapshotEnvelope } from '../migration/legacy-contract';

export interface CanonicalCloudSnapshotV1 {
  schema:'thiepn-french-cloud-state-v1';
  revision:1;
  updatedAt:number;
  appVersion:string;
  learner:CanonicalLearnerStateV1;
  srs:CanonicalSrsRecordV1[];
  reviews:CanonicalReviewEventV1[];
  userContent:CanonicalUserContentV1;
}

function object(value:unknown):Record<string,unknown>{
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function stableStringify(value:unknown):string{
  if(value===null||typeof value!=='object')return JSON.stringify(value);
  if(Array.isArray(value))return '['+value.map(stableStringify).join(',')+']';
  const source=value as Record<string,unknown>;
  const keys=Object.keys(source).filter(key=>key!=='updatedAt').sort();
  return '{'+keys.map(key=>JSON.stringify(key)+':'+stableStringify(source[key])).join(',')+'}';
}
async function sha256Text(text:string):Promise<string>{
  if(!globalThis.crypto?.subtle)return 'len-'+text.length;
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}

export function isCanonicalCloudSnapshot(value:unknown):value is CanonicalCloudSnapshotV1{
  const raw=object(value);
  return raw.schema==='thiepn-french-cloud-state-v1'&&raw.revision===1&&
    object(raw.learner).schema==='thiepn-french-learner-state-v1'&&
    Array.isArray(raw.srs)&&Array.isArray(raw.reviews)&&
    object(raw.userContent).schema==='thiepn-french-user-content-v1';
}

export async function cloudSnapshotHash(snapshot:CanonicalCloudSnapshotV1):Promise<string>{
  return sha256Text(stableStringify(snapshot));
}

export async function legacyCloudStateToCanonical(state:unknown):Promise<CanonicalMigrationV1>{
  const payload=object(state) as JsonObject;
  const fingerprint=await sha256Text(stableStringify(payload));
  const envelope:LegacySnapshotEnvelope={
    schema:'thiepn-french-legacy-import-v1',
    source:'depth-db',
    capturedAt:Date.now(),
    sourceUpdatedAt:Number(payload.updatedAt)||Date.now(),
    sourceVersion:typeof payload.version==='string'?payload.version:'5.24.0-cloud',
    sourceSchema:Number.isFinite(Number(payload.schema))?Number(payload.schema):13,
    fingerprint,
    payload
  };
  return legacyEnvelopeToCanonical(envelope);
}
