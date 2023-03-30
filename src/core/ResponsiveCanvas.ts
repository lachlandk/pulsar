import { Component } from "./Component.js";
import { CanvasContainer } from "./CanvasContainer.js";
import { validatePropertyArg } from "./validators.js";

export type ResponsiveCanvasOptions = Partial<{
    background: string
}>

/**
 * Base class for Pulsar canvas elements.
 * Instances will be contained in a {@link CanvasContainer | `CanvasContainer`}, which they will fill on the page.
 */
export class ResponsiveCanvas {
    /**
     * The canvas element which the instance is responsible for controlling.
     */
    canvas: HTMLCanvasElement
    /**
     * The parent {@link CanvasContainer | `CanvasContainer`} instance.
     */
    container: CanvasContainer
    /**
     * The [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) for the canvas.
     */
    context: CanvasRenderingContext2D
    /**
     * List of the {@link Component | `Component`} instances attached to the canvas instance.
     */
    components: Component[] = []
    /**
     * The `background` style of the canvas.
     */
    background: string = ResponsiveCanvas.Defaults.background
    /**
     * Indicates whether the canvas instance is to be redrawn on the next event loop pass (see {@link Controller | `Controller`}).
     */
    updateFlag: boolean = true

    /**
     * Name | Default value
     * --- | ---
     * `background` | `""`
     */
    static Defaults = {
        background: ""
    }

    /**
     * @param container Parent {@link CanvasContainer | `CanvasContainer`} instance.
     * @param options  Options for the canvas.
     */
    constructor(container: CanvasContainer, options: ResponsiveCanvasOptions = {}) {
        this.canvas = document.createElement("canvas");
        this.canvas.style.gridArea = "1 / 1";
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.container = container;
        this.container.canvases.push(this);
        this.container.appendChild(this.canvas);

        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;

        for (const option in options) {
            const setter = `set${option.charAt(0).toUpperCase()}${option.slice(1)}`
            if (typeof (this as any)[setter] === "function") {
                (this as any)[setter](...(Array.isArray((options as any)[option]) ? (options as any)[option] : [(options as any)[option]]));
            }
        }
    }

    /**
     * Clears the canvas and redraws all attached {@link Component | `Component`} instances.
     */
    update() {
        this.context.clearRect(-this.container.origin.x, -this.container.origin.y, this.canvas.width, this.canvas.height);
        // iterate through list of components calling draw function
        for (const component of this.components) {
            component.draw(this.context);
        }
        this.updateFlag = false;
    }

    /**
     * Sets the `background` style of the background canvas.
     * @param css A valid string for the {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background `background`} property.
     */
    setBackground(css: string) {
        this.background = validatePropertyArg(css, "string", "background");
        this.canvas.style.background = css;
    }
}
