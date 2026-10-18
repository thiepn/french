const SUPABASE_URL='https://hycegznamzjhwinegaai.supabase.co';
const PUBLISHABLE_KEY='sb_publishable_1rZzRPzfLMaAH5pIgCwIjA_19UPMIsR';
const EXPECTED_RPC_NAMES=['connect_thiepn_app','sync_thiepn_french_state'];

async function request(path,options={}){
  const response=await fetch(SUPABASE_URL+path,{
    ...options,
    headers:{apikey:PUBLISHABLE_KEY,accept:'application/json',...(options.headers??{})}
  });
  const text=await response.text();
  let value=null;
  try{value=text?JSON.parse(text):null;}catch{}
  return{status:response.status,ok:response.ok,text,value};
}

const auth=await request('/auth/v1/settings');
if(!auth.ok)throw new Error('/auth/v1/settings returned HTTP '+auth.status+': '+auth.text.slice(0,180));

const table=await request('/rest/v1/french_sync_state?select=revision&limit=1');
const tableMissing=
  table.status===404||
  String(table.value?.code||'').toUpperCase()==='PGRST205'||
  /could not find.*french_sync_state|relation .*french_sync_state.*does not exist/i.test(table.text);

const failures=[];
if(auth.value?.external?.google!==true)failures.push('Google OAuth provider is not enabled');
if(tableMissing)failures.push('french_sync_state is missing from the Data API contract');

console.log(JSON.stringify({
  schema:'thiepn-french-p37h-live-account-backend',
  ok:failures.length===0,
  failures,
  googleOAuth:auth.value?.external?.google===true,
  frenchSyncStateSurface:tableMissing?'missing':(table.ok?'reachable':'protected'),
  rpcContract:EXPECTED_RPC_NAMES,
  rpcDiscovery:'verified separately through authenticated project schema; public OpenAPI introspection is intentionally unavailable',
  destructiveWrites:false
},null,2));
if(failures.length)process.exitCode=1;
