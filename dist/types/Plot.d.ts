import { ResponsivePlot2D, ResponsivePlot2DTraceDataType } from "./plotting/index.js";
import { OptionTypes } from "./Defaults.js";
export declare class Plot extends ResponsivePlot2D {
    /**
     * Returns an object containing the active instances of {@link Plot `Plot`}.
     */
    static activePlots(): {
        [id: string]: Plot;
    };
    /**
     * @param id - The ID of the plot object. Must be unique.
     * @param data - The data to be plotted. The structure of the object follows the exact same pattern as the signature of {@link ResponsivePlot2D.plot `plot()`}.
     * @param data.id - The ID for the trace. This ID will be the key for the relevant entry in the {@link ResponsivePlot2D.data `data`} property of the plot object.
     * @param data.data - The data to be plotted. See the {@link ResponsivePlot2D.plot `plot()`} method documentation for more details.
     * @param data.object - The options for the data. See the {@link ResponsivePlot2D.plot `plot()`} method documentation for more details.
     * @param options - Options for the plot.
     */
    constructor(id: string, data: {
        id: string;
        data: ResponsivePlot2DTraceDataType;
        options?: OptionTypes["ResponsivePlot2DTrace"];
    }, options?: OptionTypes["ResponsiveCanvas"] & OptionTypes["ResponsivePlot2D"]);
}
