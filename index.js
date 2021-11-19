const express = require('express');
const config = require('config');
const app = express();
const port = config.get('port');

app.get('/time', (req, res) => {
  res.json({ time: Date.now() });
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`)
});
