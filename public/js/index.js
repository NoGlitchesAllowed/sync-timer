var targetOffset = null;
var displayOffset = null;
var div = document.getElementById("time");
var offsets = [];

function requestOffset() {
  var request = new XMLHttpRequest();
  var sentAt, receivedAt;

  request.open("GET", "/time");
  request.onreadystatechange = function() {
    if ((this.status == 200) && (this.readyState == this.HEADERS_RECEIVED)) {
      receivedAt = Date.now();
    }
  };

  request.onload = function() {
    if (this.status == 200) {
      try {
        receivedOffset(JSON.parse(this.response).time + ((receivedAt - sentAt) / 2) - receivedAt);
      } catch (e) {
        console.log(e);
      }
    }
  };

  sentAt = Date.now();
  request.send();
}

function receivedOffset(offset) {
  // keep only last 20
  offsets.push(offset);
  if (offsets.length > 10) {
    offsets.shift();
  }

  // remove outliers
  var sortedOffsets = offsets.slice().sort(function(a, b) {
    return a - b;
  });
  if (sortedOffsets.length > 10) {
    sortedOffsets = sortedOffsets.slice(1, -1);
  }
  if (sortedOffsets.length > 2) {
    sortedOffsets = sortedOffsets.slice(1, -1);
  }

  var sum = 0;
  for(var i = 0; i < sortedOffsets.length; i++) {
    sum += sortedOffsets[i];
  }
  targetOffset = Math.floor(sum/sortedOffsets.length);
}

function updateDisplayOffset() {
  if (targetOffset == null) {
    return;
  }

  if (displayOffset == null) {
    displayOffset = targetOffset;
    return;
  }

  var difference = targetOffset - displayOffset;
  var absoluteDifference = Math.abs(difference);
  if (absoluteDifference > 1000 || absoluteDifference < 50) {
    displayOffset = targetOffset;
    return;
  }

  if (difference > 0) {
    displayOffset = displayOffset + 50;
  } else {
    displayOffset = displayOffset - 50;
  }
}

function updateDisplayedTime() {
  if (displayOffset != null) {
    // kind of a horrible hack but meh
    var isoString = new Date(Date.now() + displayOffset).toISOString();
    var tIndex = isoString.indexOf('T');
    div.innerHTML = isoString.substring(tIndex + 1, isoString.length - 3);
  }

  window.requestAnimationFrame(updateDisplayedTime);
}

setInterval(requestOffset, 1000);
setInterval(updateDisplayOffset, 100);
window.requestAnimationFrame(updateDisplayedTime);
