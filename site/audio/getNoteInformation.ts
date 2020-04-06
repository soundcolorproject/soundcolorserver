
import { Note } from '../state/patternsStore'

export interface NoteInfo {
  note: Note
  cents: number
  octave: number
}

const NOTES: Note[] = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
export function getNoteInformation (frequency: number): NoteInfo {
  let noteVal = Math.log2(frequency / 27.5) * 12
  if (noteVal < 0) {
    noteVal += 12 * Math.floor((noteVal / -12) + 1)
  }
  const noteNumber = Math.round(noteVal)
  const cents = (noteVal - noteNumber) * 100
  const note = NOTES[(noteNumber + 12) % 12]
  const octave = Math.floor(noteNumber / 12)

  return {
    note: note,
    cents: cents,
    octave: octave,
  }
}
