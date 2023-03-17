import { Component } from "./Component.js";
import { CanvasContainer } from "./CanvasContainer.js";
import { validatePropertyArg } from "./validators.js";

export type ResponsiveCanvasOptions = Partial<{
    background: string
}>

export class ResponsiveCanvas {
    canvas: HTMLCanvasElement
    container: CanvasContainer
    context: CanvasRenderingContext2D
    components: Component[] = []
    background: string = ResponsiveCanvas.Defaults.background
    updateFlag: boolean = true

    static Defaults = {
        background: ""
    }

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

    update() {
        this.context.clearRect(-this.container.origin.x, -this.container.origin.y, this.canvas.width, this.canvas.height);
        // iterate through list of components calling draw function
        for (const component of this.components) {
            component.draw(this.context);
        }
        this.updateFlag = false;
    }

    setBackground(css: string) {
        this.background = validatePropertyArg(css, "string", "background");
        this.canvas.style.background = css;
    }
}
