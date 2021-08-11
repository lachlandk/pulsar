var Pulsar = (function (exports) {
    'use strict';

    const propertySetters = {
        setAxesProperty(instance, property, expectedType, ...values) {
            if (values.length === 1 && typeof values[0] === expectedType) {
                instance.properties[property] = {
                    x: values[0],
                    y: values[0]
                };
            }
            else if (values.length === 2 && typeof values[0] === expectedType && typeof values[1] === expectedType) {
                instance.properties[property] = {
                    x: values[0],
                    y: values[1]
                };
            }
            else {
                throw `Error setting axes property ${property}: Unexpected value ${values}.`;
            }
        },
        setSingleProperty(instance, property, expectedType, value) {
            if (typeof value === expectedType) {
                instance.properties[property] = value;
            }
            else {
                throw `Error setting single property ${property}: Unexpected type "${value}".`;
            }
        },
        setArrayProperty(instance, property, expectedType, values, length) {
            if (!Array.isArray(values)) {
                throw `Error setting array property ${property}: "${values}" is not an array.`;
            }
            else if (values.length !== length) {
                throw `Error setting array property ${property}: "${values}" is not of length ${length}`;
            }
            else {
                for (const value of values) {
                    if (typeof value !== expectedType) {
                        throw `Error setting array property ${property}: "Unexpected type "${value}" in array.`;
                    }
                }
                instance.properties[property] = values;
            }
        },
        setChoiceProperty(instance, property, expectedType, value, choices) {
            if (typeof value === expectedType) {
                let validChoice = false;
                for (const choice of choices) {
                    if (value === choice) {
                        instance.properties[property] = value;
                        validChoice = true;
                    }
                }
                if (!validChoice) {
                    throw `Error setting choice property ${property}: Invalid choice "${value}".`;
                }
            }
            else {
                throw `Error setting choice property ${property}: Unexpected type "${value}".`;
            }
        }
    };

    function continuousFunctionGenerator(func) {
        return function* (t, xLims, yLims, step) {
            let x = xLims[0];
            let y = (x) => func(x, t);
            while (x <= xLims[1]) {
                while (true) { 
                    if (x > xLims[1]) { 
                        break;
                    }
                    else if (y(x) <= yLims[1] && y(x) >= yLims[0] && !Number.isNaN(y(x))) { 
                        yield [x - step, y(x - step)];
                        break;
                    }
                    else { 
                        x += step;
                    }
                }
                while (true) { 
                    yield [x, y(x)];
                    if (x > xLims[1] || y(x) > yLims[1] || y(x) < yLims[0] || Number.isNaN(y(x))) { 
                        break;
                    }
                    else { 
                        x += step;
                    }
                }
            }
        };
    }
    function parametricFunctionGenerator(data) {
        return function* (t, xLims, yLims, step, paramLims) {
            let x = (p) => data[0](p, t);
            let y = (p) => data[1](p, t);
            let p = paramLims[0];
            while (p <= paramLims[1]) {
                yield [x(p), y(p)];
                p += step;
            }
            yield [x(p), y(p)];
        };
    }
    function discreteMapGenerator(data) {
        return function* (t) {
            for (const x of data[0]) {
                yield [x, data[1](x, t)];
            }
        };
    }
    function discreteFunctionGenerator(data) {
        return function* (t) {
            for (let i = 0; i < data[0].length; i++) {
                const xValue = typeof data[0][i] === "function" ? data[0][i](t) : data[0][i];
                const yValue = typeof data[1][i] === "function" ? data[1][i](xValue, t) : data[1][i];
                yield [xValue, yValue];
            }
        };
    }

    
    const activeCanvases = {};

    
    class defaults {
        constructor() {
            this.values = {
                ResponsiveCanvas: {
                    origin: { x: 0, y: 0 },
                    backgroundCSS: ""
                },
                ResponsivePlot2D: {
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
                    xLims: [0, 10],
                    yLims: [-10, 0]
                },
                ResponsivePlot2DTrace: {
                    traceColour: "blue",
                    traceStyle: "solid",
                    traceWidth: 3,
                    markerColour: "blue",
                    markerStyle: "none",
                    markerSize: 1,
                    visibility: true,
                    parameterRange: [0, 1]
                }
            };
        }
        create(...protos) {
            return Object.assign({}, ...Array.from(protos, (proto) => this.values[proto]));
        }
        mergeOptions(instance, type, options) {
            for (const option of Object.keys(options)) {
                if (option in this.values[type]) {
                    const setterFunc = instance[`set${option.charAt(0).toUpperCase()}${option.slice(1)}`];
                    if (setterFunc !== undefined) {
                        setterFunc.call(instance, ...(Array.isArray(options[option]) ? options[option] : [options[option]]));
                    }
                }
            }
        }
    }
    const Defaults = new defaults();

    
    class TimeEvolutionController {
        constructor() {
            this.canvasTimeData = [];
            this.globalLoopActive = false;
            this.startTimestamp = 0;
            this.offsetTimestamp = 0;
        }
        startAll() {
            for (const object of this.canvasTimeData) {
                object.timeEvolutionActive = true;
            }
            this.startTimestamp = performance.now();
            this.globalLoopActive = true;
            window.requestAnimationFrame(timestamp => this.updateObjects(timestamp));
        }
        pauseAll() {
            for (const object of this.canvasTimeData) {
                object.timeEvolutionActive = false;
            }
            this.offsetTimestamp = this.offsetTimestamp + performance.now() - this.startTimestamp;
        }
        stopAll() {
            for (const object of this.canvasTimeData) {
                object.timeEvolutionActive = false;
                activeCanvases[object.id].currentTimeValue = 0;
                activeCanvases[object.id].updateForeground();
            }
            this.startTimestamp = 0;
            this.offsetTimestamp = 0;
            this.globalLoopActive = false;
        }
        updateObjects(currentTimestamp) {
            if (this.globalLoopActive) {
                let atLeastOneActiveCanvas = false;
                for (const object of this.canvasTimeData) {
                    if (object.timeEvolutionActive) {
                        atLeastOneActiveCanvas = true;
                        activeCanvases[object.id].currentTimeValue = (this.offsetTimestamp + currentTimestamp - this.startTimestamp) / 1000;
                        activeCanvases[object.id].updateForeground();
                    }
                }
                if (atLeastOneActiveCanvas) {
                    window.requestAnimationFrame(timestamp => this.updateObjects(timestamp));
                }
                else {
                    this.globalLoopActive = false;
                }
            }
        }
        addObject(id, sync = true) {
            if (this.canvasTimeData.find(object => object.id === id) === undefined) {
                this.canvasTimeData.push({
                    id: id,
                    timeEvolutionActive: sync,
                });
            }
            else {
                throw `Error: Time data for canvas object with ID "${id}" already exists.`;
            }
        }
    }
    const Time = new TimeEvolutionController();

    
    class ResponsiveCanvas {
        constructor(id, options = {}) {
            this.id = "";
            this.properties = Defaults.create("ResponsiveCanvas");
            this.currentTimeValue = 0;
            const canvasContainer = document.createElement("div");
            canvasContainer.style.display = "grid";
            canvasContainer.style.width = "100%";
            canvasContainer.style.height = "100%";
            const backgroundCanvas = document.createElement("canvas");
            backgroundCanvas.style.gridArea = "1 / 1";
            const foregroundCanvas = document.createElement("canvas");
            foregroundCanvas.style.gridArea = "1 / 1";
            canvasContainer.appendChild(backgroundCanvas);
            canvasContainer.appendChild(foregroundCanvas);
            const resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    this.resizeEventListener(entry);
                    this.updateBackground();
                    this.updateForeground();
                }
            });
            resizeObserver.observe(canvasContainer);
            this._displayData = {
                width: 0,
                height: 0,
                originArgCache: null,
                parentElement: null,
                resizeObserver: resizeObserver,
                canvasContainer: canvasContainer,
                backgroundCanvas: backgroundCanvas,
                foregroundCanvas: foregroundCanvas,
                background: backgroundCanvas.getContext("2d"),
                foreground: foregroundCanvas.getContext("2d"),
                backgroundFunction: () => { },
                foregroundFunction: () => { }
            };
            Time.addObject(id);
            this.setID(id);
            Defaults.mergeOptions(this, "ResponsiveCanvas", options);
        }
        resizeEventListener(entry) {
            this._displayData.width = entry.target.clientWidth;
            this._displayData.height = entry.target.clientHeight;
            this._displayData.backgroundCanvas.width = this._displayData.width;
            this._displayData.backgroundCanvas.height = this._displayData.height;
            this._displayData.foregroundCanvas.width = this._displayData.width;
            this._displayData.foregroundCanvas.height = this._displayData.height;
            if (this._displayData.originArgCache !== null) {
                this.setOrigin(this._displayData.originArgCache);
            }
            this._displayData.background.translate(this.properties.origin.x, this.properties.origin.y); 
            this._displayData.foreground.translate(this.properties.origin.x, this.properties.origin.y);
        }
        updateBackground() {
            this._displayData.background.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayData.width, this._displayData.height);
            this._displayData.backgroundFunction(this._displayData.background);
        }
        updateForeground() {
            this._displayData.foreground.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayData.width, this._displayData.height);
            this._displayData.foregroundFunction(this._displayData.foreground, this.currentTimeValue);
        }
        setBackground(drawingFunction) {
            this._displayData.backgroundFunction = drawingFunction;
            this.updateBackground();
        }
        setForeground(drawingFunction) {
            this._displayData.foregroundFunction = drawingFunction;
            this.updateForeground();
        }
        setOrigin(...point) {
            if (point.length === 1 && point[0] === "centre") {
                propertySetters.setAxesProperty(this, "origin", "number", Math.round(this._displayData.width / 2), Math.round(this._displayData.height / 2));
                this._displayData.originArgCache = point[0];
            }
            else {
                propertySetters.setAxesProperty(this, "origin", "number", ...point);
                this._displayData.originArgCache = null;
            }
            this._displayData.background.resetTransform();
            this._displayData.background.translate(this.properties.origin.x, this.properties.origin.y);
            this.updateBackground();
            this._displayData.foreground.resetTransform();
            this._displayData.foreground.translate(this.properties.origin.x, this.properties.origin.y);
            this.updateForeground();
        }
        setID(id) {
            if (activeCanvases[id] === undefined) {
                delete activeCanvases[this.id];
                Time.canvasTimeData.find(object => object.id === id).id = id;
                this.id = id;
                activeCanvases[this.id] = this;
            }
            else {
                throw `Error creating ResponsiveCanvas object: Object with ID "${id}" already exists.`;
            }
        }
        setBackgroundCSS(cssString) {
            propertySetters.setSingleProperty(this, "backgroundCSS", "string", cssString);
            this._displayData.backgroundCanvas.style.background = cssString;
        }
        show(element) {
            if (element instanceof Element) {
                this._displayData.parentElement = element;
            }
            else {
                this._displayData.parentElement = document.querySelector(element);
            }
            if (this._displayData.parentElement !== null) {
                this._displayData.parentElement.appendChild(this._displayData.canvasContainer);
                this._displayData.width = this._displayData.canvasContainer.clientWidth;
                this._displayData.height = this._displayData.canvasContainer.clientHeight;
                if (this._displayData.originArgCache !== null) {
                    this.setOrigin(this._displayData.originArgCache);
                }
                this.setBackgroundCSS(this.properties.backgroundCSS); 
            }
            else {
                throw `HTMLElement with querySelector "${element}" could not be found.`;
            }
        }
        hide() {
            if (this._displayData.parentElement !== null) {
                this._displayData.parentElement.removeChild(this._displayData.canvasContainer);
                this._displayData.parentElement = null;
            }
        }
    }

    
    class ResponsivePlot2DTrace {
        constructor(plot, data, options = {}) {
            this.properties = Defaults.create("ResponsivePlot2DTrace");
            this.plot = plot; 
            Defaults.mergeOptions(this, "ResponsivePlot2DTrace", options);
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
                        this.data = discreteFunctionGenerator(data);
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
                        this.data = discreteMapGenerator(data);
                    }
                }
                else if (typeof data[0] === "function" && typeof data[1] === "function") { 
                    if (typeof data[0](0, 0) !== "number" || typeof data[1](0, 0) !== "number") {
                        throw "Error setting plot data: Plot function does not return numbers.";
                    }
                    this.data = parametricFunctionGenerator(data);
                }
            }
            else if (typeof data === "function") { 
                if (typeof data(0, 0) !== "number") {
                    throw "Error setting plot data: Plot function does not return numbers.";
                }
                this.data = continuousFunctionGenerator(data);
            }
            else {
                throw `Error setting plot data: Unrecognised data signature ${data}.`;
            }
        }
        setTraceColour(colour) {
            propertySetters.setSingleProperty(this, "traceColour", "string", colour);
            this.plot.updatePlottingData();
        }
        setTraceStyle(style) {
            propertySetters.setChoiceProperty(this, "traceStyle", "string", style, ["solid", "dotted", "dashed", "dashdot", "none"]);
            this.plot.updatePlottingData();
        }
        setTraceWidth(width) {
            propertySetters.setSingleProperty(this, "traceWidth", "number", width);
            this.plot.updatePlottingData();
        }
        setMarkerColour(colour) {
            propertySetters.setSingleProperty(this, "markerColour", "string", colour);
            this.plot.updatePlottingData();
        }
        setMarkerStyle(style) {
            propertySetters.setChoiceProperty(this, "markerStyle", "string", style, ["circle", "plus", "cross", "arrow", "none"]);
            this.plot.updatePlottingData();
        }
        setMarkerSize(size) {
            propertySetters.setSingleProperty(this, "markerSize", "number", size);
            this.plot.updatePlottingData();
        }
        setVisibility(value) {
            propertySetters.setSingleProperty(this, "visibility", "boolean", value);
            this.plot.updatePlottingData();
        }
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

    
    class ResponsivePlot2D extends ResponsiveCanvas {
        constructor(id, options = {}) {
            super(id, options);
            this.properties = Defaults.create("ResponsiveCanvas", "ResponsivePlot2D");
            this.gridScale = { x: 0, y: 0 };
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
                                drawMarker(context, ...point, angle); 
                                lastPoint = point;
                            }
                        }
                    }
                }
            });
        }
        addData(id, data, options = {}) {
            if (this.data[id] === undefined) {
                this.data[id] = new ResponsivePlot2DTrace(this, data, options);
                this.updatePlottingData();
            }
            else {
                throw `Error setting plot data: trace with ID ${id} already exists on current plot, call removeData() to remove.`;
            }
        }
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
        setMajorTicks(...choices) {
            propertySetters.setAxesProperty(this, "majorTicks", "boolean", ...choices);
            this.updateBackground();
        }
        setMinorTicks(...choices) {
            propertySetters.setAxesProperty(this, "minorTicks", "boolean", ...choices);
            this.updateBackground();
        }
        setMajorTickSize(...sizes) {
            propertySetters.setAxesProperty(this, "majorTickSize", "number", ...sizes);
            this.updateBackground();
        }
        setMinorTickSize(...sizes) {
            propertySetters.setAxesProperty(this, "minorTickSize", "number", ...sizes);
            this.updateBackground();
        }
        setMajorGridlines(...choices) {
            propertySetters.setAxesProperty(this, "majorGridlines", "boolean", ...choices);
            this.updateBackground();
        }
        setMinorGridlines(...choices) {
            propertySetters.setAxesProperty(this, "minorGridlines", "boolean", ...choices);
            this.updateBackground();
        }
        setMajorGridSize(...sizes) {
            propertySetters.setAxesProperty(this, "majorGridSize", "number", ...sizes);
            this.updateBackground();
        }
        setMinorGridSize(...sizes) {
            propertySetters.setAxesProperty(this, "minorGridSize", "number", ...sizes);
            this.updateBackground();
        }
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

    class Plot extends ResponsivePlot2D {
        static activePlots() {
            const activePlots = {};
            for (const canvasID of Object.keys(activeCanvases)) {
                if (activeCanvases[canvasID] instanceof Plot) {
                    activePlots[canvasID] = activeCanvases[canvasID];
                }
            }
            return activePlots;
        }
        constructor(id, data, options = {}) {
            super(id, options);
            if (data !== undefined) {
                this.addData(data.id, data.data, data.options);
            }
        }
    }

    
    const core = {
        ResponsiveCanvas: ResponsiveCanvas,
        activeCanvases: activeCanvases
    };
    const plotting = {
        ResponsivePlot2D: ResponsivePlot2D,
        ResponsivePlot2DTrace: ResponsivePlot2DTrace
    };

    exports.Defaults = Defaults;
    exports.Plot = Plot;
    exports.Time = Time;
    exports.core = core;
    exports.plotting = plotting;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
