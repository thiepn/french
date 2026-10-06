export async function sha256Hex(bytes:ArrayBuffer):Promise<string>{
  if(!crypto?.subtle)throw new Error('Web Crypto is unavailable.');
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  return [...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,'0')).join('');
}
export async function verifySha256(bytes:ArrayBuffer,expected?:string):Promise<void>{
  if(!expected)return;
  const actual=await sha256Hex(bytes);
  if(actual!==expected)throw new Error('Content integrity check failed.');
}
