import { ResponsiveCanvas } from "./ResponsiveCanvas.js";
import { propertySetters, setupProperties } from "../helpers/index.js";
import { optionsObjects } from "./defaults.js";
export class ResponsivePlot2D extends ResponsiveCanvas {
    constructor(id, options = {}) {
        super(id, options);
        this.properties = Object.assign(Object.assign({}, optionsObjects.ResponsiveCanvas), optionsObjects.ResponsivePlot2D);
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
    _updatePlottingData() {
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
    plot(id, data, options = {}) {
        if (Array.isArray(data) && data.length === 2) {
            if (Array.isArray(data[0])) {
                if (Array.isArray(data[1])) {
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
                        properties: Object.assign({}, optionsObjects.ResponsivePlot2DTrace),
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
                else if (typeof data[1] === "function") {
                    if (typeof data[1](0, 0) !== "number") {
                        throw "Error setting plot data: Plot function does not return numbers.";
                    }
                    for (let i = 0; i < data[0].length; i++) {
                        if (typeof data[0][i] !== "number") {
                            throw "Error setting plot data: Data array contains types which are not numbers.";
                        }
                    }
                    this.plotData[id] = {
                        properties: Object.assign({}, optionsObjects.ResponsivePlot2DTrace),
                        data: function* (t) {
                            // TODO: add support for NaN
                            for (const x of data[0]) {
                                yield [x, data[1](x, t)];
                            }
                        }
                    };
                }
            }
            else if (typeof data[0] === "function" && typeof data[1] === "function") {
                this.plotData[id] = {
                    // TODO: add support for NaN
                    properties: Object.assign({}, optionsObjects.ResponsivePlot2DTrace),
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
        else if (typeof data === "function") {
            if (typeof data(0, 0) !== "number") {
                throw "Error setting plot data: Plot function does not return numbers.";
            }
            this.plotData[id] = {
                properties: Object.assign({}, optionsObjects.ResponsivePlot2DTrace),
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
        setupProperties(this.plotData[id], "ResponsivePlot2DTrace", options);
        this._updatePlottingData();
    }
    removeData(trace) {
        delete this.plotData[trace];
        this._updatePlottingData();
    }
    setOrigin(...point) {
        super.setOrigin(...point);
        if (this.properties.xLims !== undefined && this.properties.yLims !== undefined) {
            this._updateLimits();
        }
    }
    setMajorTicks(...choices) {
        propertySetters.setAxesProperty(this, "majorTicks", "boolean", ...choices);
        this._updateBackground();
    }
    setMinorTicks(...choices) {
        propertySetters.setAxesProperty(this, "minorTicks", "boolean", ...choices);
        this._updateBackground();
    }
    setMajorTickSize(...sizes) {
        propertySetters.setAxesProperty(this, "majorTickSize", "number", ...sizes);
        this._updateBackground();
    }
    setMinorTickSize(...sizes) {
        propertySetters.setAxesProperty(this, "minorTickSize", "number", ...sizes);
        this._updateBackground();
    }
    setMajorGridlines(...choices) {
        propertySetters.setAxesProperty(this, "majorGridlines", "boolean", ...choices);
        this._updateBackground();
    }
    setMinorGridlines(...choices) {
        propertySetters.setAxesProperty(this, "minorGridlines", "boolean", ...choices);
        this._updateBackground();
    }
    setMajorGridSize(...sizes) {
        propertySetters.setAxesProperty(this, "majorGridSize", "number", ...sizes);
        this._updateBackground();
    }
    setMinorGridSize(...sizes) {
        propertySetters.setAxesProperty(this, "minorGridSize", "number", ...sizes);
        this._updateBackground();
    }
    setGridScale(...sizes) {
        propertySetters.setAxesProperty(this, "gridScale", "number", ...sizes);
        this._updateLimits();
        this._updateForeground();
        this._updateBackground();
    }
    setXLims(min, max) {
        if (max >= min) {
            propertySetters.setArrayProperty(this, "xLims", "number", [min, max], 2);
            this.properties.gridScale.x = this._displayData.width / Math.abs(this.properties.xLims[0] - this.properties.xLims[1]);
            super.setOrigin(-this.properties.xLims[0] * this.properties.gridScale.x, this.properties.origin.y);
            this._updateBackground();
            this._updatePlottingData();
        }
        else {
            throw `Error setting xLims: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }
    setYLims(min, max) {
        if (max >= min) {
            propertySetters.setArrayProperty(this, "xLims", "number", [min, max], 2);
            this.properties.gridScale.y = this._displayData.height / Math.abs(this.properties.yLims[0] - this.properties.yLims[1]);
            super.setOrigin(this.properties.origin.x, this.properties.yLims[1] * this.properties.gridScale.y);
            this._updateBackground();
            this._updatePlottingData();
        }
        else {
            throw `Error setting yLims: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }
    setTraceColour(trace, colour) {
        propertySetters.setPlotDataProperty(this, trace, "traceColour", colour);
        this._updatePlottingData();
    }
    setTraceStyle(trace, style) {
        propertySetters.setPlotDataProperty(this, trace, "traceStyle", style);
        this._updatePlottingData();
    }
    setTraceWidth(trace, width) {
        propertySetters.setPlotDataProperty(this, trace, "traceWidth", width);
        this._updatePlottingData();
    }
    setMarkerColour(trace, colour) {
        propertySetters.setPlotDataProperty(this, trace, "markerColour", colour);
        this._updatePlottingData();
    }
    setMarkerStyle(trace, style) {
        propertySetters.setPlotDataProperty(this, trace, "markerStyle", style);
        this._updatePlottingData();
    }
    setMarkerSize(trace, size) {
        propertySetters.setPlotDataProperty(this, trace, "markerSize", size);
        this._updatePlottingData();
    }
    setVisibility(trace, value) {
        propertySetters.setPlotDataProperty(this, trace, "visibility", value);
        this._updatePlottingData();
    }
    setParameterRange(trace, min, max) {
        if (max >= min) {
            propertySetters.setPlotDataProperty(this, trace, "parameterRange", [min, max]);
            this._updatePlottingData();
        }
        else {
            throw `Error setting parameterRange: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }
}
