import express from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import http from "http";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*" },
    maxHttpBufferSize: 1e8 // 100 MB for image/audio/video uploads
  });
  const PORT = 3000;

  // room_id -> { items: [], mood: 'neutral', users: Map<socketId, userName>, type: 'private' | 'group' }
  const rooms = new Map();

  io.on("connection", (socket) => {
    let currentRoom = "";
    let currentUser = "";

    socket.on("join_room", ({ roomId, userName, roomType }) => {
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { items: [], mood: "neutral", users: new Map(), type: roomType || 'group' });
      }
      const room = rooms.get(roomId);

      if (room.type === 'private' && room.users.size >= 2 && !room.users.has(socket.id)) {
        socket.emit("room_full");
        return;
      }

      currentRoom = roomId;
      currentUser = userName;
      socket.join(roomId);

      room.users.set(socket.id, userName);

      socket.emit("room_state", {
        items: room.items,
        mood: room.mood,
        users: Array.from(room.users.values()),
        type: room.type
      });

      socket.to(roomId).emit("users_update", Array.from(room.users.values()));
    });

    socket.on("add_item", (item) => {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      if (!room.items.find((i: any) => i.id === item.id)) {
        room.items.push(item);
        io.to(currentRoom).emit("item_added", item);
      }
    });

    socket.on("update_item", ({ id, updates }) => {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      const index = room.items.findIndex((i: any) => i.id === id);
      if (index !== -1) {
        room.items[index] = { ...room.items[index], ...updates };
        io.to(currentRoom).emit("item_updated", { id, updates });
      }
    });

    socket.on("remove_item", (id) => {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      room.items = room.items.filter((i: any) => i.id !== id);
      io.to(currentRoom).emit("item_removed", id);
    });

    socket.on("change_mood", (mood) => {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      room.mood = mood;
      io.to(currentRoom).emit("mood_changed", mood);
    });

    socket.on("game_action", (action) => {
      if (!currentRoom) return;
      io.to(currentRoom).emit("game_action", action);
    });

    socket.on("disconnect", () => {
      if (currentRoom && rooms.has(currentRoom)) {
        const room = rooms.get(currentRoom);
        room.users.delete(socket.id);
        io.to(currentRoom).emit("users_update", Array.from(room.users.values()));
      }
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
