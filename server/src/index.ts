import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";

const PORT = process.env.PORT || 80;

const app: Express = express();

const buildPath = path.join(__dirname, "../../client/dist");

app.use(express.static(buildPath));

app.get("/", (req, res) => {
  res.send("The server is up and running!");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const server = app.listen(PORT, () =>
  console.log(`Listening on port ${PORT}...`)
);

// socket server

import { Server, Socket } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

const clientsInRoom: object = {};
const existingRooms: string[] = [];

io.on("connection", (socket: Socket) => {
  socket.on("nextMove", (roomData) => {
    const room: string = roomData.room;
    io.to(room).emit("playerMove", roomData);
  });

  socket.on("addNewRoom", (room) => {
    existingRooms.push(room);
  });

  socket.on("joinRoom", (room) => {
    if (existingRooms.includes(room)) {
      clientsInRoom[room] = io.sockets.adapter.rooms.get(room)?.size;
      if (clientsInRoom[room] === undefined) {
        socket.join(room);
        socket.data.roomCode = room;
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
      clientsInRoom[roomCode] === 2
        ? socket.emit("roomResponse", "roomIsFull")
        : socket.emit("roomResponse", roomCode);
    } else {
      socket.emit("roomResponse", "roomIsNonexistent");
    }
  });

  socket.on("restartGame", (room) => {
    io.to(room).emit("restartRoom");
  });

  socket.on("updateRoom", (room) => {
    const players: number | undefined =
      io.sockets.adapter.rooms.get(room)?.size;
    if (players === 1) {
      io.to(room).emit("opponentLeft");
    }
  });

  socket.on("manualDisconnect", (room) => {
    socket.leave(room);
    if (io.sockets.adapter.rooms.get(room)?.size === 2) return;
    setTimeout(() => {
      if (
        !io.sockets.adapter.rooms.get(room) &&
        io.sockets.adapter.rooms.get(room)?.size === 1
      ) {
        existingRooms.splice(existingRooms.indexOf(room), 1);
      }
    }, 10000);
    io.to(room).emit("opponentLeft");
  });
});
