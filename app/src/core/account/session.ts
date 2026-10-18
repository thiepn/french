import { createThiepnAccountSession,readThiepnOAuthCallback,type ThiepnIdentity } from './account-session-vendor';
import { FRENCH_AUTH_RETURN_KEY,FRENCH_AUTH_STORAGE_KEY,FRENCH_OAUTH_CALLBACK_URL,FRENCH_OAUTH_CLIENT_ID,FRENCH_PRODUCTION_ORIGIN,THIEPN_ACCOUNT_PUBLISHABLE_KEY,THIEPN_ACCOUNT_URL,hasFrenchAccountConfiguration,isFrenchProductionOrigin } from './config';
export interface FrenchAccountUser{id:string;email:string|null}
let session:ReturnType<typeof createThiepnAccountSession>|null=null;
export function getFrenchAccountSession(){if(session)return session;if(!hasFrenchAccountConfiguration())throw new Error('FRENCH_OAUTH_CLIENT_NOT_REGISTERED');session=createThiepnAccountSession({issuer:THIEPN_ACCOUNT_URL,publishableKey:THIEPN_ACCOUNT_PUBLISHABLE_KEY,clientId:FRENCH_OAUTH_CLIENT_ID,redirectUri:FRENCH_OAUTH_CALLBACK_URL,scopes:['openid','email','profile','offline_access'],storageKey:FRENCH_AUTH_STORAGE_KEY,authPolicy:'guest-first'});return session;}
function user(identity:ThiepnIdentity):FrenchAccountUser|null{if(identity.status==='signed-in')return{id:identity.id,email:identity.email};if(identity.status==='unavailable')throw new Error(identity.code);return null;}
function safeReturn(raw:string):string{try{const target=new URL(raw,FRENCH_PRODUCTION_ORIGIN);if(target.origin!==FRENCH_PRODUCTION_ORIGIN||target.searchParams.has('code')||target.searchParams.has('state'))return'/';return target.pathname+target.search+target.hash;}catch{return'/';}}
export function isFrenchOAuthCallback():boolean{return isFrenchProductionOrigin()&&location.pathname==='/'&&!location.hash&&readThiepnOAuthCallback(location)!==null;}
export async function completeFrenchAccountCallback():Promise<FrenchAccountUser|null>{return user(await getFrenchAccountSession().completeCallback(location));}
export function consumeFrenchAccountReturnTo():string{let value='/';try{value=sessionStorage.getItem(FRENCH_AUTH_RETURN_KEY)??'/';sessionStorage.removeItem(FRENCH_AUTH_RETURN_KEY);}catch{}return safeReturn(value);}
export async function beginFrenchAccountSso(returnTo=location.href):Promise<void>{if(!isFrenchProductionOrigin())throw new Error('FRENCH_PRODUCTION_ORIGIN_REQUIRED');sessionStorage.setItem(FRENCH_AUTH_RETURN_KEY,safeReturn(returnTo));location.assign(await getFrenchAccountSession().authorizationUrl());}
export async function getVerifiedFrenchAccountUser():Promise<FrenchAccountUser|null>{if(!hasFrenchAccountConfiguration()||!isFrenchProductionOrigin())return null;return user(await getFrenchAccountSession().verify());}
export function signOutFrenchAppSession():void{session?.signOutLocal();}
export function subscribeFrenchAccount(listener:(identity:ThiepnIdentity)=>void):()=>void{return hasFrenchAccountConfiguration()?getFrenchAccountSession().subscribe(listener):()=>{};}
