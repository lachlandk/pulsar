import { Figure } from "./Figure.js";
import { Axis, AxisOptions } from "./Axis.js";
import { Trace, TraceOptions } from "./Trace.js";
import { CanvasContainer, ContainerOptions } from "../core/CanvasContainer.js";
import { ResponsiveCanvas, ResponsiveCanvasOptions } from "../core/ResponsiveCanvas.js";
import { NDArray } from "@lachlandk/quasar";

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

    plot(y: NDArray | number[], options: TraceOptions): void
    plot(x: NDArray | number[], y: NDArray | number[], options: TraceOptions): void
    plot(xOrY: NDArray | number[], yOrOptions: NDArray | number[] | TraceOptions = {}, options: TraceOptions = {}) {
        // pass rest of arguments to Trace constructor for type checking, don't care about types here so can do a naughty type conversion
        const trace = new Trace(this.foreground, ...(arguments as any as [NDArray, TraceOptions]))
        this.data.push(trace);
        return trace;
    }
}

window.customElements.define("pulsar-plot", Plot); // TODO: put this in a static method
