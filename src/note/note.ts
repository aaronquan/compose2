import {WebGL} from "webglmusti";

type Int32 = number;

type Comparison = -1 | 0 | 1;

export const NoteEnum = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6
}

export type Note = (typeof NoteEnum)[keyof typeof NoteEnum];

export const AccidentalEnum = {
  Flat: 0,
  None: 1,
  Sharp: 2
}

type Accidental = (typeof AccidentalEnum)[keyof typeof AccidentalEnum]

export class NoteUtil{
  private static note_string_map: Map<Note, string> = this.generateMap();
  private static accdental_string_map: Map<Accidental, string> = this.generateAccMap();
  //private static note_array = new CircularArray<Note>(enumToArray(Note)); // to add after webgl update

  static accidentalArray(): Accidental[]{
    return [AccidentalEnum.Flat, AccidentalEnum.None, AccidentalEnum.Sharp];
  }

  private static generateAccMap(){
    const map = new Map();
    map.set(AccidentalEnum.Flat, "b");
    map.set(AccidentalEnum.None, "");
    map.set(AccidentalEnum.Sharp, "#");
    return map;
  }

  private static generateMap(){
    const map = new Map();
    map.set(NoteEnum.A, "A");
    map.set(NoteEnum.B, "B");
    map.set(NoteEnum.C, "C");
    map.set(NoteEnum.D, "D");
    map.set(NoteEnum.E, "E");
    map.set(NoteEnum.F, "F");
    map.set(NoteEnum.G, "G");
    return map;
  }
  

  static stringToNote(s: string): Note{
    switch(s){
      case "A":
        return NoteEnum.A;
      case "B":
        return NoteEnum.B;
      case "C":
        return NoteEnum.C;
      case "D":
        return NoteEnum.D;
      case "E":
        return NoteEnum.E;
      case "F":
        return NoteEnum.F;
      case "G":
        return NoteEnum.G;
      default:
        return NoteEnum.A;
    }
  }

  static nextNote(n: Note): Note{
    switch(n){
      case NoteEnum.A:
        return NoteEnum.B;
      case NoteEnum.B:
        return NoteEnum.C;
      case NoteEnum.C:
        return NoteEnum.D;
      case NoteEnum.D:
        return NoteEnum.E;
      case NoteEnum.E:
        return NoteEnum.F;
      case NoteEnum.F:
        return NoteEnum.G;
      case NoteEnum.G:
        return NoteEnum.A;
      default:
        return NoteEnum.A;
    }
  }

  static previousNote(n: Note): Note{
    switch(n){
      case NoteEnum.A:
        return NoteEnum.G;
      case NoteEnum.B:
        return NoteEnum.A;
      case NoteEnum.C:
        return NoteEnum.B;
      case NoteEnum.D:
        return NoteEnum.C;
      case NoteEnum.E:
        return NoteEnum.D;
      case NoteEnum.F:
        return NoteEnum.E;
      case NoteEnum.G:
        return NoteEnum.F;
      default:
        return NoteEnum.A;
    }
  }

  static noteToString(n: Note): string{
    return this.note_string_map.get(n)!;
  }

  static accidentalToString(a: Accidental): string{
    return this.accdental_string_map.get(a)!;
  }


  /*add these to RealNoteTone class
  static numberOfAccidentalsBetweenNotes(n1: RealNoteTone, n2: RealNoteTone): Int32{
    //todo
    const cmp = NoteUtil.cmpBaseNote(n1, n2);
    if(cmp == 0) return 0;
    
  }

  static cmpBaseNote(n1: RealNoteTone, n2: RealNoteTone): Comparison{
    if(n1 === n2) return 0;
    return n1.getId() > n2.getId() ? 1 : -1;
  }*/
}

/*

0 - Ab, 1 - A, 2 - A#
3 - Bb, 4 - B, 5 - B#
6 - Cb, 7 - C, 8 - C#
9 - Db, 10 - D, 11 - D#
12 - Eb, 13 - E, 14 - E#
15 - Fb, 16 - F, 17 - F# 
18 - Gb, 19 - G, 20 - G#
*/

/*
0 - A,  1 - A#
2 - B,  3 - C
4 - C#, 5 - D
6 - D#, 7 - E
8 - F,  9 - F#
10 - G, 11 - G#
*/

type BaseNoteId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

// all possible notations of notes with every base
class RealBaseNote{
  private static notes: RealBaseNote[] = RealBaseNote.generateBaseNotes();
  static a_order: BaseNoteId[] = [1, 2, 4, 7, 8, 10, 11, 13, 16, 17, 19, 20];
  static a_order_notes: RealBaseNote[] = RealBaseNote.a_order.map((i) => RealBaseNote.notes[i]);
  static c_order: BaseNoteId[] = [7, 8, 10, 11, 13, 16, 17, 19, 20, 1, 2, 4];
  static c_order_notes: RealBaseNote[] = RealBaseNote.c_order.map((i) => RealBaseNote.notes[i]);

  private note: Note;
  private accidental: Accidental;
  private id: BaseNoteId;

  private constructor(note: Note, accidental: Accidental){
    this.note = note;
    this.accidental = accidental;
    this.id = RealBaseNote.getId(note, accidental);
  }
  isNote(n:Note): boolean{
    return n == this.note;
  }

  getNote(): Note{
    return this.note;
  }
  getAccidental(): Accidental{
    return this.accidental;
  }
  getId(): BaseNoteId{
    return this.id;
  }

  toString(): string{
    return `${NoteUtil.noteToString(this.note)}${NoteUtil.accidentalToString(this.accidental)}`;
  }

  private static generateBaseNotes(): RealBaseNote[]{
    const base_notes: RealBaseNote[] = [];
    const accidental_order = NoteUtil.accidentalArray();
    for(const note of Object.values(NoteEnum)){
      for(const accidental of accidental_order){
        base_notes.push(new RealBaseNote(note, accidental));
      }
    }
    return base_notes;
  }

  static getId(note:Note, accidental: Accidental): BaseNoteId{
    return note*3+accidental as BaseNoteId;
  }

  static getNoteFromId(id: Int32): RealBaseNote | null{
    if(id >= RealBaseNote.notes.length) return null;
    return RealBaseNote.notes[id];
  }

  static getNote(note: Note, accidental: Accidental){
    const id = RealBaseNote.getId(note, accidental);
    return this.getNoteFromId(id);
  }
}

type RealNoteId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/*
0 - A,  1 - A#
2 - B,  3 - C
4 - C#, 5 - D
6 - D#, 7 - E
8 - F,  9 - F#
10 - G, 11 - G#
*/

// all musical notes (for piano 7 white and 5 black keys)
export class RealNote{
  private static base_note_to_note_id_map: Map<BaseNoteId, RealNoteId> = new Map([
    [0, 11], [1, 0], [2, 1], [3, 1], [4, 2], [5, 3], [6, 2],
    [7, 3], [8, 4], [9, 4], [10, 5], [11, 6], [12, 6], [13, 7],
    [14, 8], [15, 7], [16, 8], [17, 9], [18, 9], [19, 10], [20, 11]
  ]);
  private static real_notes:WebGL.Utils.Array.CircularArray<RealNote> = RealNote.generateRealNotes();
  base_note: RealBaseNote;
  variant: RealBaseNote | null;
  id: RealNoteId;

  constructor(note: Note, accidental:Accidental){
    this.base_note = RealBaseNote.getNote(note, accidental)!;
    this.variant = this.getVariant();
    this.id = RealNote.getId(note, accidental);
  }

  isNote(n:Note): boolean{
    return this.base_note.isNote(n);
  }

  private static generateRealNotes(): WebGL.Utils.Array.CircularArray<RealNote>{
    return new WebGL.Utils.Array.CircularArray<RealNote>(RealBaseNote.a_order.map((i) => {
      const rbn = RealBaseNote.getNoteFromId(i)!;
      return new RealNote(rbn.getNote(), rbn.getAccidental());
    }));

  }
  interval(interval: Int32): RealNote{
    return RealNote.real_notes.get(this.id+interval);
  }

  isAccidental(){
    return this.base_note.getAccidental() != AccidentalEnum.None;
  }

  static hasFlat(n: Note): boolean{
    return n == NoteEnum.A || n == NoteEnum.C || n == NoteEnum.D || n == NoteEnum.F || n == NoteEnum.G;
  }

  static hasSharp(n: Note): boolean{
    return n == NoteEnum.A || n == NoteEnum.B || n == NoteEnum.D || n == NoteEnum.E || n == NoteEnum.G;
  }

  getVariant(){
    const n_note = NoteUtil.nextNote(this.base_note.getNote());
    const p_note = NoteUtil.previousNote(this.base_note.getNote());
    if(this.base_note.getAccidental() == AccidentalEnum.None){
      if(!RealNote.hasFlat(n_note)){
        return RealBaseNote.getNote(n_note, AccidentalEnum.Flat);
      }
      if(!RealNote.hasSharp(p_note)){
        return RealBaseNote.getNote(p_note, AccidentalEnum.Sharp);
      }
    }
    else if(this.base_note.getAccidental() == AccidentalEnum.Sharp){
      if(RealNote.hasFlat(n_note)){
        return RealBaseNote.getNote(n_note, AccidentalEnum.Flat);
      }
    }
    else{
      if(RealNote.hasSharp(p_note)){
        return RealBaseNote.getNote(p_note, AccidentalEnum.Sharp);
      }
    }
    return null;
  }
  toString(): string{
    return `${this.base_note.toString()}`;
  }

  static getRealNoteFromId(id: Int32): RealNote{
    return RealNote.real_notes.get(id);
  }

  static getRealNoteFromBaseNote(base_note: RealBaseNote): RealNote{
    const base_id = base_note.getId();
    return this.getRealNoteFromId(RealNote.base_note_to_note_id_map.get(base_id)!);
  }

  static getId(note:Note, accidental:Accidental): RealNoteId{
    const id = RealBaseNote.getId(note, accidental);
    return RealNote.base_note_to_note_id_map.get(id)!;
  }
  static getRealNote(note: Note, accidental:Accidental){
    const id = RealNote.getId(note, accidental);
    return this.getRealNoteFromId(id);
  }
}

//https://mixbutton.com/music-tools/frequency-and-pitch/music-note-to-frequency-chart

//notes C -> D -> E -> F -> G -> A -> B -> C

export class RealNoteTone{
  static note_tones: Map<Int32, RealNoteTone> = RealNoteTone.generateRealNoteTones();
  static A4_id: Int32 = 57;
  static AToneFrequency = 440;
  note: RealNote;
  octave: Int32;
  id: Int32;
  constructor(rn: RealNote, octave: Int32){
    this.note = rn;
    this.octave = octave;
    this.id = RealNoteTone.getNoteId(rn, octave);
  }

  static getNoteId(real_note: RealNote, octave: Int32): Int32{
    if(real_note.isNote(NoteEnum.A) || real_note.isNote(NoteEnum.B)){
      return real_note.id+9  + octave * 12;
    }
    const id = real_note.id-3 + octave * 12;
    return id;
  }
  static generateRealNoteTones(): Map<Int32, RealNoteTone>{
    let note = RealNote.getRealNote(NoteEnum.C, AccidentalEnum.None);
    const note_tones = new Map<Int32, RealNoteTone>();
    for(let i = 0; i < 88; i++){
      const octave = Math.floor((i) / 12);
      note_tones.set(i, new RealNoteTone(note, octave));
      note = note.interval(1);
    }
    return note_tones;
  }
  getFrequency(){
    const freq_mod = this.id-RealNoteTone.A4_id;
    return RealNoteTone.shiftTone(RealNoteTone.AToneFrequency, freq_mod);
  }
  static shiftTone(tone: Int32, shift: Int32):Int32{
    return tone*Math.pow(2, shift/12);
  }
  toString(): string{
    return `${this.note.toString()}${this.octave}`;
  }

  distance(note: RealNoteTone): Int32{
    return Math.abs(note.id - this.id);
  }

  octaveDistance(note: RealNoteTone): Int32{
    return Math.floor(this.distance(note)/12);
  }

  compare(note: RealNoteTone): Comparison{
    if(note.id == this.id) return 0;
    return this.id > note.id ? 1 : -1;
  }

  blackNotesBetween(note: RealNoteTone): Int32{
    const cmp = this.compare(note);
    if(cmp == 0) return 0;
    const octaves = this.octaveDistance(note);
    let lower: RealNoteTone = RealNoteTone.getNoteToneFromId(this.id+1+octaves*12);
    let higher: RealNoteTone = note;
    if(cmp == 1){
      lower = RealNoteTone.getNoteToneFromId(note.id+1+octaves*12);
      higher = this;
    }
    let blks = 0;
    while(lower.id < higher.id){
      if(lower.note.isAccidental()){
        blks++;
      }
      lower = RealNoteTone.getNoteToneFromId(lower.id+1);
    }
    return octaves*5 + blks;
  }

  getNoteWhiteNotesAbove(notes: Int32): RealNoteTone{
    const octaves = Math.floor(notes/7);
    const rem = notes % 7;
    let i = 0;
    let tone = RealNoteTone.getNoteToneFromId(this.id+octaves*12);
    while(i < rem){
      tone = RealNoteTone.getNoteToneFromId(tone.id+1);
      if(!tone.note.isAccidental()){
        i++;
      }
    }
    return tone;
  }

  static getOctaveFromId(id: Int32){
    return Math.floor(id / 12);
  }

  private static addNoteTone(id: Int32){
    const octave = Math.floor(id / 12);
    const note = RealNote.getRealNote(NoteEnum.A, AccidentalEnum.None).interval(id);
    RealNoteTone.note_tones.set(id, new RealNoteTone(note, octave));
  }

  static getNoteToneFromId(id: Int32): RealNoteTone{
    if(!this.note_tones.has(id)){
      this.addNoteTone(id);
    }
    return this.note_tones.get(id)!;
  }

  static getNoteToneFromRealNoteAndOctave(rn: RealNote, octave: Int32): RealNoteTone{
    const id = RealNoteTone.getNoteId(rn, octave);
    return RealNoteTone.getNoteToneFromId(id);
  }

  static getNoteToneFromNoteAndOctave(note: Note, acc: Accidental, octave: Int32): RealNoteTone{
    const real_note = RealNote.getRealNoteFromId(RealNote.getId(note, acc));
    const id = RealNoteTone.getNoteId(real_note, octave);
    return RealNoteTone.getNoteToneFromId(id);
  }
}