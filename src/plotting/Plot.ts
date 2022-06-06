import { Figure } from "./Figure.js";
import { Axis, AxisOptions } from "./Axis.js";
import { Trace, TraceOptions } from "./Trace.js";
import {CanvasContainer, ContainerOptions} from "../core/CanvasContainer.js";
import {ResponsiveCanvas, ResponsiveCanvasOptions} from "../core/ResponsiveCanvas.js";
import { arange, array, NDArray } from "@lachlandk/quasar";

export type PlotOptions = ContainerOptions & Partial<{
    background: ResponsiveCanvasOptions
    foreground: ResponsiveCanvasOptions
    axis: AxisOptions
}>

export class Plot extends CanvasContainer {
    background: ResponsiveCanvas
    foreground: ResponsiveCanvas
    axis: Axis
    data: Trace[] = []

    static Defaults = {
        ...CanvasContainer.Defaults
    }

    constructor(figure: Figure, options: PlotOptions = {}) {
        super(figure, options);

        for (const option in options) {
            const setter = `set${option.charAt(0).toUpperCase()}${option.slice(1)}`
            if (typeof (this as any)[setter] === "function") {
                (this as any)[setter](...(Array.isArray((options as any)[option]) ? (options as any)[option] : [(options as any)[option]]));
            }
        }

        this.background = new ResponsiveCanvas(this, options.background);
        this.foreground = new ResponsiveCanvas(this, options.foreground);

        this.axis = new Axis(this.background, options.axis);
    }

    plot(y: NDArray | number[], options?: TraceOptions): void
    plot(x: NDArray | number[], y: NDArray | number[], options?: TraceOptions): void
    plot(xOrY: NDArray | number[], yOrOptions: NDArray | number[] | TraceOptions = {}, options: TraceOptions = {}) {
        if (Array.isArray(xOrY)) xOrY = array(xOrY);
        if (Array.isArray(yOrOptions)) yOrOptions = array(yOrOptions);
        const y = yOrOptions instanceof NDArray ? yOrOptions : xOrY;
        const x = yOrOptions instanceof NDArray ? xOrY : arange(y.size);
        options = yOrOptions instanceof NDArray ? options : yOrOptions;
        if (x.shape.length !== 1 || y.shape.length !== 1) {
            throw `Error: Plot data arrays must be 1-dimensional.`;
        }
        if (x.size !== y.size) {
            throw `Error: Plot data arrays must be the same length. x has length ${x.shape[0]}, y has length ${y.shape[0]}.`
        }
        this.data.push(new Trace(this.foreground, x, y, options));
    }
}

window.customElements.define("pulsar-plot", Plot); // put this in a static method
