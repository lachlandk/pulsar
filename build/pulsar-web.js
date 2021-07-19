var Pulsar = (function (exports) {
    'use strict';

    const optionsObjects = {
        ResponsiveCanvas: {
            origin: { x: 0, y: 0 },
            backgroundCSS: ""
        },
        ResponsivePlot2D: {
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
    const propertyDefaults = {
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

    function setupProperties(instance, prototype, options) {
        const propertySet = propertyDefaults[prototype];
        for (const key of Object.keys(propertySet)) {
            const propertyDefault = propertySet[key];
            const optionProvided = Object.keys(options).includes(key);
            const args = [instance, key, propertyDefault.type];
            if (propertyDefault.multi) {
                args.push(...(optionProvided ? (Array.isArray(options[key]) ? options[key] : [options[key]]) : propertyDefault.value));
            }
            else {
                args.push(optionProvided ? options[key] : propertyDefault.value);
            }
            if (propertyDefault.extra) {
                args.push(propertyDefault.extra);
            }
            propertySetters[propertyDefault.setter](...args);
        }
    }
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
        },
        setPlotDataProperty(instance, trace, property, value) {
            const propertySet = propertyDefaults["ResponsivePlot2DTrace"];
            const propertyDefault = propertySet[property];
            if (typeof instance.plotData[trace] !== "undefined") {
                const args = [instance.plotData[trace], property, propertyDefault.type, value];
                if (propertyDefault.extra) {
                    args.push(propertyDefault.extra);
                }
                propertySetters[propertyDefault.setter](...args);
            }
            else {
                throw `Error setting plotData property ${property}: Invalid trace ID "${trace}"`;
            }
        }
    };

    const activeCanvases = {};

    class ResponsiveCanvas {
        constructor(id, options = {}) {
            this.id = "";
            this.properties = Object.assign({}, optionsObjects.ResponsiveCanvas);
            this.constants = {};
            this._timeEvolutionData = {
                currentTimeValue: 0,
                startTimestampMS: 0,
                offsetTimestampMS: 0,
                timeEvolutionActive: false
            };
            this._displayData = {
                width: 0,
                height: 0,
                originArgCache: [0],
                containerElement: null,
                resizeObserver: new ResizeObserver(entries => {
                    for (const entry of entries) {
                        this._displayData.width = entry.target.clientWidth;
                        this._displayData.height = entry.target.clientHeight;
                        this._updateCanvasDimensions();
                    }
                }),
                backgroundCanvas: document.createElement("canvas"),
                foregroundCanvas: document.createElement("canvas"),
                background: null,
                foreground: null,
                backgroundFunction: (() => { }),
                foregroundFunction: (() => { })
            };
            // TODO: add child objects to options to allow more options
            this.setID(id);
            if (options.origin === "centre") {
                this.setOrigin("centre");
                delete options.origin;
            }
            setupProperties(this, "ResponsiveCanvas", options);
            this._displayData.backgroundCanvas.style.position = "absolute";
            this._displayData.backgroundCanvas.style.left = "0";
            this._displayData.backgroundCanvas.style.top = "0";
            this._displayData.backgroundCanvas.id = `${this.id}-background-canvas`;
            this._displayData.background = this._displayData.backgroundCanvas.getContext("2d");
            this._displayData.foregroundCanvas.style.position = "absolute";
            this._displayData.foregroundCanvas.style.left = "0";
            this._displayData.foregroundCanvas.style.top = "0";
            this._displayData.foregroundCanvas.id = `${this.id}-foreground-canvas`;
            this._displayData.foreground = this._displayData.foregroundCanvas.getContext("2d");
        }
        _updateCanvasDimensions() {
            if (this._displayData.containerElement !== null) {
                this._displayData.containerElement.style.width = `${this._displayData.width}px`;
                this._displayData.containerElement.style.height = `${this._displayData.height}px`;
                this._displayData.backgroundCanvas.width = this._displayData.width;
                this._displayData.backgroundCanvas.height = this._displayData.height;
                this._displayData.background.translate(this.properties.origin.x, this.properties.origin.y);
                this._updateBackground();
                this._displayData.foregroundCanvas.width = this._displayData.width;
                this._displayData.foregroundCanvas.height = this._displayData.height;
                this._displayData.foreground.translate(this.properties.origin.x, this.properties.origin.y);
                this._updateForeground();
            }
        }
        _updateBackground() {
            if (this._displayData.background !== null) {
                this._displayData.background.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayData.width, this._displayData.height);
                this._displayData.backgroundFunction(this._displayData.background, this._timeEvolutionData.currentTimeValue);
            }
        }
        _updateForeground() {
            if (this._displayData.foreground !== null) {
                this._displayData.foreground.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayData.width, this._displayData.height);
                this._displayData.foregroundFunction(this._displayData.foreground, this._timeEvolutionData.currentTimeValue);
            }
        }
        setBackground(drawingFunction) {
            this._displayData.backgroundFunction = drawingFunction;
            this._updateBackground();
        }
        setForeground(drawingFunction) {
            this._displayData.foregroundFunction = drawingFunction;
            this._updateForeground();
        }
        setOrigin(...point) {
            if (point.length === 1 && point[0] === "centre") {
                propertySetters.setAxesProperty(this, "origin", "number", Math.round(this._displayData.width / 2), Math.round(this._displayData.height / 2));
            }
            else {
                propertySetters.setAxesProperty(this, "origin", "number", ...point);
            }
            this._displayData.originArgCache = point;
            this._updateCanvasDimensions();
        }
        setID(id) {
            if (activeCanvases[id] === undefined) {
                delete activeCanvases[this.id];
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
        startTime() {
            this._timeEvolutionData.timeEvolutionActive = true;
            this._timeEvolutionData.startTimestampMS = performance.now();
            window.requestAnimationFrame(timestamp => this._updateTime(timestamp));
        }
        pauseTime() {
            this._timeEvolutionData.timeEvolutionActive = false;
            this._timeEvolutionData.offsetTimestampMS = performance.now() - this._timeEvolutionData.startTimestampMS;
        }
        stopTime() {
            this._timeEvolutionData.timeEvolutionActive = false;
            this._timeEvolutionData.startTimestampMS = 0;
            this._timeEvolutionData.offsetTimestampMS = 0;
            this._timeEvolutionData.currentTimeValue = 0;
            this._updateBackground();
            this._updateForeground();
        }
        _updateTime(currentTimestamp) {
            if (this._timeEvolutionData.timeEvolutionActive) {
                this._timeEvolutionData.currentTimeValue = (this._timeEvolutionData.offsetTimestampMS + currentTimestamp - this._timeEvolutionData.startTimestampMS) / 1000;
                this._updateBackground();
                this._updateForeground();
                window.requestAnimationFrame(timestamp => this._updateTime(timestamp));
            }
        }
        setConstant(name, value) {
            this.constants[name] = value;
        }
        connectElementAttribute(element, event, attribute, constant, transform = (x) => x) {
            if (element instanceof Element) {
                element.addEventListener(event, () => {
                    this.setConstant(constant, transform(element[attribute]));
                });
                this.setConstant(constant, transform(element[attribute]));
            }
            else {
                const target = document.querySelector(element);
                if (target instanceof Element) {
                    target.addEventListener(event, () => {
                        this.setConstant(constant, transform(target[attribute]));
                    });
                    this.setConstant(constant, transform(target[attribute]));
                }
                else {
                    throw `Element with ID "${element}" could not be found.`;
                }
            }
        }
        show(element) {
            if (element instanceof HTMLElement) {
                this._displayData.containerElement = element;
            }
            else {
                this._displayData.containerElement = document.querySelector(element);
            }
            if (this._displayData.containerElement !== null) {
                this._displayData.containerElement.style.position = "relative";
                this._displayData.containerElement.appendChild(this._displayData.backgroundCanvas);
                this._displayData.containerElement.appendChild(this._displayData.foregroundCanvas);
                this._displayData.width = this._displayData.containerElement.clientWidth;
                this._displayData.height = this._displayData.containerElement.clientHeight;
                this._displayData.resizeObserver.observe(this._displayData.containerElement);
                this.setOrigin(...this._displayData.originArgCache);
            }
            else {
                throw `HTMLElement with querySelector "${element}" could not be found.`;
            }
        }
    }

    class ResponsivePlot2D extends ResponsiveCanvas {
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
                    else if (typeof data[0] === "function" && typeof data[1] === "function") { // parametric function
                        if (typeof data[0](0, 0) !== "number" || typeof data[1](0, 0) !== "number") {
                            throw "Error setting plot data: Plot function does not return numbers.";
                        }
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
                else if (typeof data === "function") { // continuous function
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
            }
            else {
                throw `Error setting plot data: trace with ID ${id} already exists on current plot, call removeData() to remove.`;
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
                propertySetters.setArrayProperty(this, "yLims", "number", [min, max], 2);
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

    class Plot extends ResponsivePlot2D {
        constructor(id, data, options = {}) {
            super(id, options);
            if (data !== undefined) {
                this.plot(data.id, data.data, data.options);
            }
        }
    }

    function getActivePlots() {
        const activePlots = {};
        for (const canvasID of Object.keys(activeCanvases)) {
            if (activeCanvases[canvasID] instanceof Plot) {
                activePlots[canvasID] = activeCanvases[canvasID];
            }
        }
        return activePlots;
    }

    const core = {
        ResponsiveCanvas: ResponsiveCanvas,
        ResponsivePlot2D: ResponsivePlot2D,
        activeCanvases: activeCanvases
    };

    exports.Plot = Plot;
    exports.core = core;
    exports.getActivePlots = getActivePlots;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
