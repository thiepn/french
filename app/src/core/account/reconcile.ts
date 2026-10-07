export type ReconcileAction='upload-new'|'upload-current'|'apply-remote'|'conflict'|'synced';

export interface ReconcileDecisionInput {
  remoteExists:boolean;
  remoteRevision:number|null;
  baselineRevision:number|null;
  baselineHash:string;
  localHash:string;
  meaningfulLocal:boolean;
}

export interface ReconcileDecision {
  action:ReconcileAction;
  expectedRevision:number|null;
  reason:string;
}

export function decideReconciliation(input:ReconcileDecisionInput):ReconcileDecision{
  if(!input.remoteExists){
    return{action:'upload-new',expectedRevision:null,reason:'no cloud state exists'};
  }

  if(input.baselineRevision===null){
    if(input.meaningfulLocal)return{action:'conflict',expectedRevision:null,reason:'unbaselined local and cloud state both exist'};
    return{action:'apply-remote',expectedRevision:input.remoteRevision,reason:'empty local state can safely adopt cloud'};
  }

  if(input.remoteRevision===input.baselineRevision){
    if(input.baselineHash&&input.baselineHash===input.localHash){
      return{action:'synced',expectedRevision:input.remoteRevision,reason:'local and cloud still match the baseline'};
    }
    return{action:'upload-current',expectedRevision:input.remoteRevision,reason:'only local state changed since baseline'};
  }

  if(input.baselineHash&&input.baselineHash===input.localHash){
    return{action:'apply-remote',expectedRevision:input.remoteRevision,reason:'only cloud state changed since baseline'};
  }

  return{action:'conflict',expectedRevision:input.remoteRevision,reason:'local and cloud both changed since baseline'};
}
