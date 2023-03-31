import { Plot, PlotOptions } from "./Plot.js";
import { PulsarObject } from "../core/PulsarObject.js";

export type FigureOptions = Partial<{
    plot: PlotOptions
}>

/**
 * Top-level element for plotting. An instance of `Figure` typically contains one or more {@link Plot | `Plot`} instances which have data plotted on them.
 * This is analogous to the [Figure](https://matplotlib.org/stable/api/figure_api.html) class in matplotlib.
 * By default, a single plot is created on the new instance with the options passed through the `plot` property of the options object.
 */
export class Figure extends PulsarObject {
    /**
     * @param options Options for the figure.
     */
    constructor(options: FigureOptions = {}) {
        super();

        for (const option in options) {
            const setter = `set${option.charAt(0).toUpperCase()}${option.slice(1)}`
            if (typeof (this as any)[setter] === "function") {
                (this as any)[setter](...(Array.isArray((options as any)[option]) ? (options as any)[option] : [(options as any)[option]]));
            }
        }

        new Plot(this, options.plot);
    }
}

window.customElements.define("pulsar-figure", Figure); // put this in a static method
