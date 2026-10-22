/** U61 — Build-owned application-shell checks. Never enumerate private
 * IndexedDB rows or touch P35's independent Cache Storage.
 */
export interface FrenchShellReadiness{
  ready:boolean;
  total:number;
  valid:number;
  missing:string[];
  cachePresent:boolean;
}
function compatibleStatus(value:unknown):value is FrenchShellReadiness{
  if(!value||typeof value!=='object')return false;
  const row=value as Record<string,unknown>;
  return typeof row.ready==='boolean'&&typeof row.cachePresent==='boolean'&&
    typeof row.total==='number'&&Number.isSafeInteger(row.total)&&row.total>=0&&
    typeof row.valid==='number'&&Number.isSafeInteger(row.valid)&&
    row.valid>=0&&row.valid<=row.total&&Array.isArray(row.missing)&&
    row.missing.every(path=>typeof path==='string'&&path.startsWith('/'));
}
async function askWorker(type:'FRENCH_VNEXT_SHELL_CHECK'|'FRENCH_VNEXT_SHELL_REPAIR'):Promise<FrenchShellReadiness>{
  if(!('serviceWorker' in navigator))throw Error('Offline app installation is not supported by this browser.');
  const registration=await navigator.serviceWorker.getRegistration('/');
  const worker=navigator.serviceWorker.controller??registration?.active;
  if(!worker)throw Error('No active French offline worker. Reload once while online, then check the app again.');
  if(type==='FRENCH_VNEXT_SHELL_REPAIR'&&!navigator.onLine)
    throw Error('Connect to the internet before repairing the offline app.');
  return new Promise<FrenchShellReadiness>((resolve,reject)=>{
    const channel=new MessageChannel();
    let settled=false;
    const finish=(error:Error|null,result?:FrenchShellReadiness)=>{
      if(settled)return;
      settled=true;clearTimeout(timeout);channel.port1.close();
      if(error)reject(error);else resolve(result!);
    };
    const timeout=setTimeout(()=>finish(Error('Offline app worker did not respond. Reload while online and retry.')),30000);
    channel.port1.onmessage=event=>{
      const message=event.data as {ok?:boolean;status?:unknown;error?:string}|null;
      if(message?.ok&&compatibleStatus(message.status))finish(null,message.status);
      else finish(Error(message?.error||'Offline app worker returned an invalid result.'));
    };
    try{worker.postMessage({type},[channel.port2]);}
    catch(error){finish(error instanceof Error?error:Error(String(error)));}
  });
}
export function inspectFrenchShellReadiness():Promise<FrenchShellReadiness>{
  return askWorker('FRENCH_VNEXT_SHELL_CHECK');
}
export function repairFrenchShell():Promise<FrenchShellReadiness>{
  return askWorker('FRENCH_VNEXT_SHELL_REPAIR');
}
export function formatFrenchShellReadiness(health:FrenchShellReadiness):string{
  if(health.ready)return 'Offline app ready: '+health.valid+'/'+health.total+
    ' installed source-verified app files are intact. Keep a separate study backup; other lessons may still require internet.';
  return 'Offline app is not ready: '+health.valid+'/'+health.total+
    ' installed files verified. Connect to the internet and choose Repair offline app before relying on an offline restart.';
}
