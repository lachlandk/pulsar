import { ResponsiveCanvas } from "./ResponsiveCanvas.js";
import { propertySetters, setupProperties } from "../helpers/index.js";
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
export class ResponsivePlot2D extends ResponsiveCanvas {
    /**
     * @param id The unique ID of the plot object.
     * @param options Optional parameters.
     */
    constructor(id, options = {}) {
        super(id, options);
        this.properties = {
            origin: { x: 0, y: 0 },
            backgroundCSS: "",
            majorTicks: { x: true, y: true },
            minorTicks: { x: false, y: false },
            majorTickSize: { x: 5, y: 5 },
            minorTickSize: { x: 1, y: 1 },
            majorGridlines: { x: true, y: true },
            minorGridlines: { x: false, y: false },
            majorGridSize: { x: 5, y: 5 },
            minorGridSize: { x: 1, y: 1 },
            gridScale: { x: 50, y: 50 },
            xLims: [-0, 0],
            yLims: [-0, 0]
        };
        /**
         * Contains the data trace objects for the plot instance.
         * The objects can be accessed using the trace ID as the key.
         */
        this.plotData = {};
        setupProperties(this, "ResponsiveCanvas", options);
        setupProperties(this, "ResponsivePlot2D", options); // TODO: remove gridScale from possible options
        this._updateLimits();
        this.setBackground(context => {
            const drawGridSet = (majorOrMinor, xy, ticksOrGridlines, width, lineStart, lineEnd) => {
                const offset = width % 2 === 0 ? 0 : 0.5;
                const intervalSize = this.properties[`${majorOrMinor + (ticksOrGridlines === "Ticks" ? "TickSize" : "GridSize")}`][xy];
                context.lineWidth = width;
                if (this.properties[`${majorOrMinor}${ticksOrGridlines}`][xy]) {
                    context.beginPath();
                    let currentValue = -Math.floor(this.properties.origin[xy] / (intervalSize * this.properties.gridScale[xy])) * intervalSize * this.properties.gridScale[xy];
                    if (xy === "x") {
                        while (currentValue < this._displayData.width - this.properties.origin.x) {
                            context.moveTo(currentValue + offset, lineStart);
                            context.lineTo(currentValue + offset, lineEnd);
                            currentValue += this.properties.gridScale.x * intervalSize;
                        }
                    }
                    else if (xy === "y") {
                        while (currentValue < this._displayData.height - this.properties.origin.y) {
                            context.moveTo(lineStart, currentValue + offset);
                            context.lineTo(lineEnd, currentValue + offset);
                            currentValue += this.properties.gridScale.y * intervalSize;
                        }
                    }
                    context.stroke();
                }
            };
            context.lineCap = "square";
            context.strokeStyle = "rgb(0, 0, 0)";
            drawGridSet("minor", "x", "Gridlines", 1, -this.properties.origin.y, this._displayData.height - this.properties.origin.y);
            drawGridSet("minor", "y", "Gridlines", 1, -this.properties.origin.x, this._displayData.width - this.properties.origin.x);
            drawGridSet("major", "x", "Gridlines", 2, -this.properties.origin.y, this._displayData.height - this.properties.origin.y);
            drawGridSet("major", "y", "Gridlines", 2, -this.properties.origin.x, this._displayData.width - this.properties.origin.x);
            drawGridSet("minor", "x", "Ticks", 1, -3, 3);
            drawGridSet("minor", "y", "Ticks", 1, -3, 3);
            drawGridSet("major", "x", "Ticks", 2, -6, 6);
            drawGridSet("major", "y", "Ticks", 2, -6, 6);
            context.beginPath();
            context.lineWidth = 3;
            context.moveTo(0.5, -this.properties.origin.y);
            context.lineTo(0.5, this._displayData.height - this.properties.origin.y);
            context.moveTo(-this.properties.origin.x, 0.5);
            context.lineTo(this._displayData.width - this.properties.origin.x, 0.5);
            context.stroke();
        });
    }
    _updateLimits() {
        this.properties.xLims = [-this.properties.origin.x / this.properties.gridScale.x, (this._displayData.width - this.properties.origin.x) / this.properties.gridScale.x];
        this.properties.yLims = [-this.properties.origin.y / this.properties.gridScale.y, (this._displayData.height - this.properties.origin.y) / this.properties.gridScale.y];
    }
    /**
      * Updates the foreground function.
      */
    updatePlottingData() {
        this.setForeground((context, timeValue) => {
            for (const datasetID of Object.keys(this.plotData)) {
                if (this.plotData[datasetID].properties.visibility) {
                    const dataset = this.plotData[datasetID];
                    if (dataset.properties.traceStyle !== "none") {
                        context.strokeStyle = dataset.properties.traceColour;
                        context.lineWidth = dataset.properties.traceWidth;
                        context.lineJoin = "round";
                        switch (dataset.properties.traceStyle) {
                            case "solid":
                                context.setLineDash([]);
                                break;
                            case "dotted":
                                context.setLineDash([3, 3]);
                                break;
                            case "dashed":
                                context.setLineDash([10, 10]);
                                break;
                            case "dashdot":
                                context.setLineDash([15, 3, 3, 3]);
                                break;
                        }
                        const dataGenerator = dataset.data(timeValue, this.properties.xLims, this.properties.yLims, 0.01, dataset.properties.parameterRange);
                        context.beginPath();
                        for (const currentPoint of dataGenerator) {
                            if (!Number.isSafeInteger(Math.round(currentPoint[1]))) {
                                currentPoint[1] = currentPoint[1] > 0 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
                            }
                            context.lineTo(currentPoint[0] * this.properties.gridScale.x, -currentPoint[1] * this.properties.gridScale.y);
                        }
                        context.stroke();
                    }
                    if (dataset.properties.markerStyle !== "none") {
                        const markerSize = dataset.properties.markerSize;
                        context.strokeStyle = dataset.properties.markerColour;
                        context.fillStyle = dataset.properties.markerColour;
                        context.lineWidth = 2 * markerSize;
                        const drawMarker = (() => {
                            switch (dataset.properties.markerStyle) {
                                case "circle":
                                    return (context, x, y) => {
                                        context.arc(x, y, 5 * markerSize, 0, 2 * Math.PI);
                                        context.fill();
                                    };
                                case "plus":
                                    return (context, x, y) => {
                                        context.moveTo(x, y + 5 * markerSize);
                                        context.lineTo(x, y - 5 * markerSize);
                                        context.moveTo(x + 5 * markerSize, y);
                                        context.lineTo(x - 5 * markerSize, y);
                                        context.stroke();
                                    };
                                case "cross":
                                    return (context, x, y) => {
                                        context.moveTo(x + 5 * markerSize, y + 5 * markerSize);
                                        context.lineTo(x - 5 * markerSize, y - 5 * markerSize);
                                        context.moveTo(x - 5 * markerSize, y + 5 * markerSize);
                                        context.lineTo(x + 5 * markerSize, y - 5 * markerSize);
                                        context.stroke();
                                    };
                                case "arrow":
                                    return (context, x, y, theta) => {
                                        if (!isNaN(theta)) {
                                            context.translate(x, y);
                                            context.rotate(-theta - Math.PI / 2);
                                            context.moveTo(0, -7 * markerSize);
                                            context.lineTo(-5 * markerSize, 7 * markerSize);
                                            context.lineTo(5 * markerSize, 7 * markerSize);
                                            context.lineTo(0, -7 * markerSize);
                                            context.fill();
                                            context.rotate(theta + Math.PI / 2);
                                            context.translate(-x, -y);
                                        }
                                    };
                            }
                        })();
                        const dataGenerator = dataset.data(timeValue, this.properties.xLims, this.properties.yLims, 0.001, dataset.properties.parameterRange);
                        let lastPoint = [NaN, NaN];
                        for (const currentPoint of dataGenerator) {
                            context.beginPath();
                            const point = [currentPoint[0] * this.properties.gridScale.x, -currentPoint[1] * this.properties.gridScale.y];
                            const angle = Math.atan2(point[1] - lastPoint[1], -point[0] + lastPoint[0]);
                            drawMarker(context, ...point, angle);
                            lastPoint = point;
                        }
                    }
                }
            }
        });
    }
    /**
     * Adds a data trace to the plot. The trace must be given a unique ID, so that it can be added to the
     * {@link ResponsivePlot2D.plotData `plotData`} property of the plot object.
     * There are several ways that data can be added, which can be divided into **continuous** and **discrete** data.
     * These different methods are described by what to pass for the `data` argument.
     * @param id Unique ID for the trace.
     * @param data Data to be plotted.
     * @param options Optional parameters.
     */
    plot(id, data, options = {}) {
        if (this.plotData[id] === undefined) {
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
                        this.plotData[id] = {
                            properties: {
                                traceColour: "blue",
                                traceStyle: "solid",
                                traceWidth: 3,
                                markerColour: "blue",
                                markerStyle: "none",
                                markerSize: 1,
                                visibility: true,
                                parameterRange: [0, 1]
                            },
                            data: function* (t) {
                                // TODO: add support for NaN
                                for (let i = 0; i < data[0].length; i++) {
                                    const xValue = typeof data[0][i] === "function" ? data[0][i](t) : data[0][i];
                                    const yValue = typeof data[1][i] === "function" ? data[1][i](xValue, t) : data[1][i];
                                    yield [xValue, yValue];
                                }
                            }
                        };
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
                        this.plotData[id] = {
                            properties: {
                                traceColour: "blue",
                                traceStyle: "solid",
                                traceWidth: 3,
                                markerColour: "blue",
                                markerStyle: "none",
                                markerSize: 1,
                                visibility: true,
                                parameterRange: [0, 1]
                            },
                            data: function* (t) {
                                // TODO: add support for NaN
                                for (const x of data[0]) {
                                    yield [x, data[1](x, t)];
                                }
                            }
                        };
                    }
                }
                else if (typeof data[0] === "function" && typeof data[1] === "function") { // parametric function
                    if (typeof data[0](0, 0) !== "number" || typeof data[1](0, 0) !== "number") {
                        throw "Error setting plot data: Plot function does not return numbers.";
                    }
                    this.plotData[id] = {
                        // TODO: add support for NaN
                        properties: {
                            traceColour: "blue",
                            traceStyle: "solid",
                            traceWidth: 3,
                            markerColour: "blue",
                            markerStyle: "none",
                            markerSize: 1,
                            visibility: true,
                            parameterRange: [0, 1]
                        },
                        data: function* (t, xLims, yLims, step, paramLims) {
                            let x = (p) => data[0](p, t);
                            let y = (p) => data[1](p, t);
                            let p = paramLims[0];
                            while (p <= paramLims[1]) {
                                yield [x(p), y(p)];
                                p += step;
                            }
                            yield [x(p), y(p)];
                        }
                    };
                }
            }
            else if (typeof data === "function") { // continuous function
                if (typeof data(0, 0) !== "number") {
                    throw "Error setting plot data: Plot function does not return numbers.";
                }
                this.plotData[id] = {
                    properties: {
                        traceColour: "blue",
                        traceStyle: "solid",
                        traceWidth: 3,
                        markerColour: "blue",
                        markerStyle: "none",
                        markerSize: 1,
                        visibility: true,
                        parameterRange: [0, 1]
                    },
                    data: function* (t, xLims, yLims, step) {
                        // TODO: discontinuities
                        let x = xLims[0];
                        let y = (x) => data(x, t);
                        while (x <= xLims[1]) {
                            while (true) { // while y is out of range or undefined
                                if (x > xLims[1]) { // if x is out of range, break without yielding previous point2D
                                    break;
                                }
                                else if (y(x) <= yLims[1] && y(x) >= yLims[0] && !Number.isNaN(y(x))) { // if y is in range, yield the previous point2D and break
                                    yield [x - step, y(x - step)];
                                    break;
                                }
                                else { // else increment x
                                    x += step;
                                }
                            }
                            while (true) { // while y in in range and defined
                                yield [x, y(x)];
                                if (x > xLims[1] || y(x) > yLims[1] || y(x) < yLims[0] || Number.isNaN(y(x))) { // if x or y is out of range, yield current point2D and break
                                    break;
                                }
                                else { // else increment x
                                    x += step;
                                }
                            }
                        }
                    }
                };
            }
            else {
                throw `Error setting plot data: Unrecognised data signature ${data}.`;
            }
        }
        else {
            throw `Error setting plot data: trace with ID ${id} already exists on current plot, call removeData() to remove.`;
        }
        setupProperties(this.plotData[id], "ResponsivePlot2DTrace", options);
        this.updatePlottingData();
    }
    /**
     * Removes a trace from the plot.
     * @param trace ID of the trace to be removed.
     */
    removeData(trace) {
        delete this.plotData[trace];
        this.updatePlottingData();
    }
    setOrigin(...point) {
        super.setOrigin(...point);
        if (this.properties.xLims !== undefined && this.properties.yLims !== undefined) {
            this._updateLimits();
        }
    }
    /**
     * Toggles the major ticks. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param choices Either one or two booleans.
     */
    setMajorTicks(...choices) {
        propertySetters.setAxesProperty(this, "majorTicks", "boolean", ...choices);
        this.updateBackground();
    }
    /**
     * Toggles the minor ticks. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param choices Either one or two booleans.
     */
    setMinorTicks(...choices) {
        propertySetters.setAxesProperty(this, "minorTicks", "boolean", ...choices);
        this.updateBackground();
    }
    /**
     * Sets the spacing of the major ticks (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setMajorTickSize(...sizes) {
        propertySetters.setAxesProperty(this, "majorTickSize", "number", ...sizes);
        this.updateBackground();
    }
    /**
     * Sets the spacing of the minor ticks (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setMinorTickSize(...sizes) {
        propertySetters.setAxesProperty(this, "minorTickSize", "number", ...sizes);
        this.updateBackground();
    }
    /**
     * Toggles the major gridlines. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param choices Either one or two booleans.
     */
    setMajorGridlines(...choices) {
        propertySetters.setAxesProperty(this, "majorGridlines", "boolean", ...choices);
        this.updateBackground();
    }
    /**
     * Toggles the minor gridlines. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param choices Either one or two booleans.
     */
    setMinorGridlines(...choices) {
        propertySetters.setAxesProperty(this, "minorGridlines", "boolean", ...choices);
        this.updateBackground();
    }
    /**
     * Sets the spacing of the major gridlines (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setMajorGridSize(...sizes) {
        propertySetters.setAxesProperty(this, "majorGridSize", "number", ...sizes);
        this.updateBackground();
    }
    /**
     * Sets the spacing of the minor gridlines (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setMinorGridSize(...sizes) {
        propertySetters.setAxesProperty(this, "minorGridSize", "number", ...sizes);
        this.updateBackground();
    }
    /**
     * Sets the size of 1 grid unit in pixels. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setGridScale(...sizes) {
        propertySetters.setAxesProperty(this, "gridScale", "number", ...sizes);
        this._updateLimits();
        this.updateBackground();
    }
    /**
     * Changes the range of `x` values to be shown on the plot by moving the origin and altering the grid scale.
     * @param min The minimum value of `x`.
     * @param max The maximum value of `x`.
     */
    setXLims(min, max) {
        if (max >= min) {
            propertySetters.setArrayProperty(this, "xLims", "number", [min, max], 2);
            this.properties.gridScale.x = this._displayData.width / Math.abs(this.properties.xLims[0] - this.properties.xLims[1]);
            super.setOrigin(-this.properties.xLims[0] * this.properties.gridScale.x, this.properties.origin.y);
            this.updateBackground();
            this.updatePlottingData();
        }
        else {
            throw `Error setting xLims: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }
    /**
     * Changes the range of `y` values to be shown on the plot by moving the origin and altering the grid scale.
     * @param min The minimum value of `y`.
     * @param max The maximum value of `y`.
     */
    setYLims(min, max) {
        if (max >= min) {
            propertySetters.setArrayProperty(this, "yLims", "number", [min, max], 2);
            this.properties.gridScale.y = this._displayData.height / Math.abs(this.properties.yLims[0] - this.properties.yLims[1]);
            super.setOrigin(this.properties.origin.x, this.properties.yLims[1] * this.properties.gridScale.y);
            this.updateBackground();
            this.updatePlottingData();
        }
        else {
            throw `Error setting yLims: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }
    /**
     * Sets the colour of the specified trace. The specified colour must be one of the browser-recognised colours.
     * @param trace The ID of the trace to be updated.
     * @param colour The name of the colour.
     */
    setTraceColour(trace, colour) {
        propertySetters.setPlotDataProperty(this, trace, "traceColour", colour);
        this.updatePlottingData();
    }
    /**
     * Sets the style of the specified trace. Possible styles are: `solid`, `dotted`, `dashed`, `dashdot`, or `none`.
     * @param trace The ID of the trace to be updated.
     * @param style The name of the style.
     */
    setTraceStyle(trace, style) {
        propertySetters.setPlotDataProperty(this, trace, "traceStyle", style);
        this.updatePlottingData();
    }
    /**
     * Sets the width of the specified trace (in pixels).
     * @param trace The ID of the trace to be updated.
     * @param width The width of the trace in pixels.
     */
    setTraceWidth(trace, width) {
        propertySetters.setPlotDataProperty(this, trace, "traceWidth", width);
        this.updatePlottingData();
    }
    /**
     * Sets the colour of the markers on the specified trace. The specified colour must be one of the browser-recognised colours.
     * @param trace The ID of the trace to be updated.
     * @param colour The name of the colour.
     */
    setMarkerColour(trace, colour) {
        propertySetters.setPlotDataProperty(this, trace, "markerColour", colour);
        this.updatePlottingData();
    }
    /**
     * Sets the style of the markers the specified trace. Possible styles are: `circle`, `plus`, `cross`, `arrow`, or `none`.
     * @param trace The ID of the trace to be updated.
     * @param style The name of the style.
     */
    setMarkerStyle(trace, style) {
        propertySetters.setPlotDataProperty(this, trace, "markerStyle", style);
        this.updatePlottingData();
    }
    /**
     * Sets the width of the markers on the specified trace (in pixels).
     * @param trace The ID of the trace to be updated.
     * @param size The size of the markers in pixels.
     */
    setMarkerSize(trace, size) {
        propertySetters.setPlotDataProperty(this, trace, "markerSize", size);
        this.updatePlottingData();
    }
    /**
     * Toggles the visibility of the specified trace.
     * @param trace The ID of the trace to be updated.
     * @param value Set to `true` for the trace to be visible, `false` for it to be hidden.
     */
    setVisibility(trace, value) {
        propertySetters.setPlotDataProperty(this, trace, "visibility", value);
        this.updatePlottingData();
    }
    /**
     * Sets the range of values over which a parameter should be plotted.
     * This property has no effect at all if the function plotted does not have a free parameter.
     * @param trace The ID of the trace to be updated.
     * @param min The minimum value of the free parameter.
     * @param max The maximum value of the free parameter.
     */
    setParameterRange(trace, min, max) {
        if (max >= min) {
            propertySetters.setPlotDataProperty(this, trace, "parameterRange", [min, max]);
            this.updatePlottingData();
        }
        else {
            throw `Error setting parameterRange: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }
}
