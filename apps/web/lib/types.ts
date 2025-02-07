export enum Tool {
    pencil = "pencil",
    rectangle = "rect",
    circle = "circle",
    pointer = "pointer",
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
        type: Tool.pencil,
        startX:number,
        startY:number,
        endX:number,
        endY:number
    }
