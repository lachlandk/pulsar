import { propertySetters } from "../helpers/propertySetters.js";

export type AxesPropertyType<Type> = [Type, Type] | Type

export const optionsObjects = {
    ResponsiveCanvas: {
        origin: {x: 0, y: 0},
        backgroundCSS: ""
    },
    ResponsivePlot2D: {
        majorTicks: {x: true, y: true},
        minorTicks: {x: false, y: false},
        majorTickSize: {x: 5, y: 5},
        minorTickSize: {x: 1, y: 1},
        majorGridlines: {x: true, y: true},
        minorGridlines: {x: false, y: false},
        majorGridSize: {x: 5, y: 5},
        minorGridSize: {x: 1, y: 1},
        gridScale: {x: 50, y: 50},
        xLims: [0, 0] as [number, number],
        yLims: [0, 0] as [number, number]
    },
    ResponsivePlot2DTrace: {
        traceColour: "blue",
        traceStyle: "solid" as "solid" | "dotted" | "dashed" | "dashdot" | "none",
        traceWidth: 3,
        markerColour: "blue",
        markerStyle: "none" as "circle" | "plus" | "cross" | "arrow" | "none",
        markerSize: 1,
        visibility: true,
        parameterRange: [0, 1] as [number, number]
    }
}

export type propertyDefaultsType = {
    [prototype: string]: {
        [property: string]: {value: unknown; type: "string" | "number" | "boolean"; setter: keyof typeof propertySetters; multi?: boolean; extra?: unknown}
    }
}

export const propertyDefaults: propertyDefaultsType = {
    ResponsiveCanvas: {
        origin: {value: [0, 0], type: "number", setter: "setAxesProperty", multi: true},
        backgroundCSS: {value: "", type: "string", setter: "setSingleProperty"}
    },
    ResponsivePlot2D: {
        majorTicks: {value: [true, true], type: "boolean", setter: "setAxesProperty", multi: true},
        minorTicks: {value: [false, false], type: "boolean", setter: "setAxesProperty", multi: true},
        majorTickSize: {value: [5, 5], type: "number", setter: "setAxesProperty", multi: true},
        minorTickSize: {value: [1, 1], type: "number", setter: "setAxesProperty", multi: true},
        majorGridlines: {value: [true, true], type: "boolean", setter: "setAxesProperty", multi: true},
        minorGridlines: {value: [false, false], type: "boolean", setter: "setAxesProperty", multi: true},
        majorGridSize: {value: [5, 5], type: "number", setter: "setAxesProperty", multi: true},
        minorGridSize: {value: [1, 1], type: "number", setter: "setAxesProperty", multi: true},
        gridScale: {value: [50, 50], type: "number", setter: "setAxesProperty", multi: true}
    },
    ResponsivePlot2DTrace: {
        traceColour: {value: "blue", type: "string", setter: "setSingleProperty"},
        traceStyle: {value: "solid", type: "string", setter: "setChoiceProperty", extra: ["solid", "dotted", "dashed", "dashdot", "none"]},
        traceWidth: {value: 3, type: "number", setter: "setSingleProperty"},
        markerColour: {value: "blue", type: "string", setter: "setSingleProperty"},
        markerStyle: {value: "none", type: "string", setter: "setChoiceProperty", extra: ["circle", "plus", "cross", "arrow", "none"]},
        markerSize: {value: 1, type: "number", setter: "setSingleProperty"},
        visibility: {value: true, type: "boolean", setter: "setSingleProperty"},
        parameterRange: {value: [0, 1], type: "number", setter: "setArrayProperty", extra: 2}
    }
}

export interface ResponsiveCanvasOptions {
    origin: AxesPropertyType<number> | "centre"
    backgroundCSS: string
}
export interface ResponsivePlot2DOptions extends ResponsiveCanvasOptions {
    majorTicks: AxesPropertyType<boolean>
    minorTicks: AxesPropertyType<boolean>
    majorTickSize: AxesPropertyType<number>
    minorTickSize: AxesPropertyType<number>
    majorGridlines: AxesPropertyType<boolean>
    minorGridlines: AxesPropertyType<boolean>
    majorGridSize: AxesPropertyType<number>
    minorGridSize: AxesPropertyType<number>
    gridScale: AxesPropertyType<number>
}
export interface ResponsivePlot2DTraceOptions {
    traceColour: string
    traceStyle: "solid" | "dotted" | "dashed" | "dashdot" | "none"
    traceWidth: number
    markerColour: string
    markerStyle: "circle" | "plus" | "cross" | "arrow" | "none"
    markerSize: number
    visibility: boolean
    parameterRange: [number, number]
}
