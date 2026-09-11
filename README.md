# SyncCanvas

SyncCanvas is a real-time collaborative drawing application that allows multiple users to join the same room and draw together instantly.

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