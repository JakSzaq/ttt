import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 80;

const app: Express = express();

app.get("/", (req, res) => {
  res.send("The server is up and running!");
});

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

// socket server

import { Server, Socket } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

const clientsInRoom: object = {};
const existingRooms: string[] = [];

io.on("connection", (socket: Socket) => {
  socket.on("reqMove", (roomData) => {
    const room: string = roomData.room;
    io.to(room).emit("playerMove", roomData);
  });

  socket.on("addNewRoom", (room) => {
    existingRooms.push(room, room);
    console.log(`Existing rooms: ${existingRooms}`);
  });

  socket.on("joinRoom", (room) => {
    console.log(existingRooms);
    if (existingRooms.includes(room)) {
      clientsInRoom[room] = io.sockets.adapter.rooms.get(room)?.size;
      if (clientsInRoom[room] === undefined) {
        socket.join(room);
        console.log(`New room: ${room}`);
        socket.emit("setFirstPlayer", room);
      } else if (clientsInRoom[room] === 1) {
        io.to(room).emit("opponentJoinedAlert");
        socket.join(room);
        io.to(room).emit("opponentJoined");
        socket.emit("setSecondPlayer", room);
      } else {
        socket.emit("errorRoomIsFull");
      }
    } else {
      socket.emit("errorInvalidRoomCode");
    }
  });

  socket.on("checkIfRoomExistsOrIsFull", (roomCode) => {
    if (existingRooms.includes(roomCode)) {
      clientsInRoom[roomCode] = io.sockets.adapter.rooms.get(roomCode)?.size;
      clientsInRoom[roomCode] === 2 ? socket.emit("roomResponse", "roomIsFull") : socket.emit("roomResponse", roomCode);
    } else {
      socket.emit("roomResponse", "roomIsNonexistent");
    }
  });

  socket.on("reqRestart", (room) => {
    io.to(room).emit("restartRoom");
  });

  socket.on("updateRoom", (room) => {
    const players: number | undefined = io.sockets.adapter.rooms.get(room)?.size;
    if (players === 1) {
      io.to(room).emit("opponentLeft");
    }
  });

  socket.on("disconnecting", () => {
    const room: string = updateRooms();
    io.to(room).emit("gameStatusChanged");
  });

  socket.on("manualDisconnect", () => {
    const room: string = updateRooms();
    socket.leave(room);
    io.to(room).emit("gameStatusChanged");
  });

  const updateRooms = () => {
    const socketRooms: string[] = Array.from(socket.rooms);
    const room: string = socketRooms[1];
    if (io.sockets.adapter.rooms.get(room)?.size === 1) {
      const index: number = existingRooms.indexOf(room);
      if (index > -1) {
        existingRooms.splice(index, 1);
      }
    }
    return room;
  };
});
