/** Rights-held, source-pinned curriculum INDEX ONLY; no original lesson text or PDF. */
import {immutableRef,SOURCES,sourceId} from './source.ts';
export type CourseLevel='A1.1'|'A1.2'|'A2.1'|'A2.2';
export interface CourseSession{n:number;id:string;object:string;unit:number;level:CourseLevel;kind:'lesson'|'review';pdfPage:number;printedPage:number;checkpoint:string|null;}
export interface GrammarRef{id:string;level:string;lessonIds:readonly string[];}
export const COURSE_META=Object.freeze({source:immutableRef('lcf','session','S01'),sourceCommit:SOURCES.lcf.commit,pdfBlob:'b82df52fd3d9d883a662fbad309c7183a92a89c1',declaredPdfPages:653,rights:'HOLD' as const,canPublishPdf:false,canPublishLessons:false});
export const COURSE_SESSIONS:readonly CourseSession[]=Object.freeze([
  {
    "n": 1,
    "id": "S01",
    "object": "L01",
    "kind": "lesson",
    "unit": 1,
    "level": "A1.1",
    "pdfPage": 36,
    "printedPage": 3,
    "checkpoint": null
  },
  {
    "n": 2,
    "id": "S02",
    "object": "L02",
    "kind": "lesson",
    "unit": 1,
    "level": "A1.1",
    "pdfPage": 43,
    "printedPage": 9,
    "checkpoint": null
  },
  {
    "n": 3,
    "id": "S03",
    "object": "L03",
    "kind": "lesson",
    "unit": 1,
    "level": "A1.1",
    "pdfPage": 50,
    "printedPage": 15,
    "checkpoint": null
  },
  {
    "n": 4,
    "id": "S04",
    "object": "L04",
    "kind": "lesson",
    "unit": 1,
    "level": "A1.1",
    "pdfPage": 57,
    "printedPage": 21,
    "checkpoint": null
  },
  {
    "n": 5,
    "id": "S05",
    "object": "REV-01",
    "kind": "review",
    "unit": 1,
    "level": "A1.1",
    "pdfPage": 64,
    "printedPage": 27,
    "checkpoint": null
  },
  {
    "n": 6,
    "id": "S06",
    "object": "L05",
    "kind": "lesson",
    "unit": 2,
    "level": "A1.1",
    "pdfPage": 68,
    "printedPage": 31,
    "checkpoint": null
  },
  {
    "n": 7,
    "id": "S07",
    "object": "L06",
    "kind": "lesson",
    "unit": 2,
    "level": "A1.1",
    "pdfPage": 76,
    "printedPage": 38,
    "checkpoint": null
  },
  {
    "n": 8,
    "id": "S08",
    "object": "L07",
    "kind": "lesson",
    "unit": 2,
    "level": "A1.1",
    "pdfPage": 83,
    "printedPage": 44,
    "checkpoint": null
  },
  {
    "n": 9,
    "id": "S09",
    "object": "L08",
    "kind": "lesson",
    "unit": 2,
    "level": "A1.1",
    "pdfPage": 90,
    "printedPage": 50,
    "checkpoint": null
  },
  {
    "n": 10,
    "id": "S10",
    "object": "REV-02",
    "kind": "review",
    "unit": 2,
    "level": "A1.1",
    "pdfPage": 97,
    "printedPage": 56,
    "checkpoint": "MOD-01"
  },
  {
    "n": 11,
    "id": "S11",
    "object": "L09",
    "kind": "lesson",
    "unit": 3,
    "level": "A1.1",
    "pdfPage": 101,
    "printedPage": 60,
    "checkpoint": null
  },
  {
    "n": 12,
    "id": "S12",
    "object": "L10",
    "kind": "lesson",
    "unit": 3,
    "level": "A1.1",
    "pdfPage": 108,
    "printedPage": 66,
    "checkpoint": null
  },
  {
    "n": 13,
    "id": "S13",
    "object": "L11",
    "kind": "lesson",
    "unit": 3,
    "level": "A1.1",
    "pdfPage": 115,
    "printedPage": 72,
    "checkpoint": null
  },
  {
    "n": 14,
    "id": "S14",
    "object": "L12",
    "kind": "lesson",
    "unit": 3,
    "level": "A1.1",
    "pdfPage": 122,
    "printedPage": 78,
    "checkpoint": null
  },
  {
    "n": 15,
    "id": "S15",
    "object": "REV-03",
    "kind": "review",
    "unit": 3,
    "level": "A1.1",
    "pdfPage": 129,
    "printedPage": 84,
    "checkpoint": null
  },
  {
    "n": 16,
    "id": "S16",
    "object": "L13",
    "kind": "lesson",
    "unit": 4,
    "level": "A1.2",
    "pdfPage": 134,
    "printedPage": 89,
    "checkpoint": null
  },
  {
    "n": 17,
    "id": "S17",
    "object": "L14",
    "kind": "lesson",
    "unit": 4,
    "level": "A1.2",
    "pdfPage": 141,
    "printedPage": 95,
    "checkpoint": null
  },
  {
    "n": 18,
    "id": "S18",
    "object": "L15",
    "kind": "lesson",
    "unit": 4,
    "level": "A1.2",
    "pdfPage": 148,
    "printedPage": 101,
    "checkpoint": null
  },
  {
    "n": 19,
    "id": "S19",
    "object": "L16",
    "kind": "lesson",
    "unit": 4,
    "level": "A1.2",
    "pdfPage": 155,
    "printedPage": 107,
    "checkpoint": null
  },
  {
    "n": 20,
    "id": "S20",
    "object": "REV-04",
    "kind": "review",
    "unit": 4,
    "level": "A1.2",
    "pdfPage": 162,
    "printedPage": 113,
    "checkpoint": "MOD-02"
  },
  {
    "n": 21,
    "id": "S21",
    "object": "L17",
    "kind": "lesson",
    "unit": 5,
    "level": "A1.2",
    "pdfPage": 166,
    "printedPage": 117,
    "checkpoint": null
  },
  {
    "n": 22,
    "id": "S22",
    "object": "L18",
    "kind": "lesson",
    "unit": 5,
    "level": "A1.2",
    "pdfPage": 173,
    "printedPage": 123,
    "checkpoint": null
  },
  {
    "n": 23,
    "id": "S23",
    "object": "L19",
    "kind": "lesson",
    "unit": 5,
    "level": "A1.2",
    "pdfPage": 180,
    "printedPage": 129,
    "checkpoint": null
  },
  {
    "n": 24,
    "id": "S24",
    "object": "L20",
    "kind": "lesson",
    "unit": 5,
    "level": "A1.2",
    "pdfPage": 188,
    "printedPage": 135,
    "checkpoint": null
  },
  {
    "n": 25,
    "id": "S25",
    "object": "REV-05",
    "kind": "review",
    "unit": 5,
    "level": "A1.2",
    "pdfPage": 195,
    "printedPage": 141,
    "checkpoint": null
  },
  {
    "n": 26,
    "id": "S26",
    "object": "L21",
    "kind": "lesson",
    "unit": 6,
    "level": "A1.2",
    "pdfPage": 199,
    "printedPage": 145,
    "checkpoint": null
  },
  {
    "n": 27,
    "id": "S27",
    "object": "L22",
    "kind": "lesson",
    "unit": 6,
    "level": "A1.2",
    "pdfPage": 206,
    "printedPage": 151,
    "checkpoint": null
  },
  {
    "n": 28,
    "id": "S28",
    "object": "L23",
    "kind": "lesson",
    "unit": 6,
    "level": "A1.2",
    "pdfPage": 213,
    "printedPage": 157,
    "checkpoint": null
  },
  {
    "n": 29,
    "id": "S29",
    "object": "L24",
    "kind": "lesson",
    "unit": 6,
    "level": "A1.2",
    "pdfPage": 221,
    "printedPage": 163,
    "checkpoint": null
  },
  {
    "n": 30,
    "id": "S30",
    "object": "REV-06",
    "kind": "review",
    "unit": 6,
    "level": "A1.2",
    "pdfPage": 229,
    "printedPage": 169,
    "checkpoint": "MOD-03"
  },
  {
    "n": 31,
    "id": "S31",
    "object": "L25",
    "kind": "lesson",
    "unit": 7,
    "level": "A1.2",
    "pdfPage": 234,
    "printedPage": 174,
    "checkpoint": null
  },
  {
    "n": 32,
    "id": "S32",
    "object": "L26",
    "kind": "lesson",
    "unit": 7,
    "level": "A1.2",
    "pdfPage": 241,
    "printedPage": 180,
    "checkpoint": null
  },
  {
    "n": 33,
    "id": "S33",
    "object": "L27",
    "kind": "lesson",
    "unit": 7,
    "level": "A1.2",
    "pdfPage": 248,
    "printedPage": 186,
    "checkpoint": null
  },
  {
    "n": 34,
    "id": "S34",
    "object": "L28",
    "kind": "lesson",
    "unit": 7,
    "level": "A1.2",
    "pdfPage": 255,
    "printedPage": 192,
    "checkpoint": null
  },
  {
    "n": 35,
    "id": "S35",
    "object": "REV-07",
    "kind": "review",
    "unit": 7,
    "level": "A1.2",
    "pdfPage": 263,
    "printedPage": 198,
    "checkpoint": null
  },
  {
    "n": 36,
    "id": "S36",
    "object": "L29",
    "kind": "lesson",
    "unit": 8,
    "level": "A1.2",
    "pdfPage": 267,
    "printedPage": 202,
    "checkpoint": null
  },
  {
    "n": 37,
    "id": "S37",
    "object": "L30",
    "kind": "lesson",
    "unit": 8,
    "level": "A1.2",
    "pdfPage": 274,
    "printedPage": 208,
    "checkpoint": null
  },
  {
    "n": 38,
    "id": "S38",
    "object": "L31",
    "kind": "lesson",
    "unit": 8,
    "level": "A1.2",
    "pdfPage": 281,
    "printedPage": 214,
    "checkpoint": null
  },
  {
    "n": 39,
    "id": "S39",
    "object": "L32",
    "kind": "lesson",
    "unit": 8,
    "level": "A1.2",
    "pdfPage": 288,
    "printedPage": 220,
    "checkpoint": null
  },
  {
    "n": 40,
    "id": "S40",
    "object": "REV-08",
    "kind": "review",
    "unit": 8,
    "level": "A1.2",
    "pdfPage": 295,
    "printedPage": 226,
    "checkpoint": "MOD-04"
  },
  {
    "n": 41,
    "id": "S41",
    "object": "L33",
    "kind": "lesson",
    "unit": 9,
    "level": "A2.1",
    "pdfPage": 300,
    "printedPage": 231,
    "checkpoint": null
  },
  {
    "n": 42,
    "id": "S42",
    "object": "L34",
    "kind": "lesson",
    "unit": 9,
    "level": "A2.1",
    "pdfPage": 308,
    "printedPage": 237,
    "checkpoint": null
  },
  {
    "n": 43,
    "id": "S43",
    "object": "L35",
    "kind": "lesson",
    "unit": 9,
    "level": "A2.1",
    "pdfPage": 316,
    "printedPage": 243,
    "checkpoint": null
  },
  {
    "n": 44,
    "id": "S44",
    "object": "L36",
    "kind": "lesson",
    "unit": 9,
    "level": "A2.1",
    "pdfPage": 323,
    "printedPage": 249,
    "checkpoint": null
  },
  {
    "n": 45,
    "id": "S45",
    "object": "REV-09",
    "kind": "review",
    "unit": 9,
    "level": "A2.1",
    "pdfPage": 330,
    "printedPage": 255,
    "checkpoint": null
  },
  {
    "n": 46,
    "id": "S46",
    "object": "L37",
    "kind": "lesson",
    "unit": 10,
    "level": "A2.1",
    "pdfPage": 334,
    "printedPage": 259,
    "checkpoint": null
  },
  {
    "n": 47,
    "id": "S47",
    "object": "L38",
    "kind": "lesson",
    "unit": 10,
    "level": "A2.1",
    "pdfPage": 341,
    "printedPage": 265,
    "checkpoint": null
  },
  {
    "n": 48,
    "id": "S48",
    "object": "L39",
    "kind": "lesson",
    "unit": 10,
    "level": "A2.1",
    "pdfPage": 348,
    "printedPage": 271,
    "checkpoint": null
  },
  {
    "n": 49,
    "id": "S49",
    "object": "L40",
    "kind": "lesson",
    "unit": 10,
    "level": "A2.1",
    "pdfPage": 354,
    "printedPage": 276,
    "checkpoint": null
  },
  {
    "n": 50,
    "id": "S50",
    "object": "REV-10",
    "kind": "review",
    "unit": 10,
    "level": "A2.1",
    "pdfPage": 361,
    "printedPage": 282,
    "checkpoint": "MOD-05"
  },
  {
    "n": 51,
    "id": "S51",
    "object": "L41",
    "kind": "lesson",
    "unit": 11,
    "level": "A2.2",
    "pdfPage": 365,
    "printedPage": 286,
    "checkpoint": null
  },
  {
    "n": 52,
    "id": "S52",
    "object": "L42",
    "kind": "lesson",
    "unit": 11,
    "level": "A2.2",
    "pdfPage": 372,
    "printedPage": 292,
    "checkpoint": null
  },
  {
    "n": 53,
    "id": "S53",
    "object": "L43",
    "kind": "lesson",
    "unit": 11,
    "level": "A2.2",
    "pdfPage": 379,
    "printedPage": 298,
    "checkpoint": null
  },
  {
    "n": 54,
    "id": "S54",
    "object": "L44",
    "kind": "lesson",
    "unit": 11,
    "level": "A2.2",
    "pdfPage": 386,
    "printedPage": 304,
    "checkpoint": null
  },
  {
    "n": 55,
    "id": "S55",
    "object": "REV-11",
    "kind": "review",
    "unit": 11,
    "level": "A2.2",
    "pdfPage": 394,
    "printedPage": 310,
    "checkpoint": null
  },
  {
    "n": 56,
    "id": "S56",
    "object": "L45",
    "kind": "lesson",
    "unit": 12,
    "level": "A2.2",
    "pdfPage": 398,
    "printedPage": 314,
    "checkpoint": null
  },
  {
    "n": 57,
    "id": "S57",
    "object": "L46",
    "kind": "lesson",
    "unit": 12,
    "level": "A2.2",
    "pdfPage": 406,
    "printedPage": 320,
    "checkpoint": null
  },
  {
    "n": 58,
    "id": "S58",
    "object": "L47",
    "kind": "lesson",
    "unit": 12,
    "level": "A2.2",
    "pdfPage": 413,
    "printedPage": 326,
    "checkpoint": null
  },
  {
    "n": 59,
    "id": "S59",
    "object": "L48",
    "kind": "lesson",
    "unit": 12,
    "level": "A2.2",
    "pdfPage": 421,
    "printedPage": 332,
    "checkpoint": null
  },
  {
    "n": 60,
    "id": "S60",
    "object": "REV-12",
    "kind": "review",
    "unit": 12,
    "level": "A2.2",
    "pdfPage": 427,
    "printedPage": 337,
    "checkpoint": "MOD-06"
  }
] as CourseSession[]);
export const GRAMMAR_REFS:readonly GrammarRef[]=Object.freeze([
  {
    "id": "GRM-001",
    "level": "A1",
    "lessonIds": [
      "L01"
    ]
  },
  {
    "id": "GRM-002",
    "level": "A1",
    "lessonIds": [
      "L01",
      "L02"
    ]
  },
  {
    "id": "GRM-003",
    "level": "A1",
    "lessonIds": [
      "L02",
      "L04"
    ]
  },
  {
    "id": "GRM-004",
    "level": "A1",
    "lessonIds": [
      "L05",
      "L06"
    ]
  },
  {
    "id": "GRM-005",
    "level": "A1",
    "lessonIds": [
      "L05",
      "L06"
    ]
  },
  {
    "id": "GRM-006",
    "level": "A1",
    "lessonIds": [
      "L05"
    ]
  },
  {
    "id": "GRM-007",
    "level": "A1",
    "lessonIds": [
      "L08"
    ]
  },
  {
    "id": "GRM-008",
    "level": "A1",
    "lessonIds": [
      "L08"
    ]
  },
  {
    "id": "GRM-009",
    "level": "A1",
    "lessonIds": [
      "L02",
      "L05"
    ]
  },
  {
    "id": "GRM-010",
    "level": "A1",
    "lessonIds": [
      "L02",
      "L05"
    ]
  },
  {
    "id": "GRM-011",
    "level": "A1",
    "lessonIds": [
      "L13",
      "L16"
    ]
  },
  {
    "id": "GRM-012",
    "level": "A1",
    "lessonIds": [
      "L14"
    ]
  },
  {
    "id": "GRM-013",
    "level": "A1",
    "lessonIds": [
      "L01"
    ]
  },
  {
    "id": "GRM-014",
    "level": "A1",
    "lessonIds": [
      "L15",
      "L24"
    ]
  },
  {
    "id": "GRM-015",
    "level": "A1",
    "lessonIds": [
      "L03",
      "L15"
    ]
  },
  {
    "id": "GRM-016",
    "level": "A1",
    "lessonIds": [
      "L09",
      "L10",
      "L21"
    ]
  },
  {
    "id": "GRM-017",
    "level": "A1",
    "lessonIds": [
      "L10",
      "L21"
    ]
  },
  {
    "id": "GRM-018",
    "level": "A1",
    "lessonIds": [
      "L10"
    ]
  },
  {
    "id": "GRM-019",
    "level": "A1",
    "lessonIds": [
      "L07"
    ]
  },
  {
    "id": "GRM-020",
    "level": "A1",
    "lessonIds": [
      "L07"
    ]
  },
  {
    "id": "GRM-021",
    "level": "A1",
    "lessonIds": [
      "L08",
      "L19"
    ]
  },
  {
    "id": "GRM-022",
    "level": "A1",
    "lessonIds": [
      "L22"
    ]
  },
  {
    "id": "GRM-023",
    "level": "A1",
    "lessonIds": [
      "L23"
    ]
  },
  {
    "id": "GRM-024",
    "level": "A1",
    "lessonIds": [
      "L16",
      "L25"
    ]
  },
  {
    "id": "GRM-025",
    "level": "A1",
    "lessonIds": [
      "L24"
    ]
  },
  {
    "id": "GRM-026",
    "level": "A1",
    "lessonIds": [
      "L32"
    ]
  },
  {
    "id": "GRM-027",
    "level": "A1",
    "lessonIds": [
      "L14"
    ]
  },
  {
    "id": "GRM-028",
    "level": "A1",
    "lessonIds": [
      "L04",
      "L12",
      "L27"
    ]
  },
  {
    "id": "GRM-029",
    "level": "A1",
    "lessonIds": [
      "L11"
    ]
  },
  {
    "id": "GRM-030",
    "level": "A1",
    "lessonIds": [
      "L14"
    ]
  },
  {
    "id": "GRM-031",
    "level": "A1",
    "lessonIds": [
      "L17"
    ]
  },
  {
    "id": "GRM-032",
    "level": "A1",
    "lessonIds": [
      "L17"
    ]
  },
  {
    "id": "GRM-033",
    "level": "A1",
    "lessonIds": [
      "L18",
      "L19"
    ]
  },
  {
    "id": "GRM-034",
    "level": "A1",
    "lessonIds": [
      "L18",
      "L26"
    ]
  },
  {
    "id": "GRM-035",
    "level": "A1",
    "lessonIds": [
      "L26"
    ]
  },
  {
    "id": "GRM-036",
    "level": "A1",
    "lessonIds": [
      "L27",
      "L37"
    ]
  },
  {
    "id": "GRM-037",
    "level": "A1",
    "lessonIds": [
      "L18",
      "L22"
    ]
  },
  {
    "id": "GRM-038",
    "level": "A1",
    "lessonIds": [
      "L20"
    ]
  },
  {
    "id": "GRM-039",
    "level": "A1",
    "lessonIds": [
      "L20"
    ]
  },
  {
    "id": "GRM-040",
    "level": "A1",
    "lessonIds": [
      "L28"
    ]
  },
  {
    "id": "GRM-041",
    "level": "A1",
    "lessonIds": [
      "L25"
    ]
  },
  {
    "id": "GRM-042",
    "level": "A1",
    "lessonIds": [
      "L06",
      "L09"
    ]
  },
  {
    "id": "GRM-043",
    "level": "A1",
    "lessonIds": [
      "L13",
      "L20"
    ]
  },
  {
    "id": "GRM-044",
    "level": "A2",
    "lessonIds": [
      "L29"
    ]
  },
  {
    "id": "GRM-045",
    "level": "A2",
    "lessonIds": [
      "L29"
    ]
  },
  {
    "id": "GRM-046",
    "level": "A2",
    "lessonIds": [
      "L32"
    ]
  },
  {
    "id": "GRM-047",
    "level": "A2",
    "lessonIds": [
      "L30"
    ]
  },
  {
    "id": "GRM-048",
    "level": "A2",
    "lessonIds": [
      "L31"
    ]
  },
  {
    "id": "GRM-049",
    "level": "A2",
    "lessonIds": [
      "L32"
    ]
  },
  {
    "id": "GRM-050",
    "level": "A2",
    "lessonIds": [
      "L33",
      "L46"
    ]
  },
  {
    "id": "GRM-051",
    "level": "A2",
    "lessonIds": [
      "L33",
      "L46"
    ]
  },
  {
    "id": "GRM-052",
    "level": "A2",
    "lessonIds": [
      "L34"
    ]
  },
  {
    "id": "GRM-053",
    "level": "A2",
    "lessonIds": [
      "L35"
    ]
  },
  {
    "id": "GRM-054",
    "level": "A2",
    "lessonIds": [
      "L35"
    ]
  },
  {
    "id": "GRM-055",
    "level": "A2",
    "lessonIds": [
      "L36"
    ]
  },
  {
    "id": "GRM-056",
    "level": "A2",
    "lessonIds": [
      "L36"
    ]
  },
  {
    "id": "GRM-057",
    "level": "A2",
    "lessonIds": [
      "L37",
      "L38"
    ]
  },
  {
    "id": "GRM-058",
    "level": "A2",
    "lessonIds": [
      "L39"
    ]
  },
  {
    "id": "GRM-059",
    "level": "A2",
    "lessonIds": [
      "L40"
    ]
  },
  {
    "id": "GRM-060",
    "level": "A2",
    "lessonIds": [
      "L41"
    ]
  },
  {
    "id": "GRM-061",
    "level": "A2",
    "lessonIds": [
      "L43"
    ]
  },
  {
    "id": "GRM-062",
    "level": "A2",
    "lessonIds": [
      "L42"
    ]
  },
  {
    "id": "GRM-063",
    "level": "A2",
    "lessonIds": [
      "L38"
    ]
  },
  {
    "id": "GRM-064",
    "level": "A2",
    "lessonIds": [
      "L46"
    ]
  },
  {
    "id": "GRM-065",
    "level": "A2",
    "lessonIds": [
      "L45"
    ]
  },
  {
    "id": "GRM-066",
    "level": "A2",
    "lessonIds": [
      "L45"
    ]
  },
  {
    "id": "GRM-067",
    "level": "A2",
    "lessonIds": [
      "L35"
    ]
  },
  {
    "id": "GRM-068",
    "level": "A2",
    "lessonIds": [
      "L37"
    ]
  },
  {
    "id": "GRM-069",
    "level": "A2",
    "lessonIds": [
      "L45"
    ]
  },
  {
    "id": "GRM-070",
    "level": "A2",
    "lessonIds": [
      "L28"
    ]
  },
  {
    "id": "GRM-071",
    "level": "A2",
    "lessonIds": [
      "L44"
    ]
  },
  {
    "id": "GRM-072",
    "level": "A2",
    "lessonIds": [
      "L47"
    ]
  }
] as GrammarRef[]);
export const UNIT_IDS:readonly string[]=Object.freeze(Array.from({length:12},(_,i)=>sourceId('lcf','unit','U'+String(i+1).padStart(2,'0'))));
export function courseSession(id:string):CourseSession|undefined{return COURSE_SESSIONS.find(x=>x.id===id);}
export function validateCourseIndex():string[]{
const errors:string[]=[];const ids=new Set<string>();
if(COURSE_SESSIONS.length!==60)errors.push('SESSION_COUNT');
if(GRAMMAR_REFS.length!==72||new Set(GRAMMAR_REFS.map(x=>x.id)).size!==72)errors.push('GRAMMAR_COUNT');
let lessons=0,reviews=0,checkpoints=0;
for(let i=0;i<COURSE_SESSIONS.length;i++){
const x=COURSE_SESSIONS[i];if(ids.has(x.id)||x.id!=='S'+String(i+1).padStart(2,'0')||x.n!==i+1)errors.push('ID_'+i);
ids.add(x.id);if(x.unit!==Math.floor(i/5)+1)errors.push('UNIT_'+x.id);
if(x.kind==='lesson')lessons++;else reviews++;if(x.checkpoint)checkpoints++;
if(x.kind==='review'&&(i+1)%5!==0)errors.push('REVIEW_'+x.id);
if(x.kind==='lesson'&&(i+1)%5===0)errors.push('LESSON_'+x.id);
if(!Number.isInteger(x.pdfPage)||x.pdfPage<1||x.pdfPage>653)errors.push('PDF_PAGE_'+x.id);
}
if(lessons!==48||reviews!==12||checkpoints!==6)errors.push('KIND_COUNTS');
return errors;
}
