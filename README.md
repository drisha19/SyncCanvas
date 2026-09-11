# 🎨 SyncCanvas

**SyncCanvas** is a real-time collaborative drawing application that allows multiple users to join a shared room and draw together instantly.

It is built using **React, TypeScript, HTML5 Canvas, Node.js, Express, and Socket.IO**, with real-time synchronization between connected users.

## 🚀 Live Demo

**Frontend:** https://sync-canvas-kappa.vercel.app

**Backend:** https://synccanvas-ise3.onrender.com

> Note: The backend is hosted on Render's free tier, so the first connection after a period of inactivity may take a short time while the server wakes up.

---

## ✨ Features

- Create and join collaborative drawing rooms
- Real-time multi-user drawing
- Pencil and eraser tools
- Line, rectangle, and circle tools
- Live shape preview while dragging
- Remote shape preview between users
- Real-time cursor tracking
- Online user presence and user list
- Adjustable brush size
- Custom drawing colors
- Undo and redo support
- Synchronized canvas clearing
- Canvas state restoration on reconnect
- Export completed canvas as PNG
- Responsive user interface
- Animated and modern gradient UI

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- HTML5 Canvas
- CSS
- Socket.IO Client

### Backend

- Node.js
- Express.js
- TypeScript
- Socket.IO
- CORS

### Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Version Control:** Git & GitHub

---

## 🏗️ Architecture

SyncCanvas follows a client-server architecture with event-driven real-time communication.

```text
User A
   │
   ▼
React + HTML5 Canvas
   │
   │ Drawing / Cursor / Shape Events
   ▼
Socket.IO Client
   │
   ▼
Node.js + Express + Socket.IO Server
   │
   ▼
Shared Room
   │
   ▼
Socket.IO Client
   │
   ▼
React + HTML5 Canvas
   │
   ▼
User B
```

Users join a shared room using a Room ID. Drawing events, cursor positions, shape previews, user presence, and canvas updates are transmitted through Socket.IO and synchronized with other users in the same room.

---

## 🔄 Real-Time Collaboration Flow

1. A user creates or joins a room.
2. The client establishes a Socket.IO connection with the server.
3. The server places the user inside the requested room.
4. Drawing actions are captured using the HTML5 Canvas API.
5. Drawing events are sent to the Socket.IO server.
6. The server broadcasts the events to other users in the same room.
7. Other clients reproduce the drawing operation on their canvas.
8. Cursor positions, shape previews, and online-user information are synchronized in real time.

---

## 📁 Project Structure

```text
SyncCanvas/
│
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   └── index.ts
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

## 💻 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/drisha19/SyncCanvas.git
cd SyncCanvas
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

The backend runs locally on:

```text
http://localhost:3001
```

### 3. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend runs locally on:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `client` directory:

```env
VITE_SERVER_URL=http://localhost:3001
```

For production deployment, set `VITE_SERVER_URL` to the deployed backend URL.

Example:

```env
VITE_SERVER_URL=https://synccanvas-ise3.onrender.com
```

---

## ⚠️ Current Limitations

- Canvas state is currently stored in server memory rather than a persistent database.
- Canvas data may be lost when the backend server restarts.
- Undo and redo history is maintained locally for each user.
- User authentication is not included in the current version.
- The Render free-tier backend may require a short wake-up period after inactivity.

---

## 🔮 Future Improvements

Potential future enhancements include:

- Persistent canvas storage using a database
- User authentication and profiles
- Collaborative text and sticky notes
- Image insertion
- Room ownership and permissions
- Downloadable project history
- Improved collaborative undo/redo
- Additional drawing tools
- Mobile touch optimization

---

## 🎯 Project Objective

The objective of SyncCanvas is to explore and implement real-time collaborative frontend systems using WebSockets while maintaining responsive drawing interactions and synchronization across multiple connected clients.

The project demonstrates practical experience with **real-time event handling, HTML5 Canvas, client-server architecture, WebSocket communication, React state management, TypeScript, and production deployment**.

---

## 👩‍💻 Author

**Drisha**

Frontend R&D Assignment — Real-Time Collaborative Drawing Canvas