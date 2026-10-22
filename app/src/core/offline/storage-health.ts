/** Read-only diagnostics for vNext's local offline persistence.
 * Never deletes caches, databases or P35 data, and never enumerates learner
 * records. Browser storage figures describe the entire origin, not French alone.
 */
export interface OfflineStorageHealth{
  usageBytes:number|null;
  quotaBytes:number|null;
  persisted:boolean|null;
  nativeShells:number;
  hasVerifiedContent:boolean;
  p35Caches:number;
}
export async function inspectFrenchOfflineStorage():Promise<OfflineStorageHealth>{
  const storage=navigator.storage;
  const [estimate,persisted,names]=await Promise.all([
    storage?.estimate?.().catch(()=>null)??Promise.resolve(null),
    storage?.persisted?.().catch(()=>null)??Promise.resolve(null),
    typeof caches!=='undefined'?caches.keys().catch(()=>[]):Promise.resolve([] as string[])
  ]);
  const usage=estimate?.usage,quota=estimate?.quota;
  return{
    usageBytes:typeof usage==='number'&&Number.isFinite(usage)?usage:null,
    quotaBytes:typeof quota==='number'&&Number.isFinite(quota)&&quota>0?quota:null,
    persisted:typeof persisted==='boolean'?persisted:null,
    nativeShells:names.filter(name=>/^french-vnext-shell-[0-9a-f]{12}$/.test(name)).length,
    hasVerifiedContent:names.includes('french-vnext-content-v1'),
    p35Caches:names.filter(name=>name.startsWith('french-shell-')).length
  };
}
export async function requestFrenchPersistentStorage():Promise<'granted'|'denied'|'unsupported'>{
  if(!navigator.storage?.persist)return'unsupported';
  return(await navigator.storage.persist())?'granted':'denied';
}
export function formatOfflineStorageHealth(health:OfflineStorageHealth):string{
  const usage=health.usageBytes===null?'not reported':(health.usageBytes/1_000_000).toFixed(1)+' MB';
  const quota=health.quotaBytes===null?'not reported':(health.quotaBytes/1_000_000).toFixed(1)+' MB';
  const remaining=health.quotaBytes!==null&&health.usageBytes!==null
    ?Math.max(0,health.quotaBytes-health.usageBytes):null;
  const low=remaining!==null&&
    (remaining<30_000_000||(health.quotaBytes!==null&&remaining/health.quotaBytes<.1));
  const protection=health.persisted===true?'persistent':health.persisted===false?'not persistent':'unknown';
  const warning=low?' Low remaining space: export a backup before relying on offline mode.':'';
  return 'Origin storage '+usage+' of '+quota+'; protection '+protection+
    '; '+health.nativeShells+' native shell version(s); verified public cache '+
    (health.hasVerifiedContent?'present':'absent')+'; '+health.p35Caches+
    ' P35-owned cache(s) preserved. No data was deleted.'+warning;
}
