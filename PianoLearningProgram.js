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

export class PianoLearningProgram {
  constructor(midiInput, domRoot) {
    this.midiInput = midiInput
    this.domRoot = domRoot
    this.index = 0

    this._onMidiMessage = this._onMidiMessage.bind(this)
  }

  async run() {
    this._createDOM()
    await this._renderCurrentNote()
    this.midiInput.addEventListener('midimessage', this._onMidiMessage)
  }

  _createDOM() {
    this.container = this._createContainer()
    this.noteContainer = this._createNoteContainer()
    this.musicalNotationContainer = this._createMusicalNotationContainer()

    this.container.appendChild(this.noteContainer)
    this.container.appendChild(this.musicalNotationContainer)
    this.domRoot.appendChild(this.container)
  }

  _createContainer() {
    const container = document.createElement('div')
    container.classList.add('container')
    return container
  }

  _createNoteContainer() {
    const container = document.createElement('div')
    container.classList.add('note')
    return container
  }

  _createMusicalNotationContainer() {
    const container = document.createElement('div')
    container.classList.add('musical-notation')
    return container
  }

  async _renderCurrentNote() {
    if (this._isMelodyInProgress()) {
      await this._renderNote(this._getCurrentNote())
    } else {
      this._clearOutput()
    }
  }

  _isMelodyInProgress() {
    return this.index < melody.length
  }

  _getCurrentNote() {
    return melody[this.index]
  }

  async _renderNote(note) {
    const noteName = note[0]
    this._updateNote(noteName)
    await this._updateMusicalNotation(note)
  }

  _updateNote(noteName) {
    this.noteContainer.textContent = noteName
  }

  async _updateMusicalNotation(note) {
    const musicalNotation = await createMusicalNotation([note])
    this.musicalNotationContainer.innerHTML = ''
    this.musicalNotationContainer.appendChild(musicalNotation)
  }

  _clearOutput() {
    this._clearNote()
    this._clearMusicalNotation()
  }

  _clearNote() {
    this.noteContainer.textContent = ''
  }

  _clearMusicalNotation() {
    this.musicalNotationContainer.innerHTML = ''
  }

  async _onMidiMessage (midiMessageEvent) {
    if (this._isNoteOnMidiMessageEvent(midiMessageEvent)) {
      await this._onNoteOn(midiMessageEvent)
    }
  }

  _isNoteOnMidiMessageEvent(midiMessageEvent) {
    const midiData = midiMessageEvent.data
    const command = midiData[0]
    return this._isNoteOnCommand(command)
  }

  async _onNoteOn(midiMessageEvent) {
    if (this._isCurrentMelodyNotePlayed(midiMessageEvent)) {
      this._nextNote()
    }
  }

  _isCurrentMelodyNotePlayed(midiMessageEvent) {
    const playedNoteName = MidiMessageEvent.getNoteName(midiMessageEvent)
    const currentNoteName = this._getCurrentNoteName()
    return playedNoteName === currentNoteName
  }

  _isNoteOnCommand(command) {
    const NOTE_ON = 144
    return command === NOTE_ON
  }

  _getCurrentNoteName() {
    return this._getNoteName(this._getCurrentNote())
  }

  _getNoteName(note) {
    return note[0]
  }

  async _nextNote() {
    this.index++
    await this._renderCurrentNote()
  }
}
