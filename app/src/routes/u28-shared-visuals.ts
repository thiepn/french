/** Exact original French U28 vocabulary keys verified against
 * thiepn/french@3fb5c720cfeceaf682ce53c897701b489b7eaf6f and
 * thiepn/languages@cb38b6ae5cb6922d0bc00078f6e3a68174e7eb22.
 * Read-only reference images: no translation joins, student card IDs or grading.
 * Five static original Japanese-authored SVGs preserve their original Git blob SHAs.
 */
export interface FrenchReferenceVisual{
 readonly conceptId:string;
 readonly src:string;
 readonly alt:string;
 readonly blobSha:string;
}
export const FRENCH_REFERENCE_VISUALS:Readonly<Record<string,FrenchReferenceVisual>>=Object.freeze({
  "fru1:original@unified-u1-original-v1:session:u6-a1-02#vocab-08": Object.freeze({conceptId:"person.student-with-book",src:"/visual-lexicon/assets/student.svg",alt:"Illustration of a student carrying a schoolbook",blobSha:"14dc2b0419bb55fd2632c6912a5223f951726e50"}),
  "fru1:original@unified-u1-original-v1:session:u6-a1-02#vocab-09": Object.freeze({conceptId:"person.student-with-book",src:"/visual-lexicon/assets/student.svg",alt:"Illustration of a student carrying a schoolbook",blobSha:"14dc2b0419bb55fd2632c6912a5223f951726e50"}),
  "fru1:original@unified-u1-original-v1:session:u6-a1-02#vocab-10": Object.freeze({conceptId:"person.teacher-at-board",src:"/visual-lexicon/assets/teacher.svg",alt:"Illustration of a teacher pointing at a classroom board",blobSha:"ddcd6ec5d04ef4be9d854ad788994f146bab0009"}),
  "fru1:original@unified-u1-original-v1:session:u6-a1-03#vocab-01": Object.freeze({conceptId:"object.book",src:"/visual-lexicon/assets/book.svg",alt:"Illustration of a closed book",blobSha:"cbb6d7d4f16af1c24a5d20dd053ef9b67e53f20b"}),
  "fru1:original@unified-u1-original-v1:session:u6-a1-03#vocab-04": Object.freeze({conceptId:"place.school",src:"/visual-lexicon/assets/school.svg",alt:"Illustration of a multistory school with classroom windows and a clock",blobSha:"a108414c725998dc75af0e9b72f125967769c7f0"}),
  "fru1:original@unified-u1-original-v1:session:u6-a1-03#vocab-05": Object.freeze({conceptId:"object.handled-bag",src:"/visual-lexicon/assets/bag.svg",alt:"Illustration of a handled bag",blobSha:"325ee8361196852997525941bc1da6983f3c513e"})
});
export function originalFrenchReferenceImage(key:string):Readonly<FrenchReferenceVisual&{
 width:320; height:240; loading:'lazy'; decoding:'async';
}>|null{
 if(!Object.prototype.hasOwnProperty.call(FRENCH_REFERENCE_VISUALS,key))return null;
 const visual=FRENCH_REFERENCE_VISUALS[key];
 return visual?{...visual,width:320,height:240,loading:'lazy',decoding:'async'}:null;
}
