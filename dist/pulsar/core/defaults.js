export const propertyDefaults = {
    ResponsiveCanvas: {
        origin: { value: [0, 0], type: "number", setter: "setAxesProperty", multi: true },
        backgroundCSS: { value: "", type: "string", setter: "setSingleProperty" }
    },
    ResponsivePlot2D: {
        majorTicks: { value: [true, true], type: "boolean", setter: "setAxesProperty", multi: true },
        minorTicks: { value: [false, false], type: "boolean", setter: "setAxesProperty", multi: true },
        majorTickSize: { value: [5, 5], type: "number", setter: "setAxesProperty", multi: true },
        minorTickSize: { value: [1, 1], type: "number", setter: "setAxesProperty", multi: true },
        majorGridlines: { value: [true, true], type: "boolean", setter: "setAxesProperty", multi: true },
        minorGridlines: { value: [false, false], type: "boolean", setter: "setAxesProperty", multi: true },
        majorGridSize: { value: [5, 5], type: "number", setter: "setAxesProperty", multi: true },
        minorGridSize: { value: [1, 1], type: "number", setter: "setAxesProperty", multi: true },
        gridScale: { value: [50, 50], type: "number", setter: "setAxesProperty", multi: true }
    },
    ResponsivePlot2DTrace: {
        traceColour: { value: "blue", type: "string", setter: "setSingleProperty" },
        traceStyle: { value: "solid", type: "string", setter: "setChoiceProperty", extra: ["solid", "dotted", "dashed", "dashdot", "none"] },
        traceWidth: { value: 3, type: "number", setter: "setSingleProperty" },
        markerColour: { value: "blue", type: "string", setter: "setSingleProperty" },
        markerStyle: { value: "none", type: "string", setter: "setChoiceProperty", extra: ["circle", "plus", "cross", "arrow", "none"] },
        markerSize: { value: 1, type: "number", setter: "setSingleProperty" },
        visibility: { value: true, type: "boolean", setter: "setSingleProperty" },
        parameterRange: { value: [0, 1], type: "number", setter: "setArrayProperty", extra: 2 }
    }
};
