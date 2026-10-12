import {sourceId} from './source.ts';
const SAFE=/^[A-Za-z0-9][A-Za-z0-9._/-]{0,127}$/;
const ALPHABET='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
/**
 * U2 browser repair: the existing native index contains IDs with punctuation
 * outside the sourceId local-ID grammar. Do not weaken sourceId validation.
 * Encode original UTF-8 bytes reversibly, preserving safe U1 identities.
 */
export function safeNativeLocalId(raw:string):string{
 if(typeof raw!=='string'||!raw.length)throw new Error('Missing native identifier');
 if(SAFE.test(raw))return raw;
 const bytes=new TextEncoder().encode(raw);
 if(bytes.length>90)throw new Error('Native identifier is too long for a lossless qualified link');
 let value='n64-';
 for(let i=0;i<bytes.length;i+=3){
  const a=bytes[i],b=bytes[i+1],c=bytes[i+2];
  value+=ALPHABET[a>>2];
  value+=ALPHABET[((a&3)<<4)|((b??0)>>4)];
  if(b!==undefined)value+=ALPHABET[((b&15)<<2)|((c??0)>>6)];
  if(c!==undefined)value+=ALPHABET[c&63];
 }
 if(value.length>128)throw new Error('Encoded native identifier too long');
 return value;
}
export function nativeQualifiedLexemeId(raw:string):string{
 return sourceId('native','lexeme',safeNativeLocalId(raw));
}
