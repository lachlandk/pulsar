import { ResponsiveCanvasObject, ResponsiveCanvas } from "./ResponsiveCanvas.js";
import { choice2D, point2D } from "../helpers/index.js";
import { ResponsivePlot2DOptions, ResponsivePlot2DTraceOptions } from "./defaults.js";
export interface ResponsivePlot2DObject extends ResponsiveCanvasObject {
    properties: ResponsiveCanvasObject["properties"] & {
        majorTicks: choice2D;
        minorTicks: choice2D;
        majorTickSize: point2D;
        minorTickSize: point2D;
        majorGridlines: choice2D;
        minorGridlines: choice2D;
        majorGridSize: point2D;
        minorGridSize: point2D;
        gridScale: point2D;
        xLims: [number, number];
        yLims: [number, number];
    };
    plotData: {
        [trace: string]: ResponsivePlot2DTraceObject;
    };
    plot: (id: string, data: ResponsivePlot2DTraceDataType, options: ResponsivePlot2DTraceOptions) => void;
    removeData: (id: string) => void;
    setMajorTicks: (...choices: [boolean] | [boolean, boolean]) => void;
    setMinorTicks: (...choices: [boolean] | [boolean, boolean]) => void;
    setMajorTickSize: (...sizes: [number] | [number, number]) => void;
    setMinorTickSize: (...sizes: [number] | [number, number]) => void;
    setMajorGridlines: (...choices: [boolean] | [boolean, boolean]) => void;
    setMinorGridlines: (...choices: [boolean] | [boolean, boolean]) => void;
    setMajorGridSize: (...sizes: [number] | [number, number]) => void;
    setMinorGridSize: (...sizes: [number] | [number, number]) => void;
    setGridScale: (...sizes: [number] | [number, number]) => void;
    setXLims: (min: number, max: number) => void;
    setYLims: (min: number, max: number) => void;
    setTraceColour: (trace: string, colour: string) => void;
    setTraceStyle: (trace: string, style: string) => void;
    setTraceWidth: (trace: string, width: number) => void;
    setMarkerColour: (trace: string, colour: string) => void;
    setMarkerStyle: (trace: string, style: string) => void;
    setMarkerSize: (trace: string, size: number) => void;
    setVisibility: (trace: string, value: boolean) => void;
    setParameterRange: (trace: string, min: number, max: number) => void;
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
export declare class ResponsivePlot2D extends ResponsiveCanvas implements ResponsivePlot2DObject {
    properties: ResponsivePlot2DObject["properties"];
    plotData: ResponsivePlot2DObject["plotData"];
    constructor(id: string, options?: Partial<ResponsivePlot2DOptions>);
    protected _updateLimits(): void;
    protected _updatePlottingData(): void;
    plot(id: string, data: ResponsivePlot2DTraceDataType, options?: Partial<ResponsivePlot2DTraceOptions>): void;
    removeData(trace: string): void;
    setOrigin(...point: ("centre" | number)[]): void;
    setMajorTicks(...choices: [boolean] | [boolean, boolean]): void;
    setMinorTicks(...choices: [boolean] | [boolean, boolean]): void;
    setMajorTickSize(...sizes: [number] | [number, number]): void;
    setMinorTickSize(...sizes: [number] | [number, number]): void;
    setMajorGridlines(...choices: [boolean] | [boolean, boolean]): void;
    setMinorGridlines(...choices: [boolean] | [boolean, boolean]): void;
    setMajorGridSize(...sizes: [number] | [number, number]): void;
    setMinorGridSize(...sizes: [number] | [number, number]): void;
    setGridScale(...sizes: [number] | [number, number]): void;
    setXLims(min: number, max: number): void;
    setYLims(min: number, max: number): void;
    setTraceColour(trace: string, colour: string): void;
    setTraceStyle(trace: string, style: string): void;
    setTraceWidth(trace: string, width: number): void;
    setMarkerColour(trace: string, colour: string): void;
    setMarkerStyle(trace: string, style: string): void;
    setMarkerSize(trace: string, size: number): void;
    setVisibility(trace: string, value: boolean): void;
    setParameterRange(trace: string, min: number, max: number): void;
}
export {};
