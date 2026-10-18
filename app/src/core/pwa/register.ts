export async function registerOfflineRuntime():Promise<ServiceWorkerRegistration|null>{
  if(!('serviceWorker' in navigator))return null;
  if(location.protocol!=='https:'&&location.hostname!=='localhost'&&location.hostname!=='127.0.0.1')return null;
  try{
    const registration=await navigator.serviceWorker.register('/service-worker.js',{scope:'/',updateViaCache:'none'});
    void registration.update().catch(()=>undefined);
    return registration;
  }catch(error){
    console.warn('French offline runtime registration deferred.',error);
    return null;
  }
}
