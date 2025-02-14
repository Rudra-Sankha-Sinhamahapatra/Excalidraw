import { Shape, Tool } from "../lib/types";
import { getExistingShapes } from "./http";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private messages: { message: string }[];
  private socket: WebSocket;
  private clicked: boolean;
  private isDrawing:boolean = false;
  private roomId: string;
  private startX: number;
  private startY: number;
  private selectedTool:Tool = Tool.rectangle;

  constructor(
    canvas: HTMLCanvasElement,
    messages: { message: string }[],
    socket: WebSocket,
    roomId: string
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.messages = messages;
    this.socket = socket;
    this.roomId = roomId;
    this.clicked = false;
    this.startX = 0;
    this.startY = 0;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.messages);
    this.clearCanvas(this.existingShapes,this.canvas,this.ctx);
  }

  setTool(tool:Tool) {
   this.selectedTool = tool;
  }

  async initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
       
      if(message.type === "eraser") {
        this.existingShapes = [];
        this.clearCanvas(this.existingShapes,this.canvas,this.ctx)
      }
      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape);
        this.clearCanvas(this.existingShapes, this.canvas, this.ctx);
      }
    };
  }

  clearCanvas(
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
        ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      } else if (shape.type === Tool.line) {
        this.drawLine(shape);
      } else if (shape.type === Tool.pencil) {
        this.drawPencil(shape);
      }
    });
  }
  // Function to handle reconnecting
reconnectWebSocket() {
    // Implement your WebSocket reconnect logic here
    // For example, you can close and recreate the WebSocket connection.
    this.socket = new WebSocket(this.socket.url);
    this.socket.onopen = () => {
      console.log("Reconnected to WebSocket.");
    };
    this.socket.onerror = (err) => {
      console.error("Error reconnecting WebSocket: ", err);
    };
  }

  // Adjust mouse coordinates to account for canvas position
  getMousePos(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect(); // Recalculate each time
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  mouseDownHandler = (e:MouseEvent) => {
    this.clicked = true;
    const pos = this.getMousePos(e);
    this.startX = pos.x;
    this.startY = pos.y;

    if(this.selectedTool === Tool.line) {
      this.isDrawing = true;
    } else if (this.selectedTool === Tool.pencil) {
      this.isDrawing = true;
    }
  }

  mouseUpHandler = (e:MouseEvent) => {
    this.clicked = false;
    const pos = this.getMousePos(e);
    const height = pos.y - this.startY;
    const width = pos.x - this.startX;

    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;

    if (selectedTool === Tool.rectangle) {
      shape = {
        type: Tool.rectangle,
        x: this.startX,
        y: this.startY,
        height,
        width,
      };
    } else if (selectedTool === Tool.circle) {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: Tool.circle,
        radius: radius,
        centerX: this.startX + radius,
        centerY: this.startY + radius,
      };
    }
    else if (selectedTool === Tool.line) {
      shape = {
        type:Tool.line,
        points : [
          {x: this.startX, y: this.startY},
          {x: pos.x, y: pos.y}
        ]
      }
    }
    else if (selectedTool === Tool.pencil) {
     const currentShape = this.existingShapes[this.existingShapes.length - 1];
     if(currentShape && currentShape.type === Tool.pencil) {
      shape = currentShape;
     }
    }

    if (shape === null) {
      return;
    }

    if(shape !==null && selectedTool !==Tool.eraser){
    this.existingShapes.push(shape);

    const message = JSON.stringify(shape);

    if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(
          JSON.stringify({
            type: "chat",
            message: message,
            roomId: this.roomId,
          })
        );
      } else if (this.socket.readyState === WebSocket.CLOSING || this.socket.readyState === WebSocket.CLOSED) {
        console.log("WebSocket is closed or closing, attempting to reconnect...");
        this.reconnectWebSocket();
      }
      

    console.log("End Coordinates:", pos.x, pos.y);
  }
}

  mouseMoveHandler = (e:MouseEvent) => {
    if (this.clicked === true) {
        const pos = this.getMousePos(e);
        const width = pos.x - this.startX;
        const height = pos.y - this.startY;
  
        if(this.selectedTool === Tool.eraser){
          this.eraseShapeAtPosition(pos.x,pos.y);
        } else {
        this.clearCanvas(this.existingShapes, this.canvas, this.ctx);
        this.ctx.strokeStyle = "white";
        const selectedTool = this.selectedTool;
        if (selectedTool === Tool.rectangle) {
          this.ctx.strokeRect(this.startX, this.startY, width, height);
        } else if (selectedTool === Tool.circle) {
          const radius = Math.max(width, height) / 2;
          const centerX = this.startX + radius;
          const centerY = this.startY + radius;
          this.ctx.beginPath();
          this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.closePath();
        }  else if(selectedTool===Tool.line) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.startX,this.startY);
          this.ctx.lineTo(pos.x,pos.y);
          this.ctx.stroke();
        } else if (selectedTool === Tool.pencil) {
         let currentShape = this.existingShapes[this.existingShapes.length -1];
         if(!currentShape || currentShape.type !== Tool.pencil) {
          currentShape = {
            type:Tool.pencil,
            points:[{x:this.startX,y:this.startY}]
          };
          this.existingShapes.push(currentShape);
         }

         currentShape.points.push({x:pos.x,y:pos.y})
         
         this.clearCanvas(this.existingShapes,this.canvas,this.ctx);

         this.ctx.beginPath();
        this.ctx.strokeStyle = "white";

         if(currentShape.points[0]){
         this.ctx.moveTo(currentShape.points[0]?.x,currentShape.points[0].y)
         }
                
         currentShape.points.forEach(point => {
          this.ctx.lineTo(point.x,point.y)
         });

         this.ctx.stroke()
        }
      }
    }
  }

eraseShapeAtPosition(x:number,y:number) {
  const eraseRadius = 10;
  this.existingShapes = this.existingShapes.filter((shape)=>{
    if(shape.type == Tool.rectangle) {
      const distance = Math.sqrt(
        Math.pow(x- (shape.x + shape.width /2),2) + Math.pow(y-(shape.y + shape.width /2),2)
      );
      return distance>eraseRadius
    } else if(shape.type === Tool.circle) {
      const distance = Math.sqrt(
        Math.pow(x-shape.centerX,2) + Math.pow(y-shape.centerY,2)
      );
      return distance>shape.radius + eraseRadius
    }
    return true
  })
  this.clearCanvas(this.existingShapes,this.canvas,this.ctx);
}

drawLine(shape:Shape) {
  if (shape.type === Tool.line && Array.isArray(shape.points) && shape.points.length >=2) {
    this.ctx.strokeStyle = "white";
    const points = shape.points;
    if(points === null || points === undefined) {
      return;
    }
    this.ctx.beginPath();
    if(points[0]) {
      this.ctx.moveTo(points[0].x,points[0].y);
    }
    if(points[1]) {
      this.ctx.lineTo(points[1].x,points[1].y);
    }
    this.ctx.stroke();
  }
}
  drawPencil (shape:Shape) {
   if (shape.type === Tool.pencil && shape.points  && shape.points.length > 0) {
    this.ctx.strokeStyle = "white";
    const points = shape.points;
    this.ctx.beginPath();
    if(points [0]) {
      this.ctx.moveTo(points[0].x,points[0].y);
    }

    points.forEach((point) => this.ctx.lineTo(point.x,point.y));
    this.ctx.stroke();
   }
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
  
}
