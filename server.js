const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

// Command debouncing variables
let isProcessingCommand = false;
const DEBOUNCE_TIME = 2000; // 2 seconds in milliseconds

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Function to handle command processing
function handleCommand(command) {
  console.log('Processing command:', command);
  if (!isProcessingCommand) {
    if (command === 'L' || command === 'R') {
      isProcessingCommand = true;
      if (command === 'L') {
        io.emit('flip', 'next');
      } else if (command === 'R') {
        io.emit('flip', 'previous');
      }
      setTimeout(() => {
        isProcessingCommand = false;
        console.log('Ready for next command');
      }, DEBOUNCE_TIME);
    }
  } else {
    console.log('Command ignored - within debounce period');
  }
}

// Check if Serial Port should be used
const useSerialPort = true;
if (useSerialPort) {
  const { SerialPort } = require('serialport');
  const serialPort = new SerialPort({
    path: 'COM6',
    baudRate: 115200
  });

  serialPort.on('open', () => {
    console.log('Serial Port Opened');
  });

  serialPort.on('data', (data) => {
    const command = data.toString().trim();
    if (command) {
      console.log('Received command from Serial Port:', command);
      handleCommand(command);
    }
  });

  serialPort.on('error', (err) => {
    console.error('Serial Port Error:', err);
  });
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('keyCommand', (command) => {
    console.log('Received key command from Client:', command);
    handleCommand(command);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Flipbook with Serial/Keyboard Control' });
});

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
