import { reverseMap } from './reverseMap.js'
import { createMusicalNotation } from './musical_notation.js'

const keys = new Map([
  ['C', 48],
  ['D', 50],
  ['E', 52],
  ['F', 53],
  ['G', 55],
  ['A', 57],
  ['B', 59],
])

const pitchToNote = reverseMap(keys)

// tempo: … BPM
// time signature: 4/4
const melody = [
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

async function main() {
  const container = document.createElement('div')
  container.classList.add('note')
  document.body.appendChild(container)

  const musicalNotationContainer = document.createElement('div')
  document.body.appendChild(musicalNotationContainer)

  let index = 0

  async function renderNote() {
    if (index < melody.length) {
      const note = melody[index]
      container.textContent = note[0]

      const musicalNotation = await createMusicalNotation([note])
      musicalNotationContainer.innerHTML = ''
      musicalNotationContainer.appendChild(musicalNotation)
    } else {
      container.textContent = ''
      musicalNotationContainer.innerHTML = ''
    }
  }

  await renderNote()

  const midiAccess = await navigator.requestMIDIAccess()
  const input = Array.from(midiAccess.inputs.values())[1]
  input.addEventListener('midimessage', async function (event) {
    const data = event.data
    const code = data[0]
    const NOTE_ON = 144
    if (code === NOTE_ON) {
      const pitch = data[1]
      if (pitchToNote.has(pitch)) {
        const note = pitchToNote.get(pitch)
        if (note === melody[index][0]) {
          index++
          await renderNote()
        }
      }
    }
  })
}

main()
