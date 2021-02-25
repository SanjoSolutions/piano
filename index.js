import { PianoLearningProgram } from './PianoLearningProgram.js'

async function main() {
  const midiAccess = await navigator.requestMIDIAccess()
  const input = Array.from(midiAccess.inputs.values())[1]

  const domRoot = document.body

  const piano = new PianoLearningProgram(
    input,
    domRoot
  )

  await piano.run()
}

main()
