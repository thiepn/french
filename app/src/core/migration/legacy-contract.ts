export const LEGACY_DEPTH_DB = 'french3000-depth-v31';
export const LEGACY_DEPTH_DB_VERSION = 1;
export const LEGACY_DEPTH_STORE = 'kv';
export const LEGACY_DEPTH_STATE_KEY = 'app-state';
export const LEGACY_DEPTH_SCHEMA = 13;
export const LEGACY_DEPTH_VERSION = '3.6.9';

export const LEGACY_STORAGE_KEYS = {
  progress:'french3000-progress-v2',
  settings:'french3000-settings-v2',
  reviewLog:'french3000-review-log-v3',
  studyDays:'french3000-study-days-v3',
  profile:'french3000-profile-v1',
  mistakeLog:'french3000-mistakes-v1',
  resumeSnapshot:'french3000-active-session-v1',
  customDecks:'french3000-custom-decks-v1',
  sessionHistory:'french3000-session-history-v1',
  studyPlan:'french3000-study-plan-v1',
  userCards:'french3000-user-cards-v1',
  cardEdits:'french3000-card-edits-v1',
  smartDecks:'french3000-smart-decks-v1',
  updatedAt:'french3000-depth-updated-at',
  reading:'french3000-reading-v1',
  listening:'french3000-listening-v1',
  speaking:'french3000-speaking-v1',
  conversation:'french3000-conversation-v1',
  missions:'french3000-missions-v1',
  curriculum:'french3000-communicative-curriculum-v1',
  openWorld:'french3000-open-world-v1',
  orchestrator:'french3000-cross-skill-orchestrator-v1',
  composer:'french3000-adaptive-session-composer-v1',
  longitudinal:'french-longitudinal-mastery-v1',
  progression:'french-cefr-progression-v1',
  remediation:'french-remediation-v1',
  benchmark:'french-functional-benchmarks-v1',
  openProduction:'french-b2-open-production-v1',
  capstone:'french-b2-integrated-capstone-v1',
  oral:'french-b2-spontaneous-oral-v1'
} as const;

export const LEGACY_PHASE_PROPERTY_BY_STORAGE_KEY: Record<string,string> = {
  'french3000-reading-v1':'v550Reading',
  'french3000-listening-v1':'v560Listening',
  'french3000-speaking-v1':'v570Speaking',
  'french3000-conversation-v1':'v580Conversation',
  'french3000-missions-v1':'v590Missions',
  'french3000-communicative-curriculum-v1':'v5110Curriculum',
  'french3000-open-world-v1':'v5120OpenWorld',
  'french3000-cross-skill-orchestrator-v1':'v5130Orchestrator',
  'french3000-adaptive-session-composer-v1':'v5140Composer',
  'french-longitudinal-mastery-v1':'v5150Longitudinal',
  'french-cefr-progression-v1':'v5160Progression',
  'french-remediation-v1':'v5170Remediation',
  'french-functional-benchmarks-v1':'v5190Benchmark',
  'french-b2-open-production-v1':'v5220Production',
  'french-b2-integrated-capstone-v1':'v5230Capstone',
  'french-b2-spontaneous-oral-v1':'v5240Oral'
};

export type JsonObject = Record<string, unknown>;

export interface LegacySnapshotEnvelope {
  schema:'thiepn-french-legacy-import-v1';
  source:'depth-db'|'local-storage';
  capturedAt:number;
  sourceUpdatedAt:number;
  sourceVersion:string;
  sourceSchema:number;
  fingerprint:string;
  payload:JsonObject;
}
