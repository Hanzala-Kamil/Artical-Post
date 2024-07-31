const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const socketsMessage = require('./controller/sendMessage')

const app = express();
const router = require('./routes/authRoutes');
const connectMongo = require('./config/db');

connectMongo();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/upload', express.static(path.join(__dirname, 'uploads')));
app.use('/', router);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

socketsMessage(io);

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
