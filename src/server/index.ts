import express from 'express'
import ws from 'ws'
import config from './config'
import Client from './client'

const app = express()
app.use(express.static('build/browser'))
const server = app.listen(config.port, () => {
  console.info(`Running at http://localhost:${config.port}`)
})

const wsServer = new ws.Server({ noServer: true })
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request)
  })
})

wsServer.on('connection', (socket) => new Client(socket))
