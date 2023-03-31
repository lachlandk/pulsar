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

/**
 * Represents the actual plotting surface of a figure.
 * This class is analogous to the [Axes](https://matplotlib.org/stable/api/axes_api.html) class in matplotlib.
 * Each instance contains two {@link ResponsiveCanvas} instances, one for the background of the plot (axes, gridlines, etc.) and one for the foreground (data).
 * An {@link Axis | `Axis`} attached to the plot is also created by default.
 * Options for all these objects can be passed through the `background`, `foreground` and `axis` properties respectively in the options object.
 * Plots contain their own coordinate system ("plot units") which are independent of the canvas coordinate system.
 * The origin of this coordinate system can be set using {@link setOrigin | `setOrigin()`}.
 */
export class Plot extends CanvasContainer {
    /**
     * Background canvas which contains static plot elements like axes and gridlines.
     */
    background: ResponsiveCanvas
    /**
     * Foreground canvas which contains dynamic plot elements like data traces.
     */
    foreground: ResponsiveCanvas
    /**
     * Component which draws the axes.
     */
    axis: Axis
    /**
     * List of data traces present on the plot.
     */
    data: Trace[] = []

    static Defaults = {
        ...CanvasContainer.Defaults
    }

    /**
     * @param figure The parent figure element.
     * @param options Options for the plot.
     */
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

    /** @hidden (TODO: sort out overloads in generated documentation) */
    plot(y: NDArray | number[], options: TraceOptions): void
    /**
     * Adds data to the plot.
     * `x` argument is optional. If it is omitted, the x data becomes the indices of the y data array.
     * See [plot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html) function from matplotlib.
     * @param x Data for the x-axis.
     * @param y Data for the y-axis
     * @param options Options for the data.
     * @returns The data trace object.
     */
    plot(x: NDArray | number[], y: NDArray | number[], options: TraceOptions): void
    plot(xOrY: NDArray | number[], yOrOptions: NDArray | number[] | TraceOptions = {}, options: TraceOptions = {}) {
        // pass rest of arguments to Trace constructor for type checking, don't care about types here so can do a naughty type conversion
        const trace = new Trace(this.foreground, ...(arguments as any as [NDArray, TraceOptions]))
        this.data.push(trace);
        return trace;
    }
}

window.customElements.define("pulsar-plot", Plot); // TODO: put this in a static method
