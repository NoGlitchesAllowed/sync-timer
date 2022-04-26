let css = new URLSearchParams(decodeURI(document.location.hash.substring(1))).get('css');
if (css) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
}

let targetOffset = null;
let offsets = [];
let ws = null;
let sentAtTimes = {};
let id = 0;
let requestOffsetTask = null;
let connected = false;

function setConnected(_connected) {
  if (_connected == connected) return;
  connected = _connected;
  if (connected)
    document.getElementById('time').classList = 'connected';
  else
    document.getElementById('time').classList = 'disconnected';
}

function requestOffset() {
  if (!ws || ws.readyState != WebSocket.OPEN) return;
  sentAtTimes[id] = Date.now();
  ws.send('' + id);
  id++;
}

function connect() {
  let protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  let host = window.location.host + window.location.pathname;
  ws = new WebSocket(`${protocol}://${host}`);
  
  ws.onopen = function() {
    requestOffset();
  }
  
  ws.onmessage = function(e) {
    let receivedAt = Date.now();
    let data = JSON.parse(e.data);
    let sentAt = sentAtTimes[data.id];
    let retry_in = data.retry_in;
    delete sentAtTimes[data.id];
    receivedOffset(data.time + ((receivedAt - sentAt) / 2) - receivedAt);
    requestOffsetTask = setTimeout(requestOffset, retry_in);
  };

  ws.onclose = function(e) {
    ws = null;
    clearTimeout(requestOffsetTask);
    setConnected(false);
    setTimeout(function() {
      connect();
    }, 1000);
  };

  ws.onerror = () => ws.close();
}
connect();

function receivedOffset(offset) {
  offsets.push(offset);
  if (offsets.length > 10) 
    offsets.shift();

  var sortedOffsets = offsets.slice().sort((a, b) => a - b);
  if (sortedOffsets.length > 2) {
    sortedOffsets = sortedOffsets.slice(1, -1);
  }

  var sum = 0;
  for(var i = 0; i < sortedOffsets.length; i++) {
    sum += sortedOffsets[i];
  }
  targetOffset = Math.floor(sum/sortedOffsets.length);
  setConnected(true);
}

let lastTimestamp = null;
function renderTime(timestamp) {
  window.requestAnimationFrame(renderTime);
  
  if (lastTimestamp == null || targetOffset == null) {
    lastTimestamp = timestamp;
    return;
  }
  
  // compensate for render delay on low FPS
  let delta = Math.floor(timestamp - lastTimestamp);
  let time = Date.now() + targetOffset + delta * 2;
  renderText(time);
  
  lastTimestamp = timestamp;
}

function renderText(time) {
  let isoString = new Date(time).toISOString();
  let t = isoString.indexOf('T');
  let sub = isoString.substring(t + 1, isoString.length - 3);
  document.getElementById('time').innerHTML = sub;
}

window.requestAnimationFrame(renderTime);
