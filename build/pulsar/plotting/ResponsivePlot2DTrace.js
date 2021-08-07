import { propertySetters, setupProperties, discreteFunctionGenerator, discreteMapGenerator, parametricFunctionGenerator, continuousFunctionGenerator } from "../helpers/index.js";
/**
 *  This plot represents a trace on a {@link ResponsivePlot2D `ResponsivePlot2D`}.
 */
export class ResponsivePlot2DTrace {
    /**
     * @param plot The parent plot.
     * @param data Data to be plotted.
     * @param options Optional parameters.
     */
    constructor(plot, data, options) {
        this.properties = {
            traceColour: "blue",
            traceStyle: "solid",
            traceWidth: 3,
            markerColour: "blue",
            markerStyle: "none",
            markerSize: 1,
            visibility: true,
            parameterRange: [0, 1]
        };
        this.plot = plot; // TODO: remove necessity for this with events?
        setupProperties(this, "ResponsivePlot2DTrace", options);
        if (Array.isArray(data) && data.length === 2) {
            if (Array.isArray(data[0])) {
                if (Array.isArray(data[1])) { // discrete points
                    if (data[0].length !== data[1].length) {
                        throw "Error setting plot data: Lengths of data arrays are not equal.";
                    }
                    for (let i = 0; i < data[0].length; i++) {
                        const xValue = typeof data[0][i] === "function" ? data[0][i](0) : data[0][i];
                        const yValue = typeof data[1][i] === "function" ? data[1][i](0, 0) : data[1][i];
                        if (typeof xValue !== "number" || typeof yValue !== "number") {
                            throw "Error setting plot data: Data arrays contain types which are not numbers.";
                        }
                    }
                    this.data = discreteFunctionGenerator(data);
                }
                else if (typeof data[1] === "function") { // discrete map
                    if (typeof data[1](0, 0) !== "number") {
                        throw "Error setting plot data: Plot function does not return numbers.";
                    }
                    for (let i = 0; i < data[0].length; i++) {
                        if (typeof data[0][i] !== "number") {
                            throw "Error setting plot data: Data array contains types which are not numbers.";
                        }
                    }
                    this.data = discreteMapGenerator(data);
                }
            }
            else if (typeof data[0] === "function" && typeof data[1] === "function") { // parametric function
                if (typeof data[0](0, 0) !== "number" || typeof data[1](0, 0) !== "number") {
                    throw "Error setting plot data: Plot function does not return numbers.";
                }
                this.data = parametricFunctionGenerator(data);
            }
        }
        else if (typeof data === "function") { // continuous function
            if (typeof data(0, 0) !== "number") {
                throw "Error setting plot data: Plot function does not return numbers.";
            }
            this.data = continuousFunctionGenerator(data);
        }
        else {
            throw `Error setting plot data: Unrecognised data signature ${data}.`;
        }
    }
    /**
     * Sets the colour of the specified trace. The specified colour must be one of the browser-recognised colours.
     * @param trace The ID of the trace to be updated.
     * @param colour The name of the colour.
     */
    setTraceColour(colour) {
        propertySetters.setSingleProperty(this, "traceColour", "string", colour);
        this.plot.updatePlottingData();
    }
    /**
     * Sets the style of the specified trace. Possible styles are: `solid`, `dotted`, `dashed`, `dashdot`, or `none`.
     * @param trace The ID of the trace to be updated.
     * @param style The name of the style.
     */
    setTraceStyle(style) {
        propertySetters.setChoiceProperty(this, "traceStyle", "string", style, ["solid", "dotted", "dashed", "dashdot", "none"]);
        this.plot.updatePlottingData();
    }
    /**
     * Sets the width of the specified trace (in pixels).
     * @param trace The ID of the trace to be updated.
     * @param width The width of the trace in pixels.
     */
    setTraceWidth(width) {
        propertySetters.setSingleProperty(this, "traceWidth", "number", width);
        this.plot.updatePlottingData();
    }
    /**
     * Sets the colour of the markers on the specified trace. The specified colour must be one of the browser-recognised colours.
     * @param trace The ID of the trace to be updated.
     * @param colour The name of the colour.
     */
    setMarkerColour(colour) {
        propertySetters.setSingleProperty(this, "markerColour", "string", colour);
        this.plot.updatePlottingData();
    }
    /**
     * Sets the style of the markers the specified trace. Possible styles are: `circle`, `plus`, `cross`, `arrow`, or `none`.
     * @param trace The ID of the trace to be updated.
     * @param style The name of the style.
     */
    setMarkerStyle(style) {
        propertySetters.setChoiceProperty(this, "markerStyle", "string", style, ["circle", "plus", "cross", "arrow", "none"]);
        this.plot.updatePlottingData();
    }
    /**
     * Sets the width of the markers on the specified trace (in pixels).
     * @param trace The ID of the trace to be updated.
     * @param size The size of the markers in pixels.
     */
    setMarkerSize(size) {
        propertySetters.setSingleProperty(this, "markerSize", "number", size);
        this.plot.updatePlottingData();
    }
    /**
     * Toggles the visibility of the specified trace.
     * @param trace The ID of the trace to be updated.
     * @param value Set to `true` for the trace to be visible, `false` for it to be hidden.
     */
    setVisibility(value) {
        propertySetters.setSingleProperty(this, "visibility", "boolean", value);
        this.plot.updatePlottingData();
    }
    /**
     * Sets the range of values over which a parameter should be plotted.
     * This property has no effect at all if the function plotted does not have a free parameter.
     * @param trace The ID of the trace to be updated.
     * @param min The minimum value of the free parameter.
     * @param max The maximum value of the free parameter.
     */
    setParameterRange(min, max) {
        if (max >= min) {
            propertySetters.setArrayProperty(this, "parameterRange", "number", [min, max], 2);
            this.plot.updatePlottingData();
        }
        else {
            throw `Error setting parameterRange: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }
}
