import { onOffset, onDisconnect } from '.'

function connect () {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const host = window.location.host + window.location.pathname
  const ws = new WebSocket(`${protocol}://${host}`)

  ws.onmessage = (e) => {
    const now = Date.now()
    const [op, data] = JSON.parse(e.data)
    if (op === 0) {
      ws?.send(JSON.stringify([data, now]))
    }

    if (op === 1) {
      onOffset(data)
    }
  }

  ws.onclose = () => {
    onDisconnect()
    setTimeout(connect, 1000)
  }
}
connect()
