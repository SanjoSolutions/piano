import { reverseMap } from './reverseMap.js'

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

const melody = [
  'C', 'D', 'E', 'F', 'G', 'G', 'A', 'A', 'A', 'A', 'G', 'A', 'A', 'A', 'A', 'G', 'F', 'F', 'F', 'F', 'E', 'E', 'D', 'D', 'D', 'D', 'C'
]

async function main() {
  const container = document.createElement('div')
  container.classList.add('note')
  document.body.appendChild(container)

  let index = 0

  function renderNote() {
    container.textContent = melody[index]
  }

  renderNote()

  const midiAccess = await navigator.requestMIDIAccess()
  const input = Array.from(midiAccess.inputs.values())[1]
  input.addEventListener('midimessage', function (event) {
    const data = event.data
    const code = data[0]
    const NOTE_ON = 144
    if (code === NOTE_ON) {
      const pitch = data[1]
      if (pitchToNote.has(pitch)) {
        const note = pitchToNote.get(pitch)
        if (note === melody[index]) {
          index++
          renderNote()
        }
      }
    }
  })
}

main()
