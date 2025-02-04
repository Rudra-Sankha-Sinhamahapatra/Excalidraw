export function initDraw(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
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
    console.log("End Coordinates:", pos.x, pos.y);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked === true) {
      const pos = getMousePos(e);
      const width = pos.x - startX;
      const height = pos.y - startY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}
