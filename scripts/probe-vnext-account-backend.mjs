const SUPABASE_URL='https://hycegznamzjhwinegaai.supabase.co';
const PUBLISHABLE_KEY='sb_publishable_1rZzRPzfLMaAH5pIgCwIjA_19UPMIsR';

async function json(url,options={}){
  const response=await fetch(url,{...options,headers:{apikey:PUBLISHABLE_KEY,accept:'application/json',...(options.headers??{})}});
  const text=await response.text();
  let value=null;
  try{value=text?JSON.parse(text):null;}catch{}
  if(!response.ok)throw new Error(url+' returned HTTP '+response.status+': '+text.slice(0,180));
  return value;
}

const auth=await json(SUPABASE_URL+'/auth/v1/settings');
const rest=await json(SUPABASE_URL+'/rest/v1/',{headers:{accept:'application/openapi+json'}});

const paths=rest?.paths&&typeof rest.paths==='object'?Object.keys(rest.paths):[];
const requiredPaths=['/french_sync_state','/rpc/connect_thiepn_app','/rpc/sync_thiepn_french_state'];
const failures=[];
if(auth?.external?.google!==true)failures.push('Google OAuth provider is not enabled');
for(const path of requiredPaths)if(!paths.includes(path))failures.push('missing PostgREST contract '+path);

console.log(JSON.stringify({
  schema:'thiepn-french-p37h-live-account-backend',
  ok:failures.length===0,
  failures,
  googleOAuth:auth?.external?.google===true,
  requiredPaths:Object.fromEntries(requiredPaths.map(path=>[path,paths.includes(path)])),
  destructiveWrites:false
},null,2));
if(failures.length)process.exitCode=1;
