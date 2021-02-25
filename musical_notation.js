import { loadImage } from './loadImage.js'

let cachedNoteImages = null

export async function createMusicalNotation(notes) {
  const NOTE_WIDTH = 17
  const NOTE_HEIGHT = 14
  const NOTE_SPACE = 16
  const FIRST_NOTE_OFFSET = NOTE_WIDTH
  const LAST_NOTE_SPACE_RIGHT = NOTE_WIDTH

  const lineWidth = 1
  const distanceBetweenLines = 16
  const NUMBER_OF_LINES = 5
  const NUMBER_OF_LINES_ABOVE_REGULAR_LINES = 3
  const NUMBER_OF_LINES_BELOW_REGULAR_LINES = 3

  const canvas = document.createElement('canvas')
  canvas.width = FIRST_NOTE_OFFSET + LAST_NOTE_SPACE_RIGHT +
    notes.length * NOTE_WIDTH +
    (notes.length - 1) * NOTE_SPACE
  canvas.height = calculateCanvasHeight(notes)
  const context = canvas.getContext('2d')

  function calculateCanvasHeight() {
    const numberOfLines = (
      NUMBER_OF_LINES_ABOVE_REGULAR_LINES +
      NUMBER_OF_LINES +
      NUMBER_OF_LINES_BELOW_REGULAR_LINES
    )
    return numberOfLines * NOTE_HEIGHT
  }

  function drawLines() {
    for (let line = 1; line <= NUMBER_OF_LINES; line++) {
      const y = determineNoteLineY(line)
      drawFullLine(y)
    }
  }

  function drawFullLine(y) {
    drawLine(0, y, canvas.width)
  }

  function drawLine(x, y, width) {
    context.fillStyle = 'black'
    context.fillRect(x, y, width, lineWidth)
  }

  function drawNotes(notes) {
    notes.forEach(drawNote)
  }

  let noteImages
  if (cachedNoteImages) {
    noteImages = cachedNoteImages
  } else {
    noteImages = await loadNoteImages()
    cachedNoteImages = noteImages
  }

  let x = FIRST_NOTE_OFFSET

  function drawNote(note) {
    const line = determineNoteLine(note[0])
    if (line > NUMBER_OF_LINES) {
      drawNoteLine(line)
    }

    const noteImage = noteImages.get(note[1])
    const width = NOTE_WIDTH
    const height = noteImage.naturalHeight * (width / noteImage.naturalWidth)
    const y = determineNoteLineY(line) - (height - Math.ceil(0.5 * NOTE_HEIGHT))
    context.drawImage(
      noteImage,
      x,
      y,
      width,
      height
    )
    x += NOTE_SPACE
  }

  function drawNoteLine(line) {
    const lineLengthOverNoteWidth = 3
    const noteLineX = x - lineLengthOverNoteWidth
    const y = determineNoteLineY(line)
    const width = NOTE_WIDTH + 2 * lineLengthOverNoteWidth
    drawLine(noteLineX, y, width)
  }

  function determineNoteLineY(line) {
    const y = NUMBER_OF_LINES_ABOVE_REGULAR_LINES * NOTE_HEIGHT +
      (line - 1) * (lineWidth + distanceBetweenLines)
    return y
  }

  function determineNoteLine(note) {
    let line
    if (note === 'C') {
      line = 6
    } else if (note === 'D') {
      line = 5.5
    } else if (note === 'E') {
      line = 5
    } else if (note === 'F') {
      line = 4.5
    } else if (note === 'G') {
      line = 4
    } else if (note === 'A') {
      line = 3.5
    } else if (note === 'B') {
      line = 3
    }
    return line
  }

  drawLines()
  drawNotes(notes)

  return canvas
}

async function loadNoteImages() {
  const notes = await Promise.all([
    loadImage('images/notes/whole.png'),
    loadImage('images/notes/half.png'),
    loadImage('images/notes/quarter.png')
  ])

  return new Map([
    [1, notes[0]],
    [1/2, notes[1]],
    [1/4, notes[2]]
  ])
}
