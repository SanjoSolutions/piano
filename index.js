import { Piano } from './Piano.js'

async function main() {
  const midiAccess = await navigator.requestMIDIAccess()
  const input = Array.from(midiAccess.inputs.values())[1]

  const root = document.body

  const noteContainer = createNoteContainer()
  root.appendChild(noteContainer)

  const musicalNotationContainer = createMusicalNotationContainer()
  root.appendChild(musicalNotationContainer)

  const piano = new Piano(
    input,
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
