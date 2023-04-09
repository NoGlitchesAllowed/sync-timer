import * as params from './params'
interface Formatter {
  length: number
  format: (rawTime: number) => string
}

class TimeFormatter implements Formatter {
  length = 10
  format (rawTime: number) {
    return new Date(rawTime).toISOString().substring(11, 21)
  }
}

class CounterFormatter implements Formatter {
  length = Math.ceil(Math.log10(params.counterRollover * params.counterN))
  mod = Math.pow(10, this.length)
  format (rawTime: number) {
    const time = Math.floor(rawTime * params.counterN / 1000) % this.mod
    return time.toString().padStart(this.length, '0')
  }
}

const formatter = new (params.isCounter ? CounterFormatter : TimeFormatter)()
export default formatter
