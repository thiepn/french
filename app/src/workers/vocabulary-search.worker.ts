import { verifySha256 } from '../core/content/verify';

interface SearchRow {
  id:string;
  word:string;
  meaning:string;
  ipa:string;
  pos:string;
  level:string;
  order:number;
  packId:string;
}
interface SearchIndex {
  schema:'thiepn-french-vocabulary-search-v1';
  revision:string;
  rows:SearchRow[];
}
type WorkerIn=
  |{type:'init';path:string;sha256:string}
  |{type:'search';query:string;limit?:number;requestId:number};

const scope=self as unknown as {
  onmessage:((event:MessageEvent<WorkerIn>)=>void)|null;
  postMessage:(value:unknown)=>void;
};
let rows:Array<SearchRow&{foldedWord:string;foldedMeaning:string}>=[];
let ready=false;

function fold(value:string):string{
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').trim();
}
function score(row:SearchRow&{foldedWord:string;foldedMeaning:string},query:string):number{
  if(!query)return Math.max(1,100000-(row.order||0));
  if(row.foldedWord===query)return 1000;
  if(row.foldedWord.startsWith(query))return 850;
  if(row.foldedWord.includes(query))return 700;
  if(row.foldedMeaning.startsWith(query))return 500;
  if(row.foldedMeaning.includes(query))return 350;
  const tokens=query.split(/\s+/).filter(Boolean);
  const joined=row.foldedWord+' '+row.foldedMeaning;
  if(tokens.length&&tokens.every(token=>joined.includes(token)))return 250;
  return 0;
}

scope.onmessage=async(event)=>{
  const message=event.data;
  if(message.type==='init'){
    try{
      const response=await fetch(message.path,{cache:'force-cache'});
      if(!response.ok)throw new Error('Search index HTTP '+response.status);
      const bytes=await response.arrayBuffer();
      await verifySha256(bytes,message.sha256);
      const parsed=JSON.parse(new TextDecoder().decode(bytes)) as SearchIndex;
      if(parsed.schema!=='thiepn-french-vocabulary-search-v1'||!Array.isArray(parsed.rows))throw new Error('Search index schema mismatch.');
      rows=parsed.rows.map(row=>({...row,foldedWord:fold(row.word),foldedMeaning:fold(row.meaning)}));
      ready=true;
      scope.postMessage({type:'ready',count:rows.length});
    }catch(error){
      scope.postMessage({type:'error',message:error instanceof Error?error.message:String(error)});
    }
    return;
  }
  if(message.type==='search'){
    if(!ready){scope.postMessage({type:'results',requestId:message.requestId,rows:[]});return;}
    const query=fold(message.query);
    const limit=Math.max(1,Math.min(100,message.limit??40));
    const ranked=rows
      .map(row=>({row,score:score(row,query)}))
      .filter(item=>item.score>0)
      .sort((a,b)=>b.score-a.score||a.row.order-b.row.order)
      .slice(0,limit)
      .map(item=>item.row);
    scope.postMessage({type:'results',requestId:message.requestId,rows:ranked});
  }
};
