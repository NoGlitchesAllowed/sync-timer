import formatter from './formatter'
import { getTextToRender } from '.'

const canvas = document.getElementsByTagName('canvas')[0]
let ctx = canvas.getContext('2d')!
export function setColor (color: string) {
  ctx.fillStyle = color
}

let fontSize = 0
let lastTimestamp: number | undefined
let lastRenderedText: string | undefined
window.addEventListener('resize', () => handleResize())
function handleResize () {
  lastRenderedText = undefined
  const lastFillStyle = ctx.fillStyle

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx = canvas.getContext('2d')!
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = lastFillStyle

  const maxFontSizeHeight = canvas.height * 1.2
  const maxFontSizeWidth = canvas.width / (0.6 * formatter.length)
  fontSize = Math.min(maxFontSizeHeight, maxFontSizeWidth)
  ctx.font = `${fontSize}px Roboto Mono`
}
handleResize()

function onFrame (timestamp: number) {
  try {
    window.requestAnimationFrame(onFrame)
    if (lastTimestamp === undefined) return
    const text = getTextToRender(timestamp - lastTimestamp)
    if (text === undefined || lastRenderedText === text) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + fontSize / 15)
  } finally {
    lastTimestamp = timestamp
  }
}
window.requestAnimationFrame(onFrame)
