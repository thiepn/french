import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CUR02_LEVELS,buildFrenchCourseNavigation,parseFrenchCourseLocation,frenchCourseLocation,navLevelForOriginalBand} from '../app/src/core/unified/cur02-level-nav.ts';
const row=(id,level,order)=>({id,title:id,level,order,qualifiedId:'original:session:'+id,sourceRevision:'source-v1'});
test('all six levels, B1+ and early B2 are qualified only as native sub-bands',()=>{
 const nav=buildFrenchCourseNavigation([row('transfer-20','B1+',10),row('a1-01','A1',1),row('transfer-91','Early B2',30),row('b1-01','B1',2)]);
 assert.deepEqual(nav.map(x=>x.level),[...CUR02_LEVELS]);
 assert.deepEqual(nav[2].lessons.map(x=>x.id),['b1-01','transfer-20']);
 assert.equal(nav[3].coverage,'Early B2 only');assert.equal(nav[3].lessons[0].level,'Early B2');
 assert.equal(nav[4].availability,'planned');assert.equal(nav[5].availability,'planned');
});
test('original identities are never rewritten by display-number projection',()=>{
 const src=[row('a1-02','A1',2),row('a1-01','A1',1)];
 assert.deepEqual(buildFrenchCourseNavigation(src)[0].lessons.map(x=>[x.id,x.number,x.qualifiedId]),[
  ['a1-01',1,'original:session:a1-01'],['a1-02',2,'original:session:a1-02']]);
 assert.equal(src[0].id,'a1-02');
});
test('direct links reject level mismatch and absent source IDs without moving study state',()=>{
 const nav=buildFrenchCourseNavigation([row('a1-01','A1',1),row('b1-01','B1',2)]);
 assert.deepEqual(parseFrenchCourseLocation('#course/B1/b1-01',nav),{level:'B1',id:'b1-01'});
 assert.equal(parseFrenchCourseLocation('#course/A1/b1-01',nav),null);
 assert.equal(parseFrenchCourseLocation('#course/N5',nav),null);
 assert.equal(parseFrenchCourseLocation('#course/B1/%2F',nav),null);
 assert.equal(frenchCourseLocation('B1','b1-01'),'#course/B1/b1-01');
});
test('missing source proof and duplicate records fail closed',()=>{
 assert.throws(()=>buildFrenchCourseNavigation([row('a1-01','A1',1),row('a1-01','A2',2)]),/UNSAFE_OR_DUPLICATE/);
 assert.throws(()=>buildFrenchCourseNavigation([{...row('a1-01','A1',1),sourceRevision:''}]),/UNSAFE_OR_DUPLICATE/);
 assert.throws(()=>navLevelForOriginalBand('HSK2'),/UNKNOWN_ORIGINAL_BAND/);
});
