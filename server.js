const express = require("express");
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const router = require('./router');

const app = express();
app.use(cors());

const httpServer = http.createServer(app);

const io = socketio(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

const PORT = process.env.PORT || 5000;

app.use(router);


io.on('connection', (socket) => {
    console.log('New connection');
    socket.on('join', ({ name, room }, callback) => {
        console.log(name, room);
        const error = true;
        if (error) {
            callback({ error: "e" })
        }
    })
    socket.on('disconnect', () => {
        console.log('User left');
    })
})


httpServer.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});