import {readMetaValue,writeMetaValue} from '../storage/idb';
import {safeSourceGraphState,SOURCE_GRAPH_KEY,type SourceGraphState} from './p35-runtime';
export async function loadSourceGraphState():Promise<SourceGraphState>{
 return safeSourceGraphState(await readMetaValue<SourceGraphState>(SOURCE_GRAPH_KEY));
}
export async function persistSourceGraphState(state:SourceGraphState):Promise<void>{
 await writeMetaValue(SOURCE_GRAPH_KEY,safeSourceGraphState(state));
}
