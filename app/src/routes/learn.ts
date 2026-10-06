import type { RouteContext } from '../core/types';
import { loadContentManifest } from '../core/content/manifest';

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page"><p class="eyebrow">Adaptive curriculum</p><h1>Learn</h1><p class="lede">Curriculum is external data, so adding lessons does not enlarge startup.</p><div class="inline-status" data-status>Loading curriculum index…</div></section>';
  const manifest=await loadContentManifest(signal);
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(status){
    const records=manifest.totals?.records??0;
    const packs=manifest.totals?.packs??manifest.packs.length;
    status.textContent=records?records.toLocaleString()+' vocabulary records across '+packs+' on-demand packs.':'Content migration has not started yet.';
  }
}
