import type { RouteContext } from '../core/types';
import { loadContentManifest } from '../core/content/manifest';

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page"><p class="eyebrow">On-demand corpus</p><h1>Words</h1><label class="search-field"><span>Search vocabulary</span><input type="search" placeholder="Search loaded vocabulary"></label><p class="inline-status" data-status>Reading vocabulary index…</p></section>';
  const manifest=await loadContentManifest(signal);
  const packs=manifest.packs.filter(pack=>pack.kind==='vocabulary');
  const count=packs.reduce((sum,pack)=>sum+(pack.count??0),0);
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(status)status.textContent=count?count.toLocaleString()+' words indexed in '+packs.length+' lazy packs.':'Vocabulary packs are not built yet.';
}
