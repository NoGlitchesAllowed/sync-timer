function parseArtificialOffset () {
  const params = new URLSearchParams(window.location.search.substring(1))
  const param = params.get('offset')
  if (param === null) return 0
  const num = parseInt(param)
  return Number.isNaN(num) ? 0 : num
}
export const artificialOffset = parseArtificialOffset()