import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 80;

const app: Express = express();

app.get('/', (req, res) => {
    res.send('The server is up and running!');
});

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

// socket server

import { Server, Socket } from 'socket.io';

const io = new Server(server, {
    cors: {
        origin: 'http://127.0.0.1:5173'
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    }
});

const clientsInRoom: object = {};
const existingRooms: string[] = [];

io.on('connection', (socket: Socket) => {
    socket.on('reqTurn', (roomData) => {
        const room: string = roomData.room;
        io.to(room).emit('playerTurn', roomData);
    })

    socket.on('addNewRoom', room => {
        existingRooms.push(room);
        console.log(`Existing rooms: ${existingRooms}`)
    })

    socket.on('createRoom', room => {
        if (io.sockets.adapter.rooms.has(room) || !existingRooms.includes(room)){
            socket.emit('error_invalid_room_code'); 
        } else {
            socket.join(room);
            clientsInRoom[room] = io.sockets.adapter.rooms.get(room)?.size;
            console.log(`New room: ${room}`)
        }
    })

    socket.on('joinRoom', room => {
        if (io.sockets.adapter.rooms.has(room)){
            clientsInRoom[room] = io.sockets.adapter.rooms.get(room)?.size
            if (clientsInRoom[room] === 1){
                io.to(room).emit('opponent_joined_alert');
                socket.join(room);
                io.to(room).emit('opponent_joined');
            } else {
                socket.emit('error_room_is_full');
            }
        } else {
            socket.emit('error_invalid_room_code'); 
        }
    })

    socket.on('reqRestart', room => {
        io.to(room).emit('restartRoom');
    })

    socket.on('updateRoom', room => {
        const players: number | undefined = io.sockets.adapter.rooms.get(room)?.size;
        if (players === 1){
            io.to(room).emit('pauseGame');
        }
    })

    socket.on("disconnecting", () => {
        const room: string = updateRooms();
        io.to(room).emit("gameStatus");
    });

    socket.on("manualDisconnect", () => {
        const room: string = updateRooms();
        socket.leave(room);
        io.to(room).emit("gameStatus");
    });

    const updateRooms = () => {
        const socketRooms: string[] = Array.from(socket.rooms);
        const room: string = socketRooms[1];
        if ( io.sockets.adapter.rooms.get(room)?.size === 1 ){
            const index: number = existingRooms.indexOf(room);
            if (index > -1) { 
                existingRooms.splice(index, 1);
            }
        }
        return room;
    }
})
