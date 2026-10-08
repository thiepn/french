import { ROUTE_IDS,type RouteId,type ShellApi } from './types';
const labels:Record<RouteId,string>={home:'Home',learn:'Learn',review:'Review',read:'Read',words:'Words',listen:'Listen',speak:'Speak',conversation:'Conversation',write:'Write',progress:'Progress',settings:'Settings'};
export function createShell(app:HTMLElement):ShellApi{
  app.textContent='';
  const header=document.createElement('header');header.className='app-header';
  header.innerHTML='<div class="brand-copy"><strong>French</strong><span>Adaptive French · scalable vNext runtime</span></div><div class="runtime-status" id="runtime-status" aria-live="polite">Ready</div>';
  const layout=document.createElement('div');layout.className='app-layout';
  const nav=document.createElement('nav');nav.className='primary-nav';nav.setAttribute('aria-label','Primary navigation');
  for(const route of ROUTE_IDS){const b=document.createElement('button');b.type='button';b.dataset.route=route;b.textContent=labels[route];b.addEventListener('click',()=>{location.hash='#'+route;});nav.append(b);}
  const main=document.createElement('main');main.id='main';main.className='route-host';main.tabIndex=-1;main.innerHTML='<section class="route-skeleton" aria-busy="true"><div class="skeleton-line skeleton-title"></div><div class="skeleton-line"></div><div class="skeleton-line skeleton-short"></div></section>';
  layout.append(nav,main);app.append(header,layout);
  const status=header.querySelector<HTMLElement>('#runtime-status');
  return{main,setActiveRoute(route){for(const b of nav.querySelectorAll<HTMLButtonElement>('button[data-route]')){const active=b.dataset.route===route;b.classList.toggle('is-active',active);active?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current');}},setStatus(message){if(status)status.textContent=message;}};
}
