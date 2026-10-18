import {authorU19Scenario,type U19AuthoredScenario} from './u19-model.ts';
import type {TransferEvidence} from './u13-transfer-model.ts';

type Q=[string,string,string,string,string]; // prompt, correct, wrong1, wrong2, specific explanation
type V=[string,string,string]; // term, gloss, original contextual example
export interface U19OriginalSourceStory{
 id:string;title:string;goal:string;grammarKeys:[string,string];
 vocabulary:V[];dialogue:[string,string,string][];
 paragraphs:[string,string,string];readingTitle:string;
 evidence:[TransferEvidence,TransferEvidence];
 reading:[Q,Q,Q];compare:[Q,Q];listen:[Q,Q,Q,Q,Q,Q];
 clozes:[[string,string,string,string],[string,string,string,string]];
 order:[string,[string,string],string,string];
 writing:{
  listening:[string,string];sources:[string,string];debate:[string,string];
 };
 oral:[string,string];
}
/** Content-only adapter: every response and explanation is authored in the individual story. */
export function originalB1CriticalProduction(spec:U19OriginalSourceStory,n:number){
 const q=([prompt,answer,wrong1,wrong2,explanation]:Q):
  [string,string,string[],string]=>[prompt,answer,[wrong1,answer,wrong2],explanation];
 const produce=(v:[string,string],lens:'listening'|'sources'|'debate'):
  [string,string[],string]=>[v[0],
   lens==='listening'?['Retell what was actually heard and attribute the speaker.','Distinguish a proposal from a decision.','Include one practical next action without inventing information.']:
   lens==='sources'?['Attribute each document separately and precisely.','Identify which detail remains unknown or conditional.','Write a proportionate clarification or synthesis.']:
   ['Give one defensible recommendation based on the known evidence.','Acknowledge a credible competing preference or interpretation.','Explain a condition under which your recommendation should change.'],
   v[1]];
 const specFull:U19AuthoredScenario={
  id:spec.id,title:spec.title,goal:spec.goal,grammarKeys:spec.grammarKeys,
  vocabulary:spec.vocabulary as U19AuthoredScenario['vocabulary'],dialogue:spec.dialogue as U19AuthoredScenario['dialogue'],
  reading:{title:spec.readingTitle,paragraphs:spec.paragraphs,
   questions:[q(spec.reading[0]),q(spec.reading[1]),q(spec.reading[2])]},
  evidence:spec.evidence,
  comparison:[q(spec.compare[0]),q(spec.compare[1])],
  listening:[q(spec.listen[0]),q(spec.listen[1]),q(spec.listen[2]),q(spec.listen[3]),q(spec.listen[4]),q(spec.listen[5])],
  recall:{clozes:spec.clozes,order:spec.order},
  writing:{fromListening:produce(spec.writing.listening,'listening'),
   fromSources:produce(spec.writing.sources,'sources'),
   fromDebate:produce(spec.writing.debate,'debate')},
  oral:{prompt:spec.oral[0],plan:[
   'Present two concrete and accurately attributed facts.',
   'Acknowledge the counterpoint or unresolved evidence.',
   'Recommend a conditional practical next step.'
  ],model:spec.oral[1]}
 };
 return authorU19Scenario(specFull,n);
}
