import { ResponsiveCanvas } from "./ResponsiveCanvas.js";

/**
 * Base class representing objects which have a visual representation on the canvas.
 * This is mostly analogous to the [Artist](https://matplotlib.org/stable/api/artist_api.html) class in matplotlib.
 */
export class Component {
    /**
     * The canvas which the component is attached to.
     */
    canvas: ResponsiveCanvas
    /**
     * Function which draws the component on the canvas.
     */
    draw: (context: CanvasRenderingContext2D) => void

    /**
     * @param canvas {@link ResponsiveCanvas | `ResponsiveCanvas`} instance.
     * @param draw Draw function.
     */
    constructor(canvas: ResponsiveCanvas, draw: (context: CanvasRenderingContext2D) => void = (_ => {})) {
        this.canvas = canvas;
        this.canvas.components.push(this);
        this.canvas.updateFlag = true;
        this.draw = draw;
    }
}
