import { propertySetters } from "../helpers/propertySetters.js";
export declare type AxesPropertyType<Type> = [Type, Type] | Type;
export declare const optionsObjects: {
    ResponsiveCanvas: {
        origin: {
            x: number;
            y: number;
        };
        backgroundCSS: string;
    };
    ResponsivePlot2D: {
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
    ResponsivePlot2DTrace: {
        traceColour: string;
        traceStyle: "solid" | "dotted" | "dashed" | "dashdot" | "none";
        traceWidth: number;
        markerColour: string;
        markerStyle: "none" | "circle" | "plus" | "cross" | "arrow";
        markerSize: number;
        visibility: boolean;
        parameterRange: [number, number];
    };
};
export declare type propertyDefaultsType = {
    [prototype: string]: {
        [property: string]: {
            value: unknown;
            type: "string" | "number" | "boolean";
            setter: keyof typeof propertySetters;
            multi?: boolean;
            extra?: unknown;
        };
    };
};
export declare const propertyDefaults: propertyDefaultsType;
export interface ResponsiveCanvasOptions {
    origin: AxesPropertyType<number> | "centre";
    backgroundCSS: string;
}
export interface ResponsivePlot2DOptions extends ResponsiveCanvasOptions {
    majorTicks: AxesPropertyType<boolean>;
    minorTicks: AxesPropertyType<boolean>;
    majorTickSize: AxesPropertyType<number>;
    minorTickSize: AxesPropertyType<number>;
    majorGridlines: AxesPropertyType<boolean>;
    minorGridlines: AxesPropertyType<boolean>;
    majorGridSize: AxesPropertyType<number>;
    minorGridSize: AxesPropertyType<number>;
    gridScale: AxesPropertyType<number>;
}
export interface ResponsivePlot2DTraceOptions {
    traceColour: string;
    traceStyle: "solid" | "dotted" | "dashed" | "dashdot" | "none";
    traceWidth: number;
    markerColour: string;
    markerStyle: "circle" | "plus" | "cross" | "arrow" | "none";
    markerSize: number;
    visibility: boolean;
    parameterRange: [number, number];
}
