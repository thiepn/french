/**
 * Small device-speech adapter for existing Listen/Speak routes. This is not a
 * speech engine, recording service, quality grader or source of learner evidence.
 * A speak() request is not proof that playback began: only onstart can report it.
 */
export function createFrenchPlayback(signal:AbortSignal){
 const synth=typeof window!=='undefined'?window.speechSynthesis:undefined;
 const supported=typeof synth?.speak==='function'&&typeof synth.cancel==='function'&&
  typeof window.SpeechSynthesisUtterance==='function';
 let active:SpeechSynthesisUtterance|null=null;
 const cancel=()=>{
  if(!active)return;
  active=null;
  try{synth?.cancel();}catch{/* Device synthesis may be unavailable on teardown. */}
 };
 const play=(text:string,rate:number,onStart:()=>void,onFailure:()=>void,onEnd?:()=>void):boolean=>{
  if(!supported||signal.aborted)return false;
  cancel();
  try{
   const utterance=new SpeechSynthesisUtterance(text);
   utterance.lang='fr-FR';utterance.rate=rate;
   const french=synth!.getVoices?.().find(voice=>voice.lang.toLowerCase().startsWith('fr'));
   if(french)utterance.voice=french;
   active=utterance;
   utterance.onstart=()=>{if(active===utterance&&!signal.aborted)onStart();};
   utterance.onerror=()=>{
    if(active!==utterance)return;
    active=null;
    if(!signal.aborted)onFailure();
   };
   utterance.onend=()=>{if(active===utterance){active=null;if(!signal.aborted)onEnd?.();}};
   synth!.speak(utterance);
   return true;
  }catch{
   active=null;
   if(!signal.aborted)onFailure();
   return false;
  }
 };
 signal.addEventListener('abort',cancel,{once:true});
 return{supported,play,cancel};
}
