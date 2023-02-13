import { ResponsiveCanvas } from "./ResponsiveCanvas.js";

export class Component {
    canvas: ResponsiveCanvas
    draw: (context: CanvasRenderingContext2D) => void

    constructor(canvas: ResponsiveCanvas, draw: (context: CanvasRenderingContext2D) => void = (_ => {})) {
        this.canvas = canvas;
        this.canvas.components.push(this);
        this.canvas.updateFlag = true;
        this.draw = draw;
    }
}
