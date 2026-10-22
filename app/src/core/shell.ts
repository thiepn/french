import {type RouteId,type ShellApi} from './types';

const PRIMARY:readonly {route:RouteId;label:string}[]=[
  {route:'home',label:'Home'},
  {route:'course',label:'Course'},
  {route:'review',label:'Review'},
  {route:'settings',label:'Me'}
];
const TOOLS:readonly {route:RouteId;label:string}[]=[
  {route:'learn',label:'Vocabulary'},
  {route:'read',label:'Reading'},
  {route:'listen',label:'Listening'},
  {route:'speak',label:'Speaking'},
  {route:'conversation',label:'Conversation'},
  {route:'write',label:'Writing'},
  {route:'grammar',label:'Grammar'},
  {route:'words',label:'Word library'},
  {route:'links',label:'Sense links'},
  {route:'b2',label:'B2 practice'},
  {route:'b2-assess',label:'B2 evidence'},
  {route:'b2-oral',label:'B2 oral'},
  {route:'b2-path',label:'B2 pathway'},
  {route:'progress',label:'Progress'}
];
const courseRoutes:ReadonlySet<RouteId>=new Set([
  'course','learn','read','listen','speak','conversation','write','grammar',
  'words','links','b2','b2-assess','b2-oral','b2-path'
]);
const navigate=(route:RouteId)=>{location.hash='#'+route;};

export function createShell(app:HTMLElement):ShellApi{
  app.replaceChildren();
  const header=document.createElement('header');
  header.className='app-header';
  const brand=document.createElement('strong');
  brand.className='brand-copy';brand.textContent='French';
  const status=document.createElement('span');
  status.id='runtime-status';status.className='runtime-status';
  status.setAttribute('role','status');status.setAttribute('aria-live','polite');

  const tools=document.createElement('details');
  tools.className='app-tools-menu';
  const trigger=document.createElement('summary');
  trigger.textContent='More';
  trigger.setAttribute('aria-label','Open additional French learning tools');
  const panel=document.createElement('div');
  panel.className='app-tools-panel';
  panel.setAttribute('aria-label','Additional learning tools');
  const title=document.createElement('h2');
  title.textContent='Practice & progress';
  panel.append(title);
  for(const tool of TOOLS){
    const control=document.createElement('button');
    control.type='button';control.dataset.route=tool.route;
    control.textContent=tool.label;
    control.addEventListener('click',()=>{
      tools.open=false;navigate(tool.route);
    });
    panel.append(control);
  }
  tools.append(trigger,panel);
  tools.addEventListener('keydown',event=>{
    if(event.key==='Escape'){tools.open=false;trigger.focus();}
  });
  document.addEventListener('pointerdown',event=>{
    if(tools.open&&!tools.contains(event.target as Node))tools.open=false;
  });
  header.append(brand,tools,status);

  const layout=document.createElement('div');layout.className='app-layout';
  const nav=document.createElement('nav');
  nav.className='primary-nav';
  nav.setAttribute('aria-label','Main navigation');
  for(const item of PRIMARY){
    const control=document.createElement('button');
    control.type='button';control.dataset.route=item.route;control.textContent=item.label;
    control.addEventListener('click',()=>navigate(item.route));
    nav.append(control);
  }
  const main=document.createElement('main');
  main.id='main';main.className='route-host';main.tabIndex=-1;
  main.innerHTML='<section class="route-skeleton" aria-busy="true"><div class="skeleton-line skeleton-title"></div><div class="skeleton-line"></div></section>';
  layout.append(nav,main);app.append(header,layout);
  return{
    main,
    setActiveRoute(route){
      const primary:RouteId=courseRoutes.has(route)?'course':
        route==='progress'?'settings':route;
      for(const control of nav.querySelectorAll<HTMLButtonElement>('button[data-route]')){
        const selected=control.dataset.route===primary;
        control.classList.toggle('is-active',selected);
        if(selected)control.setAttribute('aria-current','page');
        else control.removeAttribute('aria-current');
      }
      main.classList.toggle('course-host',route==='course');
      main.classList.toggle('review-host',route==='review');
      tools.open=false;
    },
    setStatus(message){status.textContent=message;}
  };
}
