import { Plot, PlotOptions } from "./Plot.js";
import { PulsarObject } from "../core/PulsarObject.js";

export type FigureOptions = Partial<{
    plot: PlotOptions
}>

export class Figure extends PulsarObject {

    static Defaults = {

    }

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
