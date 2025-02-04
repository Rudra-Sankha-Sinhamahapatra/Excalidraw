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

export function initDraw(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");

  const existingShapes: Shape[] = [];

  if (!ctx) {
    return;
  }
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "white";
  let clicked = false;
  let startX = 0;
  let startY = 0;

  const rect = canvas.getBoundingClientRect();

  // Adjust mouse coordinates to account for canvas position
  const getMousePos = (e: MouseEvent) => {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
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

    existingShapes.push({
      type: "rect",
      x: startX,
      y: startY,
      height,
      width,
    });
    console.log("End Coordinates:", pos.x, pos.y);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked === true) {
      const pos = getMousePos(e);
      const width = pos.x - startX;
      const height = pos.y - startY;
      clearCanvas(existingShapes,canvas,ctx)
      ctx.strokeStyle = "white"
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
