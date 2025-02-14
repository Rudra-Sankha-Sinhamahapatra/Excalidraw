export enum Tool {
  pencil = "pencil",
  rectangle = "rect",
  circle = "circle",
  pointer = "pointer",
  eraser = "eraser",
  line = "line",
}

export type Shape =
  | {
      type: Tool.rectangle;
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: Tool.circle;
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: Tool.pencil;
      points: {x:number,y:number}
    }
    |
    {
      type: Tool.line;
      points: {x:number,y:number}[]
    }
  | {
      type: Tool.eraser;
    };
