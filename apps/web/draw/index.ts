type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  messages: { message: string }[],
  socket:WebSocket,
  roomId:string
) {
  const ctx = canvas.getContext("2d");

  const existingShapes: Shape[] = await getExistingShapes(messages);

  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if(message.type === "chat") {
     const parsedShape = JSON.parse(message.message);
     existingShapes.push(parsedShape);
     clearCanvas(existingShapes,canvas,ctx);
    }

  }

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

    const shape : Shape = {
      type: "rect",
      x: startX,
      y: startY,
      height,
      width,
    }

    existingShapes.push(shape);

   const message = JSON.stringify(shape)

  socket.send(JSON.stringify({
    type: "chat",
    message:message,
    roomId:roomId
  }))

    console.log("End Coordinates:", pos.x, pos.y);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked === true) {
      const pos = getMousePos(e);
      const width = pos.x - startX;
      const height = pos.y - startY;
      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, width, height);
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
    if (shape.type === "rect") {
      ctx.strokeStyle = "white";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
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
