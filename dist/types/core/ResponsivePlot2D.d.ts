import { ResponsiveCanvasOptions, ResponsiveCanvas } from "./ResponsiveCanvas.js";
export interface ResponsivePlot2DOptions extends ResponsiveCanvasOptions {
    majorTicks?: [boolean, boolean] | boolean;
    minorTicks?: [boolean, boolean] | boolean;
    majorTickSize?: [number, number] | number;
    minorTickSize?: [number, number] | number;
    majorGridlines?: [boolean, boolean] | boolean;
    minorGridlines?: [boolean, boolean] | boolean;
    majorGridSize?: [number, number] | number;
    minorGridSize?: [number, number] | number;
    gridScale?: [number, number] | number;
}
export interface ResponsivePlot2DTraceOptions {
    traceColour?: string;
    traceStyle?: "solid" | "dotted" | "dashed" | "dashdot" | "none";
    traceWidth?: number;
    markerColour?: string;
    markerStyle?: "circle" | "plus" | "cross" | "arrow" | "none";
    markerSize?: number;
    visibility?: boolean;
    parameterRange?: [number, number];
}
interface ResponsivePlot2DTraceObject {
    data: (t: number, xLims: [number, number], yLims: [number, number], step: number, paramLims: [number, number]) => Generator<[number, number]>;
    properties: {
        traceColour: string;
        traceStyle: "solid" | "dotted" | "dashed" | "dashdot" | "none";
        traceWidth: number;
        markerColour: string;
        markerStyle: "circle" | "plus" | "cross" | "arrow" | "none";
        markerSize: number;
        visibility: boolean;
        parameterRange: [number, number];
    };
}
export declare type ResponsivePlot2DTraceDataType = (x: number, t: number) => number | [
    (p: number, t: number) => number,
    (p: number, t: number) => number
] | [
    number[],
    (x: number, t: number) => number
] | [
    (number | ((t: number) => number))[],
    (number | ((x: number, t: number) => number))[]
];
/**
 * This class is the base class for all Pulsar plot objects. It extends {@link ResponsiveCanvas `ResponsiveCanvas`}.
 * A `ResponsivePlot2D` object can be created by calling the constructor, but the preferred method is to use the
 * {@link Plot `Plot`} class. `ResponsivePlot2D` objects behave similarly to a `ResponsiveCanvas`.
 * They have a background, which contains the axes and gridlines, and a foreground, which contains the plot data.
 * The ticks and gridlines can be toggled and the intervals between them can be changed. The size of a unit on the grid
 * is determined by the grid scale which, by default, is 50 pixels for both `x` and `y`, meaning that a step of one unit in both directions on
 * the grid would be 50 pixels on the screen. This can be changed with the {@link ResponsivePlot2D.setGridScale `setGridScale()`} method.
 * Data is added to the plot using the {@link ResponsivePlot2D.plot `plot()`} method.
 * Read-only properties and methods beginning with an underscore should not be changed/called, otherwise they
 * may cause unpredictable behaviour.
 */
export declare class ResponsivePlot2D extends ResponsiveCanvas {
    properties: {
        origin: {
            x: number;
            y: number;
        };
        backgroundCSS: string;
        majorTicks: {
            x: boolean;
            y: boolean;
        };
        minorTicks: {
            x: boolean;
            y: boolean;
        };
        majorTickSize: {
            x: number;
            y: number;
        };
        minorTickSize: {
            x: number;
            y: number;
        };
        majorGridlines: {
            x: boolean;
            y: boolean;
        };
        minorGridlines: {
            x: boolean;
            y: boolean;
        };
        majorGridSize: {
            x: number;
            y: number;
        };
        minorGridSize: {
            x: number;
            y: number;
        };
        gridScale: {
            x: number;
            y: number;
        };
        xLims: [number, number];
        yLims: [number, number];
    };
    /**
     * Contains the data trace objects for the plot instance.
     * The objects can be accessed using the trace ID as the key.
     */
    plotData: {
        [trace: string]: ResponsivePlot2DTraceObject;
    };
    /**
     * @param id The unique ID of the plot object.
     * @param options Optional parameters.
     */
    constructor(id: string, options?: ResponsivePlot2DOptions);
    protected _updateLimits(): void;
    protected _updatePlottingData(): void;
    /**
     * Adds a data trace to the plot. The trace must be given a unique ID, so that it can be added to the
     * {@link ResponsivePlot2D.plotData `plotData`} property of the plot object.
     * There are several ways that data can be added, which can be divided into **continuous** and **discrete** data.
     * These different methods are described by what to pass for the `data` argument.
     * @param id Unique ID for the trace.
     * @param data Data to be plotted.
     * @param options Optional parameters.
     */
    plot(id: string, data: ResponsivePlot2DTraceDataType, options?: Partial<ResponsivePlot2DTraceOptions>): void;
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
     * Sets the size of 1 grid unit in pixels. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setGridScale(...sizes: [number] | [number, number]): void;
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
    /**
     * Sets the colour of the specified trace. The specified colour must be one of the browser-recognised colours.
     * @param trace The ID of the trace to be updated.
     * @param colour The name of the colour.
     */
    setTraceColour(trace: string, colour: string): void;
    /**
     * Sets the style of the specified trace. Possible styles are: `solid`, `dotted`, `dashed`, `dashdot`, or `none`.
     * @param trace The ID of the trace to be updated.
     * @param style The name of the style.
     */
    setTraceStyle(trace: string, style: string): void;
    /**
     * Sets the width of the specified trace (in pixels).
     * @param trace The ID of the trace to be updated.
     * @param width The width of the trace in pixels.
     */
    setTraceWidth(trace: string, width: number): void;
    /**
     * Sets the colour of the markers on the specified trace. The specified colour must be one of the browser-recognised colours.
     * @param trace The ID of the trace to be updated.
     * @param colour The name of the colour.
     */
    setMarkerColour(trace: string, colour: string): void;
    /**
     * Sets the style of the markers the specified trace. Possible styles are: `circle`, `plus`, `cross`, `arrow`, or `none`.
     * @param trace The ID of the trace to be updated.
     * @param style The name of the style.
     */
    setMarkerStyle(trace: string, style: string): void;
    /**
     * Sets the width of the markers on the specified trace (in pixels).
     * @param trace The ID of the trace to be updated.
     * @param size The size of the markers in pixels.
     */
    setMarkerSize(trace: string, size: number): void;
    /**
     * Toggles the visibility of the specified trace.
     * @param trace The ID of the trace to be updated.
     * @param value Set to `true` for the trace to be visible, `false` for it to be hidden.
     */
    setVisibility(trace: string, value: boolean): void;
    /**
     * Sets the range of values over which a parameter should be plotted.
     * This property has no effect at all if the function plotted does not have a free parameter.
     * @param trace The ID of the trace to be updated.
     * @param min The minimum value of the free parameter.
     * @param max The maximum value of the free parameter.
     */
    setParameterRange(trace: string, min: number, max: number): void;
}
export {};
