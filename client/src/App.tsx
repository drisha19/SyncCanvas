import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io(
  import.meta.env.VITE_SERVER_URL || "http://localhost:3001"
);

type Tool =
  | "pencil"
  | "eraser"
  | "line"
  | "rectangle"
  | "circle";

type RemoteDrawData = {
  x: number;
  y: number;
  tool: Tool;
  color: string;
  brushSize: number;
};

type RemoteStartData = {
  x: number;
  y: number;
  tool: Tool;
};

type RemoteShapeData = {
  tool: Tool;
  color: string;
  brushSize: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

function App() {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const [isDrawing, setIsDrawing] =
    useState(false);

  const [color, setColor] =
    useState("#111827");

  const [brushSize, setBrushSize] =
    useState(5);

  const [tool, setTool] =
    useState<Tool>("pencil");

  const [isConnected, setIsConnected] =
    useState(socket.connected);

  const [startPos, setStartPos] =
    useState({
      x: 0,
      y: 0,
    });

  const [previewPos, setPreviewPos] = useState({
  x: 0,
  y: 0,
});

  const [history, setHistory] =
    useState<string[]>([]);

  const [redoStack, setRedoStack] =
    useState<string[]>([]);

  const [userName, setUserName] =
    useState("");

  const [roomId, setRoomId] =
    useState("");

  const [joinedRoom, setJoinedRoom] =
    useState(false);
  const [onlineUsers, setOnlineUsers] = useState<
  { socketId: string; userName: string }[]
>([]);
  
  const [remoteCursors, setRemoteCursors] = useState<
  Record<
    string,
    {
      userName: string;
      x: number;
      y: number;
    }
  >
>({});

  const [remoteShapePreviews, setRemoteShapePreviews] = useState<
  Record<
    string,
    {
      userName: string;
      tool: Tool;
      color: string;
      brushSize: number;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  >
>({});
  // ==================================================
  // REMOTE DRAW START
  // ==================================================

  const startRemoteDrawing = (
    data: RemoteStartData
  ) => {
    const canvas = canvasRef.current;
    const context =
      canvas?.getContext("2d");

    if (!canvas || !context) return;

    if (
      data.tool === "pencil" ||
      data.tool === "eraser"
    ) {
      context.beginPath();

      context.moveTo(
        data.x,
        data.y
      );
    }
  };

  // ==================================================
  // REMOTE PENCIL / ERASER
  // ==================================================

  const drawRemote = (
    data: RemoteDrawData
  ) => {
    const canvas = canvasRef.current;
    const context =
      canvas?.getContext("2d");

    if (!canvas || !context) return;

    if (
      data.tool !== "pencil" &&
      data.tool !== "eraser"
    ) {
      return;
    }

    context.lineTo(
      data.x,
      data.y
    );

    context.strokeStyle =
      data.tool === "eraser"
        ? "#ffffff"
        : data.color;

    context.lineWidth =
      data.tool === "eraser"
        ? data.brushSize * 3
        : data.brushSize;

    context.lineCap = "round";
    context.lineJoin = "round";

    context.stroke();
  };

  // ==================================================
  // REMOTE SHAPES
  // ==================================================

  const drawRemoteShape = (
    data: RemoteShapeData
  ) => {
    const canvas = canvasRef.current;
    const context =
      canvas?.getContext("2d");

    if (!canvas || !context) return;

    const width =
      data.endX - data.startX;

    const height =
      data.endY - data.startY;

    context.strokeStyle =
      data.color;

    context.lineWidth =
      data.brushSize;

    context.lineCap = "round";
    context.lineJoin = "round";

    if (data.tool === "line") {
      context.beginPath();

      context.moveTo(
        data.startX,
        data.startY
      );

      context.lineTo(
        data.endX,
        data.endY
      );

      context.stroke();
    }

    if (data.tool === "rectangle") {
      context.beginPath();

      context.strokeRect(
        data.startX,
        data.startY,
        width,
        height
      );
    }

    if (data.tool === "circle") {
      const radius = Math.sqrt(
        width * width +
          height * height
      );

      context.beginPath();

      context.arc(
        data.startX,
        data.startY,
        radius,
        0,
        Math.PI * 2
      );

      context.stroke();
    }
  };

  // ==================================================
  // REMOTE CLEAR CANVAS
  // ==================================================

  const clearRemoteCanvas = () => {
    const canvas = canvasRef.current;
    const context =
      canvas?.getContext("2d");

    if (!canvas || !context) return;

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  };
  
  const restoreRemoteCanvas = (data: {
  imageData: string;
}) => {
  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");

  if (!canvas || !context) return;

  const image = new Image();

  image.onload = () => {
    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.drawImage(image, 0, 0);
  };

  image.src = data.imageData;
};
  // ==================================================
  // SOCKET CONNECTION
  // ==================================================

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleUserJoined = (
      data: {
        userName: string;
        socketId: string;
      }
    ) => {
      console.log(
        `${data.userName} joined the room`
      );
    };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "user-joined",
      handleUserJoined
    );

    socket.on(
  "user-joined",
  handleUserJoined
);

socket.on("room-users", (users) => {
  setOnlineUsers(users);
});

socket.on(
  "draw-start",
  startRemoteDrawing
);

    socket.on(
      "draw-start",
      startRemoteDrawing
    );

    socket.on(
      "draw",
      drawRemote
    );

    socket.on(
      "draw-shape",
      drawRemoteShape
    );
    socket.on("cursor-move", (data) => {
  setRemoteCursors((prev) => ({
    ...prev,
    [data.socketId]: {
      userName: data.userName,
      x: data.x,
      y: data.y,
    },
  }));
});
  socket.on("shape-preview", (data) => {
  setRemoteShapePreviews((prev) => ({
    ...prev,
    [data.socketId]: {
      userName: data.userName,
      tool: data.tool,
      color: data.color,
      brushSize: data.brushSize,
      startX: data.startX,
      startY: data.startY,
      endX: data.endX,
      endY: data.endY,
    },
  }));
});
  socket.on("shape-preview-end", ({ socketId }) => {
  setRemoteShapePreviews((prev) => {
    const updated = { ...prev };
    delete updated[socketId];
    return updated;
  });
});
    socket.on(
      "clear-canvas",
      clearRemoteCanvas
    );

    socket.on(
      "canvas-state",
       restoreRemoteCanvas
   );

    return () => {
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "user-joined",
        handleUserJoined
      );
       
      socket.off("room-users");
      socket.off(
        "draw-start",
        startRemoteDrawing
      );

      socket.off(
        "draw",
        drawRemote
      );

      socket.off(
        "draw-shape",
        drawRemoteShape
      );
      socket.off("cursor-move");
      socket.off("shape-preview");
      socket.off("shape-preview-end");
      socket.off(
        "clear-canvas",
        clearRemoteCanvas
      );
      socket.off(
        "canvas-state",
        restoreRemoteCanvas
      );
    };
  }, []);

  // ==================================================
  // CANVAS RESIZE
  // ==================================================

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const resizeCanvas = () => {
      const parent =
        canvas.parentElement;

      if (!parent) return;

      canvas.width =
        parent.clientWidth;

      canvas.height =
        parent.clientHeight;
    };

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };
  }, [joinedRoom]);
  
  // ==================================================
  // GET MOUSE POSITION
  // ==================================================

  const getCoordinates = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect =
      canvas.getBoundingClientRect();

    return {
      x:
        event.clientX -
        rect.left,

      y:
        event.clientY -
        rect.top,
    };
  };

  // ==================================================
  // START DRAWING
  // ==================================================

  const startDrawing = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas =
      canvasRef.current;

    const context =
      canvas?.getContext("2d");

    if (!canvas || !context)
      return;

    const { x, y } =
      getCoordinates(event);

    setStartPos({
      x,
      y,
    });

    setPreviewPos({
  x,
  y,
});
    socket.emit(
      "draw-start",
      {
        roomId,
        x,
        y,
        tool,
      }
    );

    if (
      tool === "pencil" ||
      tool === "eraser"
    ) {
      context.beginPath();

      context.moveTo(
        x,
        y
      );
    }

    setIsDrawing(true);
  };

  // ==================================================
  // DRAW SHAPE
  // ==================================================

  const drawShape = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas =
      canvasRef.current;

    const context =
      canvas?.getContext("2d");

    if (!canvas || !context)
      return;

    const { x, y } =
      getCoordinates(event);

    const width =
      x - startPos.x;

    const height =
      y - startPos.y;

    // Send shape to other users
    socket.emit(
      "draw-shape",
      {
        roomId,
        tool,
        color,
        brushSize,

        startX:
          startPos.x,

        startY:
          startPos.y,

        endX: x,
        endY: y,
      }
    );

    context.strokeStyle =
      color;

    context.lineWidth =
      brushSize;

    context.lineCap =
      "round";

    context.lineJoin =
      "round";

    if (tool === "line") {
      context.beginPath();

      context.moveTo(
        startPos.x,
        startPos.y
      );

      context.lineTo(
        x,
        y
      );

      context.stroke();
    }

    if (
      tool === "rectangle"
    ) {
      context.beginPath();

      context.strokeRect(
        startPos.x,
        startPos.y,
        width,
        height
      );
    }

    if (
      tool === "circle"
    ) {
      const radius =
        Math.sqrt(
          width * width +
            height * height
        );

      context.beginPath();

      context.arc(
        startPos.x,
        startPos.y,
        radius,
        0,
        Math.PI * 2
      );

      context.stroke();
    }
  };

  // ==================================================
  // PENCIL / ERASER DRAWING
  // ==================================================
  const handleMouseMove = (
  event: React.MouseEvent<HTMLCanvasElement>
) => {
  const { x, y } = getCoordinates(event);

  socket.emit("cursor-move", {
    roomId,
    userName,
    x,
    y,
  });

  if (
    isDrawing &&
    (tool === "line" ||
      tool === "rectangle" ||
      tool === "circle")
  ) {
    setPreviewPos({ x, y });

    socket.emit("shape-preview", {
      roomId,
      userName,
      tool,
      color,
      brushSize,
      startX: startPos.x,
      startY: startPos.y,
      endX: x,
      endY: y,
    });
  }

  draw(event);
};
  const draw = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing)
      return;

    if (
      tool !== "pencil" &&
      tool !== "eraser"
    ) {
      return;
    }

    const canvas =
      canvasRef.current;

    const context =
      canvas?.getContext("2d");

    if (!canvas || !context)
      return;

    const { x, y } =
      getCoordinates(event);

    socket.emit(
      "draw",
      {
        roomId,
        x,
        y,
        tool,
        color,
        brushSize,
      }
    );

    context.lineTo(
      x,
      y
    );

    context.strokeStyle =
      tool === "eraser"
        ? "#ffffff"
        : color;

    context.lineWidth =
      tool === "eraser"
        ? brushSize * 3
        : brushSize;

    context.lineCap =
      "round";

    context.lineJoin =
      "round";

    context.stroke();
  };

  // ==================================================
  // SAVE CANVAS STATE
  // ==================================================

    const saveCanvasState = () => {
  const canvas = canvasRef.current;

  if (!canvas) return;

  const data = canvas.toDataURL();

  setHistory((prev) => [
    ...prev,
    data,
  ]);

  setRedoStack([]);

  socket.emit("canvas-state", {
    roomId,
    imageData: data,
  });
};

  // ==================================================
  // STOP DRAWING
  // ==================================================

  const stopDrawing = (
    event?: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing)
      return;

    if (
      event &&
      (
        tool === "line" ||
        tool ===
          "rectangle" ||
        tool === "circle"
      )
    ) {
      drawShape(event);
    }

    saveCanvasState();

    setIsDrawing(false);
  };

  // ==================================================
  // RESTORE CANVAS
  // ==================================================

  const restoreCanvas = (
    dataUrl: string
  ) => {
    const canvas =
      canvasRef.current;

    const context =
      canvas?.getContext("2d");

    if (!canvas || !context)
      return;

    const image =
      new Image();

    image.onload = () => {
      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      context.drawImage(
        image,
        0,
        0
      );
    };

    image.src =
      dataUrl;
  };

  const emitCanvasState = (imageData: string) => {
  socket.emit("canvas-state", {
    roomId,
    imageData,
  });
};

  // ==================================================
  // UNDO
  // ==================================================

  const undo = () => {
  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");

  if (!canvas || !context || history.length === 0) {
    return;
  }

  const currentState = canvas.toDataURL();
  const newHistory = [...history];

  newHistory.pop();

  setRedoStack((prev) => [
    ...prev,
    currentState,
  ]);

  setHistory(newHistory);

  if (newHistory.length === 0) {
    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const emptyState = canvas.toDataURL();
    emitCanvasState(emptyState);
  } else {
    const previousState =
      newHistory[newHistory.length - 1];

    restoreCanvas(previousState);
    emitCanvasState(previousState);
  }
};

  // ==================================================
  // REDO
  // ==================================================

  const redo = () => {
  if (redoStack.length === 0) {
    return;
  }

  const newRedoStack = [...redoStack];
  const nextState = newRedoStack.pop();

  if (!nextState) return;

  setRedoStack(newRedoStack);

  setHistory((prev) => [
    ...prev,
    nextState,
  ]);

  restoreCanvas(nextState);
  emitCanvasState(nextState);
};

  // ==================================================
  // CLEAR CANVAS
  // ==================================================

  const clearCanvas = () => {
  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");

  if (!canvas || !context) return;

  socket.emit("clear-canvas", roomId);

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const emptyState = canvas.toDataURL();

  socket.emit("canvas-state", {
    roomId,
    imageData: emptyState,
  });

  setHistory([]);
  setRedoStack([]);
};

const exportCanvas = () => {
  const canvas = canvasRef.current;

  if (!canvas) return;

  const image = canvas.toDataURL("image/png");

  const link = document.createElement("a");

  link.href = image;
  link.download = `sync-canvas-${roomId}.png`;

  link.click();
};

  // ==================================================
  // CREATE ROOM
  // ==================================================

  const createRoom = () => {
    if (
      !userName.trim()
    ) {
      alert(
        "Enter your name first"
      );

      return;
    }

    const newRoomId =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    setRoomId(
      newRoomId
    );

    socket.emit(
      "join-room",
      {
        roomId:
          newRoomId,

        userName,
      }
    );

    setJoinedRoom(
      true
    );
  };

  // ==================================================
  // JOIN ROOM
  // ==================================================

  const joinRoom = () => {
    if (
      !userName.trim() ||
      !roomId.trim()
    ) {
      alert(
        "Enter your name and room ID"
      );

      return;
    }

    socket.emit(
      "join-room",
      {
        roomId,
        userName,
      }
    );

    setJoinedRoom(
      true
    );
  };

// ==================================================
// JOIN SCREEN
// ==================================================

if (!joinedRoom) {
  return (
    <div className="join-screen">

      <div className="floating-shapes" aria-hidden="true">
        <span className="shape shape-circle"></span>
        <span className="shape shape-square"></span>
        <span className="shape shape-line"></span>
        <span className="shape shape-dot shape-dot-one"></span>
        <span className="shape shape-dot shape-dot-two"></span>
      </div>

      <div className="join-card">
        <h1>
          SyncCanvas
        </h1>

        <p>
          Join a shared drawing room
        </p>

        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(event) =>
            setUserName(
              event.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Enter room ID"
          value={roomId}
          onChange={(event) =>
            setRoomId(
              event.target.value.toUpperCase()
            )
          }
        />

        <button
          onClick={
            joinRoom
          }
        >
          Join Room
        </button>

        <div className="or-text">
          OR
        </div>

        <button
          onClick={
            createRoom
          }
        >
          Create New Room
        </button>
      </div>
    </div>
  );
}

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>
            SyncCanvas
          </h1>

          <p>
            Real-Time Collaborative Drawing Canvas
          </p>
        </div>

        <div className="status-area">
          <span className="room-badge">
            Room: {roomId}
          </span>

        <span className="room-badge">
  Online: {onlineUsers.length}
</span>

<span className="room-badge">
  {onlineUsers.map((user) => user.userName).join(", ")}
</span>

          <span className="connection-status">
            {isConnected
              ? "● Connected"
              : "● Disconnected"}
          </span>
        </div>
      </header>

      <main className="workspace">
        <aside className="toolbar">
          <h3>
            Tools
          </h3>

          <button
            className={
              tool ===
              "pencil"
                ? "active-tool"
                : ""
            }
            onClick={() =>
              setTool(
                "pencil"
              )
            }
          >
            ✏ Pencil
          </button>

          <button
            className={
              tool ===
              "eraser"
                ? "active-tool"
                : ""
            }
            onClick={() =>
              setTool(
                "eraser"
              )
            }
          >
            🧹 Eraser
          </button>

          <button
            className={
              tool ===
              "line"
                ? "active-tool"
                : ""
            }
            onClick={() =>
              setTool(
                "line"
              )
            }
          >
            ／ Line
          </button>

          <button
            className={
              tool ===
              "rectangle"
                ? "active-tool"
                : ""
            }
            onClick={() =>
              setTool(
                "rectangle"
              )
            }
          >
            ▭ Rectangle
          </button>

          <button
            className={
              tool ===
              "circle"
                ? "active-tool"
                : ""
            }
            onClick={() =>
              setTool(
                "circle"
              )
            }
          >
            ◯ Circle
          </button>

          <div className="divider" />

          <label>
            Color
          </label>

          <input
            type="color"
            value={color}
            disabled={
              tool ===
              "eraser"
            }
            onChange={(event) =>
              setColor(
                event.target.value
              )
            }
          />

          <label>
            Brush Size:{" "}
            {brushSize}px
          </label>

          <input
            type="range"
            min="1"
            max="30"
            value={brushSize}
            onChange={(event) =>
              setBrushSize(
                Number(
                  event.target.value
                )
              )
            }
          />

          <div className="divider" />

          <button
            onClick={undo}
          >
            ↶ Undo
          </button>

          <button
            onClick={redo}
          >
            ↷ Redo
          </button>

          <button
            className="danger-button"
            onClick={
              clearCanvas
            }
          >
            Clear Canvas
          </button>

          <button onClick={exportCanvas}>
  ⬇ Export PNG
</button>
        </aside>

        <section className="canvas-area">
          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              onMouseDown={
                startDrawing
              }
              onMouseMove={
  handleMouseMove
}
              onMouseUp={(
                event
              ) =>
                stopDrawing(
                  event
                )
              }
              onMouseLeave={() =>
                stopDrawing()
              }
            />

            {isDrawing &&
  (tool === "line" ||
    tool === "rectangle" ||
    tool === "circle") && (
    <svg
      className="shape-preview"
      width="100%"
      height="100%"
    >
      {tool === "line" && (
        <line
          x1={startPos.x}
          y1={startPos.y}
          x2={previewPos.x}
          y2={previewPos.y}
          stroke={color}
          strokeWidth={brushSize}
          strokeLinecap="round"
        />
      )}

      {tool === "rectangle" && (
        <rect
          x={Math.min(startPos.x, previewPos.x)}
          y={Math.min(startPos.y, previewPos.y)}
          width={Math.abs(previewPos.x - startPos.x)}
          height={Math.abs(previewPos.y - startPos.y)}
          fill="none"
          stroke={color}
          strokeWidth={brushSize}
        />
      )}

      {tool === "circle" && (
        <circle
          cx={startPos.x}
          cy={startPos.y}
          r={Math.sqrt(
            Math.pow(previewPos.x - startPos.x, 2) +
              Math.pow(previewPos.y - startPos.y, 2)
          )}
          fill="none"
          stroke={color}
          strokeWidth={brushSize}
        />
      )}
    </svg>
  )}
      {Object.entries(remoteShapePreviews).map(
  ([socketId, preview]) => {
    const width = preview.endX - preview.startX;
    const height = preview.endY - preview.startY;

    return (
      <svg
        key={socketId}
        className="shape-preview"
        width="100%"
        height="100%"
      >
        {preview.tool === "line" && (
          <line
            x1={preview.startX}
            y1={preview.startY}
            x2={preview.endX}
            y2={preview.endY}
            stroke={preview.color}
            strokeWidth={preview.brushSize}
            strokeLinecap="round"
          />
        )}

        {preview.tool === "rectangle" && (
          <rect
            x={Math.min(preview.startX, preview.endX)}
            y={Math.min(preview.startY, preview.endY)}
            width={Math.abs(width)}
            height={Math.abs(height)}
            fill="none"
            stroke={preview.color}
            strokeWidth={preview.brushSize}
          />
        )}

        {preview.tool === "circle" && (
          <circle
            cx={preview.startX}
            cy={preview.startY}
            r={Math.sqrt(
              width * width + height * height
            )}
            fill="none"
            stroke={preview.color}
            strokeWidth={preview.brushSize}
          />
        )}
      </svg>
    );
  }
)}
            {Object.entries(remoteCursors).map(
  ([socketId, cursor]) => (
    <div
      key={socketId}
      className="remote-cursor"
      style={{
        left: cursor.x,
        top: cursor.y,
      }}
    >
      <div className="cursor-dot" />

      <span className="cursor-name">
        {cursor.userName}
      </span>
    </div>
  )
)}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;