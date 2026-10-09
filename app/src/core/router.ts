import { ROUTE_IDS,type RouteContext,type RouteId,type RouteModule,type ShellApi } from './types';
const loaders:Record<RouteId,()=>Promise<RouteModule>>={
  home:()=>import('../routes/home'),learn:()=>import('../routes/learn'),review:()=>import('../routes/review'),read:()=>import('../routes/read'),words:()=>import('../routes/words'),
  listen:()=>import('../routes/listen'),speak:()=>import('../routes/speak'),conversation:()=>import('../routes/conversation'),write:()=>import('../routes/write'),progress:()=>import('../routes/progress'),settings:()=>import('../routes/settings')
};
function current():RouteId{const value=location.hash.replace(/^#/,'')||'home';return ROUTE_IDS.includes(value as RouteId)?value as RouteId:'home';}
export function createRouter(shell:ShellApi){
  let controller:AbortController|null=null;
  const navigate=(route:RouteId)=>{location.hash='#'+route;};
  const render=async(route:RouteId)=>{
    controller?.abort();controller=new AbortController();shell.setActiveRoute(route);shell.main.setAttribute('aria-busy','true');
    shell.main.innerHTML='<section class="route-skeleton"><div class="skeleton-line skeleton-title"></div><div class="skeleton-line"></div><div class="skeleton-line skeleton-short"></div></section>';
    try{const module=await loaders[route]();if(controller.signal.aborted)return;const context:RouteContext={main:shell.main,route,signal:controller.signal,navigate};await module.mount(context);if(controller.signal.aborted)return;shell.main.removeAttribute('aria-busy');shell.main.focus({preventScroll:true});}
    catch(error){if(controller.signal.aborted)return;shell.main.removeAttribute('aria-busy');shell.main.innerHTML='<section class="route-error"><h1>Could not open this section</h1><p>The route failed without taking down the rest of French.</p></section>';console.error('French vNext route failed',route,error);}
  };
  return{start(){
    window.addEventListener('hashchange',()=>void render(current()));
    // Do not append #home to an OAuth redirect: the shared callback parser
    // requires the exact query-only authorization code + state response.
    const params=new URLSearchParams(location.search);
    const oauthReturn=location.pathname==='/'&&params.has('state')
      &&(params.has('code')||params.has('error'));
    if(!location.hash&&!oauthReturn)history.replaceState(null,'','#home');
    void render(current());
  }};
}
