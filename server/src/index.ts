import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", (_req, res) => {
  res.send("SyncCanvas server is running");
});
const roomUsers = new Map<
  string,
  Map<string, string>
>();

const roomCanvasState = new Map<string, string>();

io.on("connection", (socket) => {

  console.log(`User connected: ${socket.id}`);

  socket.on("join-room", ({ roomId, userName }) => {
  socket.join(roomId);

  socket.data.roomId = roomId;
  socket.data.userName = userName;

  if (!roomUsers.has(roomId)) {
    roomUsers.set(roomId, new Map());
  }

  roomUsers
    .get(roomId)!
    .set(socket.id, userName);

  const users = Array.from(
    roomUsers.get(roomId)!.entries()
  ).map(([socketId, name]) => ({
    socketId,
    userName: name,
  }));

  io.to(roomId).emit("room-users", users);

  console.log(`${userName} joined room ${roomId}`);
});

socket.on("draw-start", (data) => {
  socket.to(data.roomId).emit("draw-start", data);
});
socket.on("draw", (data) => {
  socket.to(data.roomId).emit("draw", data);
});

socket.on("draw-shape", (data) => {
  socket.to(data.roomId).emit("draw-shape", data);

  socket.to(data.roomId).emit("shape-preview-end", {
    socketId: socket.id,
  });
});

socket.on("clear-canvas", (roomId) => {
  socket.to(roomId).emit("clear-canvas");
});

socket.on("canvas-state", (data) => {
  roomCanvasState.set(
    data.roomId,
    data.imageData
  );

  socket.to(data.roomId).emit("canvas-state", {
    imageData: data.imageData,
  });
});

socket.on("cursor-move", (data) => {
  socket.to(data.roomId).emit("cursor-move", {
    socketId: socket.id,
    userName: data.userName,
    x: data.x,
    y: data.y,
  });
});

socket.on("shape-preview", (data) => {
  socket.to(data.roomId).emit("shape-preview", {
    socketId: socket.id,
    userName: data.userName,
    tool: data.tool,
    color: data.color,
    brushSize: data.brushSize,
    startX: data.startX,
    startY: data.startY,
    endX: data.endX,
    endY: data.endY,
  });
});

  socket.on("disconnect", () => {
  const roomId = socket.data.roomId;

  if (roomId && roomUsers.has(roomId)) {
    const usersInRoom = roomUsers.get(roomId)!;

    usersInRoom.delete(socket.id);

    if (usersInRoom.size === 0) {
      roomUsers.delete(roomId);
    } else {
      const users = Array.from(
        usersInRoom.entries()
      ).map(([socketId, name]) => ({
        socketId,
        userName: name,
      }));

      io.to(roomId).emit("room-users", users);

      const savedCanvas = roomCanvasState.get(roomId);

if (savedCanvas) {
  socket.emit("canvas-state", {
    imageData: savedCanvas,
  });
}
    }
  }

  console.log(`User disconnected: ${socket.id}`);
});

});

const PORT = 3001;

httpServer.listen(PORT, () => {
  console.log(`SyncCanvas server running on http://localhost:${PORT}`);
});