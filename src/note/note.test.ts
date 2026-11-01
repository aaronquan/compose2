import { expect, test } from 'vitest';
import * as Note from "./note";

test("realnotetone", () => {
  const start = Note.RealNoteTone.getNoteToneFromNoteAndOctave(Note.NoteEnum.A, Note.AccidentalEnum.None, 0);
  const end = Note.RealNoteTone.getNoteToneFromNoteAndOctave(Note.NoteEnum.C, Note.AccidentalEnum.None, 2);
  expect(start.blackNotesBetween(end)).toBe(6);

  const end2 = Note.RealNoteTone.getNoteToneFromNoteAndOctave(Note.NoteEnum.F, Note.AccidentalEnum.Sharp, 2);
  expect(start.blackNotesBetween(end2)).toBe(8);

  const av = start.getNoteWhiteNotesAbove(4);
  expect(av.toString()).toBe("E1");

  const av2 = end2.getNoteWhiteNotesAbove(4);
  expect(av2.toString()).toBe("C3");
  const av3 = end2.getNoteWhiteNotesAbove(11);
  expect(av3.toString()).toBe("C4");
});