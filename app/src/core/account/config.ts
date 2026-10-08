export const THIEPN_ACCOUNT_URL='https://hycegznamzjhwinegaai.supabase.co';
export const THIEPN_ACCOUNT_ORIGIN='https://account.thiepn.dev';
export const THIEPN_ACCOUNT_PUBLISHABLE_KEY='sb_publishable_1rZzRPzfLMaAH5pIgCwIjA_19UPMIsR';
export const FRENCH_PRODUCTION_ORIGIN='https://french.thiepn.dev';
export const FRENCH_OAUTH_CALLBACK_URL='https://french.thiepn.dev/';
export const FRENCH_OAUTH_CLIENT_ID='bf2e7fca-98dd-4833-9fee-306ecd6fc7d7';
export const FRENCH_AUTH_STORAGE_KEY='thiepn:french-sso:v1';
export const FRENCH_AUTH_RETURN_KEY='thiepn:french-sso:return:v1';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function hasFrenchAccountConfiguration():boolean{return UUID.test(FRENCH_OAUTH_CLIENT_ID);}
export function isFrenchProductionOrigin():boolean{return globalThis.location?.origin===FRENCH_PRODUCTION_ORIGIN;}
