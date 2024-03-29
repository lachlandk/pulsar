import { ResponsiveCanvas } from "../core/ResponsiveCanvas.js";
import { propertySetters } from "../helpers/index.js";
import { ResponsivePlot2DTrace } from "./ResponsivePlot2DTrace.js";
import { Defaults } from "../Defaults.js";
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
export class ResponsivePlot2D extends ResponsiveCanvas {
    /**
     * @param id The unique ID of the plot object.
     * @param options Optional parameters.
     */
    constructor(id, options = {}) {
        super(id, options);
        this.properties = Defaults.create("ResponsiveCanvas", "ResponsivePlot2D");
        this.gridScale = { x: 0, y: 0 };
        /**
         * Contains the data trace objects for the plot instance.
         * The objects can be accessed using the trace ID as the key.
         */
        this.data = {};
        Defaults.mergeOptions(this, "ResponsivePlot2D", options);
        this.setBackground(context => {
            const drawGridSet = (majorOrMinor, xy, ticksOrGridlines, width, lineStart, lineEnd) => {
                const offset = width % 2 === 0 ? 0 : 0.5;
                const intervalSize = this.properties[`${majorOrMinor + (ticksOrGridlines === "Ticks" ? "TickSize" : "GridSize")}`][xy];
                context.lineWidth = width;
                if (this.properties[`${majorOrMinor}${ticksOrGridlines}`][xy]) {
                    context.beginPath();
                    let currentValue = -Math.floor(this.properties.origin[xy] / (intervalSize * this.gridScale[xy])) * intervalSize * this.gridScale[xy];
                    if (xy === "x") {
                        while (currentValue < this._displayData.width - this.properties.origin.x) {
                            context.moveTo(currentValue + offset, lineStart);
                            context.lineTo(currentValue + offset, lineEnd);
                            currentValue += this.gridScale.x * intervalSize;
                        }
                    }
                    else if (xy === "y") {
                        while (currentValue < this._displayData.height - this.properties.origin.y) {
                            context.moveTo(lineStart, currentValue + offset);
                            context.lineTo(lineEnd, currentValue + offset);
                            currentValue += this.gridScale.y * intervalSize;
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
    resizeEventListener(entry) {
        super.resizeEventListener(entry);
        this.setXLims(...this.properties.xLims);
        this.setYLims(...this.properties.yLims);
    }
    /**
      * Updates the foreground function.
      */
    updatePlottingData() {
        this.setForeground((context, timeValue) => {
            for (const datasetID of Object.keys(this.data)) {
                if (this.data[datasetID].properties.visibility) {
                    const dataset = this.data[datasetID];
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
                            context.lineTo(currentPoint[0] * this.gridScale.x, -currentPoint[1] * this.gridScale.y);
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
                            const point = [currentPoint[0] * this.gridScale.x, -currentPoint[1] * this.gridScale.y];
                            const angle = Math.atan2(point[1] - lastPoint[1], -point[0] + lastPoint[0]);
                            drawMarker(context, ...point, angle); // TODO: fix this (typescript thinks drawMarker can be null (because the defaults aren't typed))
                            lastPoint = point;
                        }
                    }
                }
            }
        });
    }
    /**
     * Adds a data trace to the plot. The trace must be given a unique ID, so that it can be added to the
     * {@link ResponsivePlot2D.data `data`} property of the plot object.
     * There are several ways that data can be added, which can be divided into **continuous** and **discrete** data.
     * These different methods are described by what to pass for the `data` argument.
     * @param id Unique ID for the trace.
     * @param data Data to be plotted.
     * @param options Optional parameters.
     */
    addData(id, data, options = {}) {
        if (this.data[id] === undefined) {
            this.data[id] = new ResponsivePlot2DTrace(this, data, options);
            this.updatePlottingData();
        }
        else {
            throw `Error setting plot data: trace with ID ${id} already exists on current plot, call removeData() to remove.`;
        }
    }
    /**
     * Removes a trace from the plot.
     * @param trace ID of the trace to be removed.
     */
    removeData(trace) {
        delete this.data[trace];
        this.updatePlottingData();
    }
    setOrigin(...point) {
        super.setOrigin(...point);
        if (this._displayData.parentElement !== null && this.gridScale.x > 0 && this.gridScale.y > 0) {
            this.properties.xLims = [-this.properties.origin.x / this.gridScale.x, (this._displayData.width - this.properties.origin.x) / this.gridScale.x];
            this.properties.yLims = [-(this._displayData.height - this.properties.origin.y) / this.gridScale.y, this.properties.origin.y / this.gridScale.y];
            this.updatePlottingData();
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
     * Changes the range of `x` values to be shown on the plot by moving the origin and altering the grid scale.
     * @param min The minimum value of `x`.
     * @param max The maximum value of `x`.
     */
    setXLims(min, max) {
        if (max >= min) {
            propertySetters.setArrayProperty(this, "xLims", "number", [min, max], 2);
            this.gridScale.x = this._displayData.width / Math.abs(this.properties.xLims[0] - this.properties.xLims[1]);
            this.setOrigin(-this.properties.xLims[0] * this.gridScale.x, this.properties.origin.y);
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
            this.gridScale.y = this._displayData.height / Math.abs(this.properties.yLims[0] - this.properties.yLims[1]);
            this.setOrigin(this.properties.origin.x, this.properties.yLims[1] * this.gridScale.y);
            this.updatePlottingData();
        }
        else {
            throw `Error setting yLims: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }
    show(element) {
        super.show(element);
        this.setXLims(...this.properties.xLims);
        this.setYLims(...this.properties.yLims);
    }
}
