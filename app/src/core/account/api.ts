import { THIEPN_ACCOUNT_PUBLISHABLE_KEY,THIEPN_ACCOUNT_URL } from './config';
import { getFrenchAccountSession } from './session';
async function headers(extra:HeadersInit={}):Promise<Headers>{
  const token=await getFrenchAccountSession().getAccessToken();if(!token)throw new Error('ACCOUNT_AUTH_REQUIRED');
  const value=new Headers(extra);value.set('apikey',THIEPN_ACCOUNT_PUBLISHABLE_KEY);value.set('Authorization','Bearer '+token);value.set('Accept','application/json');return value;
}
export async function accountFetch(path:string,init:RequestInit={}):Promise<Response>{
  return fetch(new URL(path,THIEPN_ACCOUNT_URL),{...init,headers:await headers(init.headers),credentials:'omit',redirect:'error',signal:init.signal??AbortSignal.timeout(12_000)});
}
export async function accountJson<T>(path:string,init:RequestInit={}):Promise<T>{
  const response=await accountFetch(path,init),body=await response.text();let value:unknown=null;try{value=body?JSON.parse(body):null;}catch{}
  if(!response.ok){const row=value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};throw new Error(String(row.message??row.error??('ACCOUNT_HTTP_'+response.status)));}
  return value as T;
}
export function rpc<T>(name:string,args:Record<string,unknown>):Promise<T>{return accountJson<T>('/rest/v1/rpc/'+encodeURIComponent(name),{method:'POST',headers:{'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(args)});}
