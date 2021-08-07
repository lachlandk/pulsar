var Pulsar = (function (exports) {
    'use strict';

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
        }
    };

    function continuousFunctionGenerator(func) {
        return function* (t, xLims, yLims, step) {
            // TODO: discontinuities
            let x = xLims[0];
            let y = (x) => func(x, t);
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
            // TODO: add support for NaN
            for (const x of data[0]) {
                yield [x, data[1](x, t)];
            }
        };
    }
    function discreteFunctionGenerator(data) {
        return function* (t) {
            // TODO: add support for NaN
            for (let i = 0; i < data[0].length; i++) {
                const xValue = typeof data[0][i] === "function" ? data[0][i](t) : data[0][i];
                const yValue = typeof data[1][i] === "function" ? data[1][i](xValue, t) : data[1][i];
                yield [xValue, yValue];
            }
        };
    }

    /**
     * Object containing the active canvas objects with their ID as the keys. It is used
     * internally by other functions such as {@link getActivePlots `getActivePlots()`}.
     */
    const activeCanvases = {};

    /**
     * Class representing the base canvas object which all other Pulsar canvas objects inherit from.
     * This class is not meant to be instantiated directly by a user, mainly because it is not very useful by itself.
     * However, it does provide a lot of useful functionality which is used by subclasses.
     * A `ResponsiveCanvas` instance has two drawing surfaces, a background and a foreground.
     * These drawing surfaces can be added to the HTML page as canvas elements by calling `show`.
     * These canvases will then fill the container element, and even change their size when the container element is resized.
     * The coordinate origin of a ResponsiveCanvas can be changed with `setOrigin`, and it can be drawn on and animated
     * by passing a drawing function to `setBackground` or `setForeground`. Read-only properties and methods beginning with
     * an underscore should not be changed/called, otherwise they may cause unpredictable behaviour.
     */
    class ResponsiveCanvas {
        /**
         * @param id The ID of the canvas object.
         * @param options  Optional parameters.
         */
        constructor(id, options = {}) {
            /**
             * The unique ID for the canvas object.
             */
            this.id = "";
            /**
             *
             */
            this.properties = {
                origin: { x: 0, y: 0 },
                backgroundCSS: ""
            };
            this._timeEvolutionData = {
                currentTimeValue: 0,
                startTimestampMS: 0,
                offsetTimestampMS: 0,
                timeEvolutionActive: false
            };
            // TODO: add child objects to options to allow more options
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
                    this._displayData.width = entry.target.clientWidth;
                    this._displayData.height = entry.target.clientHeight;
                    this._displayData.backgroundCanvas.width = this._displayData.width;
                    this._displayData.backgroundCanvas.height = this._displayData.height;
                    this._displayData.foregroundCanvas.width = this._displayData.width;
                    this._displayData.foregroundCanvas.height = this._displayData.height;
                    this.setOrigin(...this._displayData.originArgCache);
                    // this._displayData.background.translate(this.properties.origin.x, this.properties.origin.y);
                    // this.updateBackground();
                    // this._displayData.foreground.translate(this.properties.origin.x, this.properties.origin.y);
                    // this.updateForeground();
                }
            });
            resizeObserver.observe(canvasContainer);
            this._displayData = {
                width: 0,
                height: 0,
                originArgCache: [0],
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
            this.setID(id);
            if (options.origin === "centre") {
                this.setOrigin("centre");
                delete options.origin;
            }
            setupProperties(this, "ResponsiveCanvas", options);
        }
        /**
          * Updates the background.
          */
        updateBackground() {
            this._displayData.background.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayData.width, this._displayData.height);
            this._displayData.backgroundFunction(this._displayData.background);
        }
        /**
          * Updates the foreground.
          */
        updateForeground() {
            this._displayData.foreground.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayData.width, this._displayData.height);
            this._displayData.foregroundFunction(this._displayData.foreground, this._timeEvolutionData.currentTimeValue);
        }
        /**
         * Sets the drawing function for the background canvas to `drawingFunction` and updates the canvas.
         * The argument `drawingFunction` should be a function which takes one or two arguments of its own, the first being the
         * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D `CanvasRenderingContext2D`} for the background,
         * and the second (which is optional) being the current time evolution value for the canvas object (in seconds).
         * @param drawingFunction The function which draws the background.
         */
        setBackground(drawingFunction) {
            this._displayData.backgroundFunction = drawingFunction;
            this.updateBackground();
        }
        /**
         * Sets the drawing function for the foreground canvas to `drawingFunction` and updates the canvas.
         * The argument `drawingFunction` should be a function which takes one or two arguments of its own, the first being the
         * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D `CanvasRenderingContext2D`} for the background,
         * and the second (which is optional) being the current time evolution value for the canvas object (in seconds).
         * The second argument need only specified if the drawing function contains animations which depend on the current
         * time value.
         * @param drawingFunction The function which draws the foreground.
         */
        setForeground(drawingFunction) {
            this._displayData.foregroundFunction = drawingFunction;
            this.updateForeground();
        }
        /**
         * Sets the origin of both canvases to the point2D specified (in pixels).
         * Two values may be passed for `x` then `y`, or one value may be passed to set the origins of both axes to the same value.
         * The string `"centre"` may also be passed to conveniently set the origin to the middle of the canvas.
         * Note that for the HTML5 canvas the origin is in the top-left corner by default and the x-axis points rightwards,
         * while the y-axis points downwards.
         * @param point
         */
        setOrigin(...point) {
            if (point.length === 1 && point[0] === "centre") {
                propertySetters.setAxesProperty(this, "origin", "number", Math.round(this._displayData.width / 2), Math.round(this._displayData.height / 2));
            }
            else {
                propertySetters.setAxesProperty(this, "origin", "number", ...point);
            }
            this._displayData.originArgCache = point;
            if (this._displayData.background !== null && this._displayData.foreground !== null) {
                this._displayData.background.translate(this.properties.origin.x, this.properties.origin.y); // TODO: this introduces a bug with changing the origin multiple times
                this.updateBackground();
                this._displayData.foreground.translate(this.properties.origin.x, this.properties.origin.y);
                this.updateForeground();
            }
        }
        /**
         * Sets the ID of the canvas object to the value specified,
         * which cannot be the same as another existing canvas object.
         * If the canvas object is active on an HTML page, all of its elements will have their `ID`s updated.
         * @param id New ID for the canvas object.
         */
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
        /**
         * Sets the `background` CSS property of the background canvas to the string passed in.
         * This can be used to set the background for the canvas object to a plain colour, gradient pattern or image
         * (by default the background is transparent).
         * @param cssString A valid string for the CSS {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background `background`} property.
         */
        setBackgroundCSS(cssString) {
            propertySetters.setSingleProperty(this, "backgroundCSS", "string", cssString);
            this._displayData.backgroundCanvas.style.background = cssString;
        }
        /**
         * Starts or resumes the time evolution of the foreground.
         */
        startTime() {
            this._timeEvolutionData.timeEvolutionActive = true;
            this._timeEvolutionData.startTimestampMS = performance.now();
            window.requestAnimationFrame(timestamp => this._updateTime(timestamp));
        }
        /**
         * Pauses the time evolution of the foreground.
         */
        pauseTime() {
            this._timeEvolutionData.timeEvolutionActive = false;
            this._timeEvolutionData.offsetTimestampMS = performance.now() - this._timeEvolutionData.startTimestampMS;
        }
        /**
         * Stops the time evolution of the foreground and resets the current timestamp to 0.
         */
        stopTime() {
            this._timeEvolutionData.timeEvolutionActive = false;
            this._timeEvolutionData.startTimestampMS = 0;
            this._timeEvolutionData.offsetTimestampMS = 0;
            this._timeEvolutionData.currentTimeValue = 0;
            this.updateForeground();
        }
        _updateTime(currentTimestamp) {
            if (this._timeEvolutionData.timeEvolutionActive) {
                const currentTime = this._timeEvolutionData.offsetTimestampMS + currentTimestamp - this._timeEvolutionData.startTimestampMS;
                this._timeEvolutionData.currentTimeValue = currentTime < 0 ? 0 : currentTime / 1000;
                this.updateForeground();
                window.requestAnimationFrame(timestamp => this._updateTime(timestamp));
            }
        }
        /**
         * Display the canvas object in an HTML element.
         * @param element
         */
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
                this.setOrigin(...this._displayData.originArgCache);
                this.setBackgroundCSS(this.properties.backgroundCSS); // TODO: shouldn't have to call this again
            }
            else {
                throw `HTMLElement with querySelector "${element}" could not be found.`;
            }
        }
    }

    var index$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ResponsiveCanvas: ResponsiveCanvas,
        activeCanvases: activeCanvases,
        propertyDefaults: propertyDefaults
    });

    /**
     *  This plot represents a trace on a {@link ResponsivePlot2D `ResponsivePlot2D`}.
     */
    class ResponsivePlot2DTrace {
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
    class ResponsivePlot2D extends ResponsiveCanvas {
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
            this.data = {};
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
            if (this.properties.xLims !== undefined && this.properties.yLims !== undefined) {
                this._updateLimits();
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
    }

    var index = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ResponsivePlot2D: ResponsivePlot2D,
        ResponsivePlot2DTrace: ResponsivePlot2DTrace
    });

    class Plot extends ResponsivePlot2D {
        /**
         * @param id - The ID of the plot object. Must be unique.
         * @param data - The data to be plotted. The structure of the object follows the exact same pattern as the signature of {@link ResponsivePlot2D.plot `plot()`}.
         * @param data.id - The ID for the trace. This ID will be the key for the relevant entry in the {@link ResponsivePlot2D.plotData `plotData`} property of the plot object.
         * @param data.data - The data to be plotted. See the {@link ResponsivePlot2D.plot `plot()`} method documentation for more details.
         * @param data.object - The options for the data. See the {@link ResponsivePlot2D.plot `plot()`} method documentation for more details.
         * @param options - Options for the plot.
         */
        constructor(id, data, options = {}) {
            super(id, options);
            if (data !== undefined) {
                this.addData(data.id, data.data, data.options);
            }
        }
    }

    /**
     * Returns an object containing the active instances of {@link Plot `Plot`}.
     */
    function getActivePlots() {
        const activePlots = {};
        for (const canvasID of Object.keys(activeCanvases)) {
            if (activeCanvases[canvasID] instanceof Plot) {
                activePlots[canvasID] = activeCanvases[canvasID];
            }
        }
        return activePlots;
    }

    exports.Plot = Plot;
    exports.core = index$1;
    exports.getActivePlots = getActivePlots;
    exports.plotting = index;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
