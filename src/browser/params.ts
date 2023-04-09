const params = new URLSearchParams(window.location.search.substring(1))
export default params
function parseNumber (
  paramName: string,
  defaultValue: number,
  minimum?: number,
  maximum?: number
) {
  const param = params.get(paramName)
  let num = defaultValue
  if (param !== null) num = parseFloat(param)
  if (Number.isNaN(num)) num = defaultValue
  if (minimum !== undefined && num < minimum) num = minimum
  if (maximum !== undefined && num > maximum) num = maximum
  return num
}

export const offset = parseNumber('offset', 0)
export const isCounter = params.get('counter') !== null
export const counterN = parseNumber('counter', 10, 1, 1000)
export const counterRollover = parseNumber('rollover', 1000, 1, Infinity)
export const colors = {
  connected: params.get('connected') || 'white',
  disconnected: params.get('disconnected') || 'red',
  background: params.get('background') || 'black'
}
