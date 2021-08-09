import { ResponsivePlot2D } from "./ResponsivePlot2D.js";
import { OptionTypes } from "../Defaults.js";
export declare type ResponsivePlot2DTraceDataType = (x: number, t: number) => number | ((p: number, t: number) => number)[] | (number[] | ((x: number, t: number) => number))[] | ((number | ((t: number) => number))[] | (number | ((x: number, t: number) => number))[])[];
/**
 *  This plot represents a trace on a {@link ResponsivePlot2D `ResponsivePlot2D`}.
 */
export declare class ResponsivePlot2DTrace {
    plot: ResponsivePlot2D;
    data: (t: number, xLims: [number, number], yLims: [number, number], step: number, paramLims: [number, number]) => Generator<[number, number]>;
    properties: any;
    /**
     * @param plot The parent plot.
     * @param data Data to be plotted.
     * @param options Optional parameters.
     */
    constructor(plot: ResponsivePlot2D, data: ResponsivePlot2DTraceDataType, options?: OptionTypes["ResponsivePlot2DTrace"]);
    /**
     * Sets the colour of the specified trace. The specified colour must be one of the browser-recognised colours.
     * @param trace The ID of the trace to be updated.
     * @param colour The name of the colour.
     */
    setTraceColour(colour: string): void;
    /**
     * Sets the style of the specified trace. Possible styles are: `solid`, `dotted`, `dashed`, `dashdot`, or `none`.
     * @param trace The ID of the trace to be updated.
     * @param style The name of the style.
     */
    setTraceStyle(style: string): void;
    /**
     * Sets the width of the specified trace (in pixels).
     * @param trace The ID of the trace to be updated.
     * @param width The width of the trace in pixels.
     */
    setTraceWidth(width: number): void;
    /**
     * Sets the colour of the markers on the specified trace. The specified colour must be one of the browser-recognised colours.
     * @param trace The ID of the trace to be updated.
     * @param colour The name of the colour.
     */
    setMarkerColour(colour: string): void;
    /**
     * Sets the style of the markers the specified trace. Possible styles are: `circle`, `plus`, `cross`, `arrow`, or `none`.
     * @param trace The ID of the trace to be updated.
     * @param style The name of the style.
     */
    setMarkerStyle(style: string): void;
    /**
     * Sets the width of the markers on the specified trace (in pixels).
     * @param trace The ID of the trace to be updated.
     * @param size The size of the markers in pixels.
     */
    setMarkerSize(size: number): void;
    /**
     * Toggles the visibility of the specified trace.
     * @param trace The ID of the trace to be updated.
     * @param value Set to `true` for the trace to be visible, `false` for it to be hidden.
     */
    setVisibility(value: boolean): void;
    /**
     * Sets the range of values over which a parameter should be plotted.
     * This property has no effect at all if the function plotted does not have a free parameter.
     * @param trace The ID of the trace to be updated.
     * @param min The minimum value of the free parameter.
     * @param max The maximum value of the free parameter.
     */
    setParameterRange(min: number, max: number): void;
}
