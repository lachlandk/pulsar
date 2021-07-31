import { ResponsivePlot2D, ResponsivePlot2DOptions, ResponsivePlot2DTraceOptions, ResponsivePlot2DTraceDataType } from "./plotting/index.js";
export declare class Plot extends ResponsivePlot2D {
    /**
     * @param id - The ID of the plot object. Must be unique.
     * @param data - The data to be plotted. The structure of the object follows the exact same pattern as the signature of {@link ResponsivePlot2D.plot `plot()`}.
     * @param data.id - The ID for the trace. This ID will be the key for the relevant entry in the {@link ResponsivePlot2D.plotData `plotData`} property of the plot object.
     * @param data.data - The data to be plotted. See the {@link ResponsivePlot2D.plot `plot()`} method documentation for more details.
     * @param data.object - The options for the data. See the {@link ResponsivePlot2D.plot `plot()`} method documentation for more details.
     * @param options - Options for the plot.
     */
    constructor(id: string, data: {
        id: string;
        data: ResponsivePlot2DTraceDataType;
        options?: ResponsivePlot2DTraceOptions;
    }, options?: ResponsivePlot2DOptions);
}
