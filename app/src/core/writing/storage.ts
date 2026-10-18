import {readMetaValue,writeMetaValue} from '../storage/idb';
import {safeWritingState,type WritingState} from './session';
const KEY='native-writing-v1';
// Only exercise IDs, support and result metadata are stored; never save entered prose.
export async function loadWritingState():Promise<WritingState>{
  return safeWritingState(await readMetaValue<WritingState>(KEY));
}
export async function saveWritingState(value:WritingState):Promise<void>{
  await writeMetaValue(KEY,safeWritingState(value));
}
