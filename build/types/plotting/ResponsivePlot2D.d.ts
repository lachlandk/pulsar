import { ResponsiveCanvas } from "../core/ResponsiveCanvas.js";
import { ResponsivePlot2DTrace, ResponsivePlot2DTraceDataType } from "./ResponsivePlot2DTrace.js";
import { OptionTypes } from "../Defaults.js";
/**
 * This class is the base class for all Pulsar plot objects. It extends {@link ResponsiveCanvas `ResponsiveCanvas`}.
 * A `ResponsivePlot2D` object can be created by calling the constructor, but the preferred method is to use the
 * {@link Plot `Plot`} class. `ResponsivePlot2D` objects behave similarly to a `ResponsiveCanvas`.
 * They have a background, which contains the axes and gridlines, and a foreground, which contains the plot data.
 * The ticks and gridlines can be toggled and the intervals between them can be changed.
 * Data is added to the plot using the {@link ResponsivePlot2D.addData `addData()`} method.
 * Read-only properties and methods beginning with an underscore should not be changed/called, otherwise they
 * may cause unpredictable behaviour.
 */
export declare class ResponsivePlot2D extends ResponsiveCanvas {
    properties: any;
    gridScale: {
        x: number;
        y: number;
    };
    /**
     * Contains the data trace objects for the plot instance.
     * The objects can be accessed using the trace ID as the key.
     */
    data: {
        [trace: string]: ResponsivePlot2DTrace;
    };
    /**
     * @param id The unique ID of the plot object.
     * @param options Optional parameters.
     */
    constructor(id: string, options?: OptionTypes["ResponsiveCanvas"] & OptionTypes["ResponsivePlot2D"]);
    resizeEventListener(entry: ResizeObserverEntry): void;
    /**
      * Updates the foreground function.
      */
    updatePlottingData(): void;
    /**
     * Adds a data trace to the plot. The trace must be given a unique ID, so that it can be added to the
     * {@link ResponsivePlot2D.data `data`} property of the plot object.
     * There are several ways that data can be added, which can be divided into **continuous** and **discrete** data.
     * These different methods are described by what to pass for the `data` argument.
     * @param id Unique ID for the trace.
     * @param data Data to be plotted.
     * @param options Optional parameters.
     */
    addData(id: string, data: ResponsivePlot2DTraceDataType, options?: OptionTypes["ResponsivePlot2DTrace"]): void;
    /**
     * Removes a trace from the plot.
     * @param trace ID of the trace to be removed.
     */
    removeData(trace: string): void;
    setOrigin(...point: ("centre" | number)[]): void;
    /**
     * Toggles the major ticks. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param choices Either one or two booleans.
     */
    setMajorTicks(...choices: [boolean] | [boolean, boolean]): void;
    /**
     * Toggles the minor ticks. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param choices Either one or two booleans.
     */
    setMinorTicks(...choices: [boolean] | [boolean, boolean]): void;
    /**
     * Sets the spacing of the major ticks (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setMajorTickSize(...sizes: [number] | [number, number]): void;
    /**
     * Sets the spacing of the minor ticks (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setMinorTickSize(...sizes: [number] | [number, number]): void;
    /**
     * Toggles the major gridlines. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param choices Either one or two booleans.
     */
    setMajorGridlines(...choices: [boolean] | [boolean, boolean]): void;
    /**
     * Toggles the minor gridlines. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param choices Either one or two booleans.
     */
    setMinorGridlines(...choices: [boolean] | [boolean, boolean]): void;
    /**
     * Sets the spacing of the major gridlines (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setMajorGridSize(...sizes: [number] | [number, number]): void;
    /**
     * Sets the spacing of the minor gridlines (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setMinorGridSize(...sizes: [number] | [number, number]): void;
    /**
     * Changes the range of `x` values to be shown on the plot by moving the origin and altering the grid scale.
     * @param min The minimum value of `x`.
     * @param max The maximum value of `x`.
     */
    setXLims(min: number, max: number): void;
    /**
     * Changes the range of `y` values to be shown on the plot by moving the origin and altering the grid scale.
     * @param min The minimum value of `y`.
     * @param max The maximum value of `y`.
     */
    setYLims(min: number, max: number): void;
    show(element: string | Element): void;
}
