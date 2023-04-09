import { offset as artificialOffset, colors } from './params'
import formatter from './formatter'
import { setColor } from './canvas'
import './connection'

document.body.style.background = colors.background
setColor(colors.disconnected)
let offset = 0
export function onOffset (_offset: number) {
  offset = _offset
  setColor(colors.connected)
}
export function onDisconnect () {
  setColor(colors.disconnected)
}
export function getTextToRender (frameTime: number) {
  const rawTime = (Date.now() + (offset || 0) + artificialOffset + frameTime * 2)
  return formatter.format(rawTime)
}
