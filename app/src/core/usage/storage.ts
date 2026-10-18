import {readMetaValue,writeMetaValue} from '../storage/idb';
import {safeUsageState,type UsageState} from './session';
const KEY='native-usage-v1';
// Only source record IDs, outcome codes, support, and timestamps; never typed text.
export async function loadUsageState():Promise<UsageState>{
  return safeUsageState(await readMetaValue<UsageState>(KEY));
}
export async function saveUsageState(state:UsageState):Promise<void>{
  await writeMetaValue(KEY,safeUsageState(state));
}
