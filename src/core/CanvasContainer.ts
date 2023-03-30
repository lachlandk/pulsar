import { PulsarObject } from "./PulsarObject.js";
import { ResponsiveCanvas } from "./ResponsiveCanvas.js";
import { validateArrayPropertyArgs, validateAxesPropertyArgs } from "./validators.js";

export type ContainerOptions = Partial<{
    xLims: [number, number]
    yLims: [number, number]
    origin: "centre" | [number, number]
}>

/**
 * Base class for Pulsar elements which contain {@link ResponsiveCanvas | `ResponsiveCanvas`} instances.
 * Instances will be a child element of a {@link PulsarObject | `PulsarObject`}.
 * It has an internal coordinate system which is independent of the coordinates of the canvas drawing surface for ease of use.
 * It will also watch the parent object and resize all canvases accordingly whenever the parent is resized.
 */
export class CanvasContainer extends HTMLElement {
    /**
     * Parent instance of {@link PulsarObject | `PulsarObject`}.
     */
    parent: PulsarObject
    /**
     * List of the child {@link ResponsiveCanvas | `ResponsiveCanvas`} instances of the container.
     */
    canvases: ResponsiveCanvas[] = []
    /**
     * Scale of the internal coordinate system in canvas pixels to container units.
     */
    scale: {
        x: number
        y: number
    } = {
        x: 50,
        y: 50
    }
    /**
     * The [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) instance which will watch the parent object to detect a resize event.
     */
    resizeObserver: ResizeObserver
    /**
     * The horizontal limits of the internal coordinate system in container units.
     */
    xLims: [number, number] = CanvasContainer.Defaults.xLims
    /**
     * The vertical limits of the internal coordinate system in container units.
     */
    yLims: [number, number] = CanvasContainer.Defaults.yLims
    /**
     * The origin of the internal coordinate system in canvas units.
     */
    origin: {
        x: number
        y: number
    } = CanvasContainer.Defaults.origin

    /**
     * Name | Default value
     * --- | ---
     * `xLims` | `[0, 10]`
     * `yLims` | `[-10, 0]`
     * `origin` | `{x: 0, y: 0}`
     */
    static Defaults = {
        xLims: [0, 10] as [number, number],
        yLims: [-10, 0] as [number, number],
        origin: {
            x: 0,
            y: 0
        }
    }

    /**
     * @param parent The parent {@link PulsarObject | `PulsarObject`} element.
     * @param options Options for the container.
     */
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

    /**
     * Sets the horizontal limits of the internal coordinate system in container units.
     * @param min The minimum horizontal value.
     * @param max The maximum horizontal value.
     */
    setXLims(min: number, max: number) {
        if (max > min) {
            this.xLims = validateArrayPropertyArgs([min, max], "number", 2, "xLims") as [number, number];
            this.scale.x = this.clientWidth / Math.abs(min - max);
            this.setOrigin(-min * this.scale.x, this.origin.y);
        } else {
            throw `Error setting xLims: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }

    /**
     * Sets the vertical limits of the internal coordinate system in container units.
     * @param min The minimum vertical value.
     * @param max The maximum vertical value.
     */
    setYLims(min: number, max: number) {
        if (max > min) {
            this.yLims = validateArrayPropertyArgs([min, max], "number", 2, "yLims") as [number, number];
            this.scale.y = this.clientHeight / Math.abs(min - max);
            this.setOrigin(this.origin.x, max * this.scale.y);
        } else {
            throw `Error setting yLims: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }

    /**
     * Sets the origin of the internal coordinate system in canvas pixels.
     * `x` and `y` values may be passed or the value `"centre"` may be passed to conveniently set the origin to the centre of the canvas.
     * Note that for the HTML5 canvas the origin is in the top-left corner by default and the x-axis points rightwards, while the y-axis points downwards.
     * @param point The new origin in canvas pixels.
     */
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
