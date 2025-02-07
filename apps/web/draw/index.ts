import { Shape, Tool } from "../lib/types";

export async function initDraw(
  canvas: HTMLCanvasElement,
  messages: { message: string }[],
  socket: WebSocket,
  roomId: string
) {
  const ctx = canvas.getContext("2d");

  const existingShapes: Shape[] = await getExistingShapes(messages);

  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  clearCanvas(existingShapes, canvas, ctx);
  ctx.strokeStyle = "white";
  let clicked = false;
  let startX = 0;
  let startY = 0;

  // Adjust mouse coordinates to account for canvas position
  const getMousePos = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect(); // Recalculate each time
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    const pos = getMousePos(e);
    startX = pos.x;
    startY = pos.y;
  });

  // Mouse up event to stop drawing
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const pos = getMousePos(e);
    const height = pos.y - startY;
    const width = pos.x - startX;

    //@ts-expect-error no error
    const selectedTool = window.selectedTool;
    let shape: Shape | null = null;

    if (selectedTool === Tool.rectangle) {
      shape = {
        type: Tool.rectangle,
        x: startX,
        y: startY,
        height,
        width,
      };
    } else if (selectedTool === Tool.circle) {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: Tool.circle,
        radius: radius,
        centerX: startX + radius,
        centerY: startY + radius,
      };
    }

    if (shape === null) {
      return;
    }

    existingShapes.push(shape);

    const message = JSON.stringify(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: message,
        roomId: roomId,
      })
    );

    console.log("End Coordinates:", pos.x, pos.y);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked === true) {
      const pos = getMousePos(e);
      const width = pos.x - startX;
      const height = pos.y - startY;
      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeStyle = "white";
      //@ts-expect-error no error
      const selectedTool = window.selectedTool;
      if (selectedTool === Tool.rectangle) {
        ctx.strokeRect(startX, startY, width, height);
      } else if (selectedTool === Tool.circle) {
        const radius = Math.max(width, height) / 2;
        const centerX = startX + radius;
        const centerY = startY + radius;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      }
    }
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type === Tool.rectangle) {
      ctx.strokeStyle = "white";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === Tool.circle) {
      ctx.beginPath();
      ctx.arc(shape.centerX,shape.centerY,shape.radius,0,Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  });
}

async function getExistingShapes(messages: { message: string }[]) {
  const shapes = messages.map((message: { message: string }) => {
    const messageData = JSON.parse(message.message);
    return messageData;
  });

  return shapes;
}
