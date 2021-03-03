const express = require('express');
const http = require('http');

const port = process.env.PORT || 4001;
const index = require('./routes/index');

const app = express();
app.use(index);

const server = http.createServer(app);

const options = {
  cors: true,
  origins: ['http://127.0.0.1:5347'],
};

const io = require('socket.io')(server, options);
io.on('connection', (socket) => {
  /* ... */
});

let interval;

io.on('connection', (socket) => {
  console.log('New client connected');
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit('FromAPI', response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
