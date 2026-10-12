import type {RouteContext} from '../core/types';
import {GRAMMAR_REFS} from '../core/unified/catalog';
import {immutableRef} from '../core/unified/source';
import './unified.css';
const el=(tag:string,label:string,cls?:string)=>{const e=document.createElement(tag);e.textContent=label;if(cls)e.className=cls;return e;};
export function mount({main}:RouteContext):void{
const param=new URLSearchParams(location.hash.split('?')[1]??'');
const chosen=GRAMMAR_REFS.find(x=>x.id===param.get('id'))??GRAMMAR_REFS[0];
const section=document.createElement('section');section.className='page u1-grammar';
section.append(el('p','Metadata-only grammar references','eyebrow'),el('h1','Grammar'),
el('p','72 grammar IDs linked to A1–A2 lessons. Original explanations and examples require rights approval.','lede'));
const detail=document.createElement('article');detail.className='u1-panel';
detail.append(el('h2','Grammar reference '+chosen.id),el('p','Level '+chosen.level+' · lesson links: '+chosen.lessonIds.join(', ')),
el('p','Source reference: '+immutableRef('lcf','grammar',chosen.id),'u1-muted'));section.append(detail);
const grid=document.createElement('div');grid.className='u1-grid';grid.setAttribute('aria-label','Grammar references');
for(const row of GRAMMAR_REFS){const b=document.createElement('button');b.className='u1-grammar-ref';b.type='button';if(row.id===chosen.id)b.setAttribute('aria-current','true');
b.append(el('strong',row.id),el('span',row.level+' · '+row.lessonIds.length+' lesson link(s)','u1-muted'));
b.addEventListener('click',()=>{location.hash='grammar?id='+row.id;});grid.append(b);}
section.append(grid,el('p','No grammar mastery is granted. Source content, audio, and source PDF remain unpublished.','u1-hold'));main.replaceChildren(section);
}