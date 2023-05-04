import ws from 'ws'
import config from './config'

const burstCount = 10
class Client {
  static activeCount = 0
  socket: ws.WebSocket
  sentAtTimes = new Map<number, number>()
  offsets: number[] = []
  lastSentOffset?: number
  nextRequestId = 0
  closed = false
  firstMessage = true

  constructor (socket: ws.WebSocket) {
    this.socket = socket
    console.info(`Socket connected (now ${++Client.activeCount} sockets)`)
    socket.on('close', () => {
      this.closed = true
      console.info(`Socket disconnected (now ${--Client.activeCount} sockets)`)
    })

    socket.on('message', (buffer) => {
      this.onMessage(buffer as Buffer)
    })

    this.requestLoop()
  }

  send (...data: any[]) {
    if (this.closed) return
    this.socket.send(JSON.stringify(data))
  }

  async requestLoop (i = 1) {
    if (this.closed) return

    const now = Date.now()
    const requestId = this.nextRequestId++
    this.send(0, requestId)
    this.sentAtTimes.set(requestId, now)

    if (i === burstCount) {
      let ms = config.updateIntervals.addPerClient * Client.activeCount
      ms = Math.max(config.updateIntervals.minimum, ms)
      ms = Math.min(config.updateIntervals.maximum, ms)
      setTimeout(() => this.requestLoop(), ms)
    } else {
      await new Promise(resolve => setTimeout(resolve, 50))
      this.requestLoop(i + 1)
    }
  }

  onMessage (buffer: Buffer) {
    try {
      this.handleSocketMessage(buffer)
    } catch (error) {
      this.socket.close(1008)
      console.error(error)
    } finally {
      this.firstMessage = false
    }
  }

  handleSocketMessage (buffer: Buffer) {
    const serverTime = Date.now()
    const message = buffer.toString()
    const [id, clientSendTime] = JSON.parse(message)
    const serverSendTime = this.sentAtTimes.get(id)
    if (serverSendTime === undefined) { return }
    this.sentAtTimes.delete(id)

    const delay = serverTime - serverSendTime
    const clientTime = clientSendTime + (delay / 2)
    const offset = serverTime - clientTime

    this.offsets.push(offset)
    const burstFinished = this.offsets.length >= burstCount
    if (this.firstMessage || burstFinished) {
      const offsetsSum = this.offsets.reduce((a, b) => a + b, 0)
      const averageOffset = Math.round(offsetsSum / this.offsets.length)
      if (this.lastSentOffset === averageOffset) { return }
      this.lastSentOffset = averageOffset
      this.send(1, averageOffset)
    }

    if (burstFinished) {
      this.offsets = []
    }
  }
}
export default Client
