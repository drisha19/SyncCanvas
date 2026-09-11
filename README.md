# SyncCanvas

SyncCanvas is a real-time collaborative drawing application that allows multiple users to join the same room and draw together instantly.

## Live Demo

Frontend: https://sync-canvas-kappa.vercel.app

Backend: https://synccanvas-ise3.onrender.com

## Features

- Create and join drawing rooms
- Real-time collaborative drawing
- Pencil and eraser tools
- Line, rectangle, and circle tools
- Live shape preview while dragging
- Remote shape preview for other users
- Undo and redo support
- Clear canvas synchronization
- Live cursor tracking
- Online user list
- Canvas state restoration when users reconnect
- Export canvas as PNG
- Responsive user interface

## Tech Stack

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

## Architecture

SyncCanvas follows a client-server architecture for real-time collaboration.

- **Frontend:** React + TypeScript + Vite
- **Drawing Engine:** HTML5 Canvas
- **Backend:** Node.js + Express + TypeScript
- **Real-Time Communication:** Socket.IO
- **Frontend Deployment:** Vercel
- **Backend Deployment:** Render

### Real-Time Flow

User A → React Canvas → Socket.IO → Node.js Server → Socket.IO → User B

Users join a shared room using a Room ID. Drawing events, shape previews, cursor positions, and canvas updates are synchronized between connected users in real time.

## Current Limitations

- Canvas state is stored in server memory and is not permanently stored in a database.
- Canvas data may be lost if the backend server restarts.
- Undo and redo operations are maintained locally for each user.
- The current version does not include user authentication.
- Render free-tier hosting may require a short wake-up time after inactivity.

## Project Structure

```text
Sync Canvas/
├── client/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── server/
│   ├── src/
│   └── package.json
└── README.md