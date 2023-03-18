import { PulsarObject } from "./PulsarObject.js";
import { ResponsiveCanvas } from "./ResponsiveCanvas.js";
import { validateArrayPropertyArgs, validateAxesPropertyArgs } from "./validators.js";

export type ContainerOptions = Partial<{
    xLims: [number, number]
    yLims: [number, number]
    origin: "centre" | [number, number]
}>

export class CanvasContainer extends HTMLElement {
    parent: PulsarObject
    canvases: ResponsiveCanvas[] = []
    scale: {
        x: number
        y: number
    } = {
        x: 50,
        y: 50
    }
    resizeObserver: ResizeObserver
    xLims: [number, number] = CanvasContainer.Defaults.xLims
    yLims: [number, number] = CanvasContainer.Defaults.yLims
    origin: {
        x: number
        y: number
    } = CanvasContainer.Defaults.origin
    
    static Defaults = {
        xLims: [0, 10] as [number, number],
        yLims: [-10, 0] as [number, number],
        origin: {
            x: 0,
            y: 0
        }
    }

    constructor(parent: PulsarObject, options: ContainerOptions = {}) {
        super();
        this.parent = parent;
        this.parent.containers.push(this);
        this.parent.appendChild(this);
        this.style.display = "grid";
        this.style.gridArea = "1 / 1";

        for (const option in options) {
            const setter = `set${option.charAt(0).toUpperCase()}${option.slice(1)}`
            if (typeof (this as any)[setter] === "function") {
                (this as any)[setter](...(Array.isArray((options as any)[option]) ? (options as any)[option] : [(options as any)[option]]));
            }
        }

        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                // update limits to account for change in size
                this.xLims = [-this.origin.x / this.scale.x, (this.clientWidth - this.origin.x) / this.scale.x];
                this.yLims = [-(this.clientHeight - this.origin.y) / this.scale.y, this.origin.y / this.scale.y];
                for (const canvas of this.canvases) {
                    canvas.canvas.width = entry.target.clientWidth;
                    canvas.canvas.height = entry.target.clientHeight;
                    canvas.context.translate(this.origin.x, this.origin.y); // because changing the size of a canvas resets it
                    canvas.updateFlag = true;
                }
            }
        });
        this.resizeObserver.observe(this.parent);
    }

    setXLims(min: number, max: number) {
        if (max > min) {
            this.xLims = validateArrayPropertyArgs([min, max], "number", 2, "xLims") as [number, number];
            this.scale.x = this.clientWidth / Math.abs(min - max);
            this.setOrigin(-min * this.scale.x, this.origin.y);
        } else {
            throw `Error setting xLims: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }

    setYLims(min: number, max: number) {
        if (max > min) {
            this.yLims = validateArrayPropertyArgs([min, max], "number", 2, "yLims") as [number, number];
            this.scale.y = this.clientHeight / Math.abs(min - max);
            this.setOrigin(this.origin.x, max * this.scale.y);
        } else {
            throw `Error setting yLims: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }

    setOrigin(...point: ["centre"] | [number, number]) {
        if (point.length === 1 && point[0] === "centre") {
            this.origin = validateAxesPropertyArgs([Math.round(this.clientWidth / 2), Math.round(this.clientHeight / 2)], "number", "origin");
        } else {
            this.origin = validateAxesPropertyArgs(point, "number", "origin");
        }
        this.xLims = [-this.origin.x / this.scale.x, (this.clientWidth - this.origin.x) / this.scale.x];
        this.yLims = [-(this.clientHeight - this.origin.y) / this.scale.y, this.origin.y / this.scale.y];
        for (const canvas of this.canvases) {
            canvas.context.resetTransform();
            canvas.context.translate(this.origin.x, this.origin.y);
            canvas.updateFlag = true;
        }
    }
}

window.customElements.define("pulsar-container", CanvasContainer); // put this in a static method
