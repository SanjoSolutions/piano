import { createMusicalNotation } from './musical_notation.js'
import { reverseMap } from './reverseMap.js'

const keys = new Map([
  // [<note name>, <MIDI note number>]
  ['C', 48],
  ['D', 50],
  ['E', 52],
  ['F', 53],
  ['G', 55],
  ['A', 57],
  ['B', 59],
])

const midiNumberToNoteName = reverseMap(keys)

// tempo: … BPM
// time signature: 4/4
const melody = [
  // [<note name>, <note length>]
  ['C', 1/4],
  ['D', 1/4],
  ['E', 1/4],
  ['F', 1/4],
  ['G', 1/2],
  ['G', 1/2],
  ['A', 1/4],
  ['A', 1/4],
  ['A', 1/4],
  ['A', 1/4],
  ['G', 1],
  ['A', 1/4],
  ['A', 1/4],
  ['A', 1/4],
  ['A', 1/4],
  ['G', 1],
  ['F', 1/4],
  ['F', 1/4],
  ['F', 1/4],
  ['F', 1/4],
  ['E', 1/2],
  ['E', 1/2],
  ['D', 1/4],
  ['D', 1/4],
  ['D', 1/4],
  ['D', 1/4],
  ['C', 1],
]

const MidiMessageEvent = {
  getNoteName(midiMessageEvent) {
    const midiData = midiMessageEvent.data
    const number = midiData[1]
    return midiNumberToNoteName.get(number)
  }
}

class Piano {
  constructor(noteContainer, musicalNotationContainer) {
    this.noteContainer = noteContainer
    this.musicalNotationContainer = musicalNotationContainer
    this.index = 0

    this.onMidiMessage = this.onMidiMessage.bind(this)
  }

  async run() {
    await this.renderCurrentNote()

    const midiAccess = await navigator.requestMIDIAccess()
    const input = Array.from(midiAccess.inputs.values())[1]
    input.addEventListener('midimessage', this.onMidiMessage)
  }

  async renderCurrentNote() {
    if (this.isMelodyInProgress()) {
      await this.renderNote(this.getCurrentNote())
    } else {
      this.clearOutput()
    }
  }

  isMelodyInProgress() {
    return this.index < melody.length
  }

  getCurrentNote() {
    return melody[this.index]
  }

  async renderNote(note) {
    const noteName = note[0]
    this.updateNote(noteName)
    await this.updateMusicalNotation(note)
  }

  updateNote(noteName) {
    this.noteContainer.textContent = noteName
  }

  async updateMusicalNotation(note) {
    const musicalNotation = await createMusicalNotation([note])
    this.musicalNotationContainer.innerHTML = ''
    this.musicalNotationContainer.appendChild(musicalNotation)
  }

  clearOutput() {
    this.clearNote()
    this.clearMusicalNotation()
  }

  clearNote() {
    this.noteContainer.textContent = ''
  }

  clearMusicalNotation() {
    this.musicalNotationContainer.innerHTML = ''
  }

  async onMidiMessage (midiMessageEvent) {
    if (this.isNoteOnMidiMessageEvent(midiMessageEvent)) {
      await this.onNoteOn(midiMessageEvent)
    }
  }

  isNoteOnMidiMessageEvent(midiMessageEvent) {
    const midiData = midiMessageEvent.data
    const command = midiData[0]
    return this.isNoteOnCommand(command)
  }

  async onNoteOn(midiMessageEvent) {
    if (this.isCurrentMelodyNotePlayed(midiMessageEvent)) {
      this.nextNote()
    }
  }

  isCurrentMelodyNotePlayed(midiMessageEvent) {
    const playedNoteName = MidiMessageEvent.getNoteName(midiMessageEvent)
    const currentNoteName = this.getCurrentNoteName()
    return playedNoteName === currentNoteName
  }

  isNoteOnCommand(command, NOTE_ON) {
    const NOTE_ON = 144
    return command === NOTE_ON
  }

  getCurrentNoteName() {
    return this.getNoteName(this.getCurrentNote())
  }

  getNoteName(note) {
    return note[0]
  }

  nextNote() {
    this.index++
    await this.renderCurrentNote()
  }
}

async function main() {
  const root = document.body

  const noteContainer = createNoteContainer()
  root.appendChild(noteContainer)

  const musicalNotationContainer = createMusicalNotationContainer()
  root.appendChild(musicalNotationContainer)

  const piano = new Piano(
    noteContainer,
    musicalNotationContainer
  )

  await piano.run()
}

function createNoteContainer() {
  const container = document.createElement('div')
  container.classList.add('note')
  return container
}

function createMusicalNotationContainer() {
  return document.createElement('div')
}

main()
