const express = require('express');
const config = require('config');
const ws = require('ws');

const app = express();

app.use(express.static('public'));
const port = config.get('port');
const server = app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`)
});

const wsServer = new ws.Server({ noServer: true });
const retryInBounds = config.get('retry_in');
server.on('upgrade', (request, socket, head) => {
  // this technically allows people to inject the header if the proxy can be bypassed
  // NOFIX since this is just used for logging
  let ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, ip);
  });
});

wsServer.on('connection', (socket, ip) => {
  function log(message) {
    console.log(`${ip}: ${message} (${wsServer.clients.size} clients connected)`);
  }

  log('Connected');
  socket.on('close', () => log('Disconnected'));
  
  socket.on('message', buffer => {
    let message = buffer.toString();
    let id = parseInt(message);
    let time = Date.now();
    let retry_in = 10 * wsServer.clients.size;
    retry_in = Math.max(retryInBounds.min, retry_in);
    retry_in = Math.min(retryInBounds.max, retry_in);
    socket.send(JSON.stringify({id, time, retry_in}));
  });
});