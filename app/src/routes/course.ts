import type {RouteContext} from '../core/types';
import {COURSE_META,COURSE_SESSIONS,courseSession} from '../core/unified/catalog';
import {immutableRef} from '../core/unified/source';
import './unified.css';
const el=(tag:string,label:string,cls?:string)=>{const e=document.createElement(tag);e.textContent=label;if(cls)e.className=cls;return e;};
export function mount({main}:RouteContext):void{
 const param=new URLSearchParams(location.hash.split('?')[1]??'');
 const selected=courseSession(param.get('session')??'S01')??COURSE_SESSIONS[0];
 const section=document.createElement('section');section.className='page u1-course';
 section.append(el('p','Unified French · rights-held index','eyebrow'),el('h1','Course'),
 el('p','Twelve units, 60 source-linked sessions. Lesson and PDF publication await U2 rights certification.','lede'));
 const intro=el('div','');intro.className='u1-panel';intro.append(el('h2','60-session pathway'),el('p','48 lessons · 12 unit reviews · 6 checkpoints'),el('p','Index only — viewing a session does not change progress, SRS or CEFR.','u1-muted'));section.append(intro);
 const detail=document.createElement('article');detail.className='u1-panel';
 detail.append(el('h2','Session '+selected.id),el('p','Unit '+selected.unit+' · '+selected.level+' · '+selected.kind+' · '+selected.object),
 el('p','Declared PDF page '+selected.pdfPage+' (not served in this build).','u1-muted'));
 if(selected.checkpoint)detail.append(el('p','Cumulative checkpoint '+selected.checkpoint));
 detail.append(el('p','Source reference: '+immutableRef('lcf','session',selected.id),'u1-muted'));
 section.append(detail);
 const list=document.createElement('div');list.className='u1-grid';list.setAttribute('aria-label','Course sessions');
 for(const row of COURSE_SESSIONS){
  const button=document.createElement('button');button.type='button';button.className='u1-session';button.dataset.session=row.id;
  if(row.id===selected.id)button.setAttribute('aria-current','true');
  button.append(el('strong',row.id+' · '+row.object),el('span','Unit '+row.unit+' · '+row.level+(row.checkpoint?' · '+row.checkpoint:''),'u1-muted'));
  button.addEventListener('click',()=>{location.hash='course?session='+row.id;});
  list.append(button);
 }
 section.append(list,el('p','Locked source: '+COURSE_META.sourceCommit+'. All original coursebook prose and PDF bytes remain withheld.','u1-hold'));main.replaceChildren(section);
}