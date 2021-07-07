import { ResponsivePlot2D, ResponsivePlot2DObject, ResponsivePlot2DOptions, ResponsivePlot2DTraceOptions, ResponsivePlot2DTraceDataType } from "../core/index.js";
export interface PlotObject extends ResponsivePlot2DObject {
}
export declare class Plot extends ResponsivePlot2D implements PlotObject {
    constructor(id: string, data: {
        id: string;
        data: ResponsivePlot2DTraceDataType;
        options: Partial<ResponsivePlot2DTraceOptions>;
    }, options?: Partial<ResponsivePlot2DOptions>);
}
