import {readMetaValue,writeMetaValue} from '../storage/idb';
import {safeConversationState,type ConversationState} from './engine';
const KEY='native-conversation-v1';
// Metadata only: never retain raw free-text learner replies or audio transcripts.
// Full IDB exports and _vnext cloud backups carry the meta-store key.
export async function loadConversationState():Promise<ConversationState>{
  return safeConversationState(await readMetaValue<ConversationState>(KEY));
}
export async function persistConversationState(state:ConversationState):Promise<void>{
  await writeMetaValue(KEY,safeConversationState(state));
}
