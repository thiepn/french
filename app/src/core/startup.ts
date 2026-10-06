import type { ShellApi } from './types';
interface BootSummary{currentLevel?:string;dueCount?:number;streakDays?:number;}
const KEY='french-vnext-boot-summary-v1';
function summary():BootSummary|null{try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw) as BootSummary:null;}catch{return null;}}
export async function beginBackgroundStartup(shell:ShellApi):Promise<void>{
  const cached=summary();shell.setStatus(cached?.currentLevel?`${cached.currentLevel} · local`:'Local-first');
  try{
    const { hydrateLearnerState }=await import('./storage/hydrate');
    const state=await hydrateLearnerState();
    try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}
    window.dispatchEvent(new CustomEvent('french:vnext-state-ready',{detail:state}));
    shell.setStatus(state.currentLevel?`${state.currentLevel} · ready`:'Ready');
  }catch(error){console.warn('French vNext hydration degraded gracefully.',error);shell.setStatus('Ready · local fallback');}
  const work=()=>void import('./telemetry/performance').then(m=>m.recordRuntimePerformance());
  if('requestIdleCallback' in window)window.requestIdleCallback(work,{timeout:1500});else window.setTimeout(work,250);
}
