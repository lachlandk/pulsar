/*!
 * @licence
 * Pulsar.js - A javascript data visualisation framework
 * Copyright (C) 2021  Lachlan Dufort-Kennett
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
/**
 * @namespace Pulsar
 * @description This global object contains everything created by the Pulsar library.
 * All Pulsar functions and classes are access from here.
 */
window.Pulsar = (function () {
	/**
	 * @namespace core
	 * @memberOf Pulsar
	 * @description This object contains the base classes and objects that other functions use and build upon.
	 * The members of this objects are not meant to be called or instantiated directly
	 * by a user of the library, but they are used internally by other code and the classes
	 * provide many useful methods which will be called by a user when working with instances
	 * of the classes.
	 */
	const core = (function() {
		/**
		 * @private
		 * @description This object holds functions for setting properties of the ResponsiveCanvas objects.
		 * They exist so that the code can be reused instead of rewritten for every single property.
		 */
		const propertySetters = {
			/**
			 * Sets all the properties for the instance using the options passed in and the default properties by
			 * iterating through the default properties, checking if the user has specified that property or not,
			 * then assembling the arguments and calling the correct setter.
			 * @param {ResponsiveCanvas} instance
			 * @param {string} prototype
			 * @param {Object} options
			 */
			setupProperties(instance, prototype, options) {
				for (const key of Object.keys(defaultProperties[prototype])) {
					const defaultOption = defaultProperties[prototype][key];
					const optionProvided = Object.keys(options).includes(key);
					const parameters = [instance, key, defaultOption.type];
					if (defaultOption.multi) {
						parameters.push(...(optionProvided ? (Array.isArray(options[key]) ? options[key] : [options[key]]) : defaultOption.value));
					} else {
						parameters.push(optionProvided ? options[key] : defaultOption.value);
					}
					if (Object.keys(defaultProperties[prototype][key]).includes("extra")) {
						parameters.push(defaultOption.extra);
					}
					propertySetters[defaultOption.setter](...parameters);
				}
			},
			/**
			 * Sets a property that has a value for each axis on the canvas. If one value is passed,
			 * that value is set to both axes.
			 * @param {ResponsiveCanvas} instance
			 * @param {string} property
			 * @param {string} expectedType
			 * @param values
			 */
			setAxesProperty(instance, property, expectedType, ...values) {
				if (values.length === 1 && typeof values[0] === expectedType) {
					instance[property] = {
						x: values[0],
						y: values[0]
					};
				} else if (values.length === 2 && typeof values[0] === expectedType && typeof values[1] === expectedType) {
					instance[property] = {
						x: values[0],
						y: values[1]
					};
				} else {
					throw `Error setting axes property ${property}: Unexpected value ${JSON.stringify(values)}.`;
				}
				instance._updateBackground();
			},
			/**
			 * Sets a property that has a single value and simply needs a type check.
			 * @param {ResponsiveCanvas} instance
			 * @param {string} property
			 * @param {string} expectedType
			 * @param value
			 */
			setSingleProperty(instance, property, expectedType, value) {
				if (typeof value === expectedType) {
					instance[property] = value;
				} else {
					throw `Error setting single property ${property}: Unexpected type "${typeof value === "string" ? value : JSON.stringify(value)}".`;
				}
			},
			/**
			 * Sets a property that has a value which is an array.
			 * @param {ResponsiveCanvas} instance
			 * @param {string} property
			 * @param {string} expectedType
			 * @param {Array} values
			 * @param {number} length
			 */
			setArrayProperty(instance, property, expectedType, values, length) {
				if (!Array.isArray(values)) {
					throw `Error setting array property ${property}: "${typeof values === "string" ? values : JSON.stringify(values)}" is not an array.`;
				} else if (values.length !== length) {
					throw `Error setting array property ${property}: "${JSON.stringify(values)}" is not of length ${length}`;
				} else {
					for (const value of values) {
						if (typeof value !== expectedType) {
							throw `Error setting array property ${property}: "Unexpected type "${typeof value === "string" ? value : JSON.stringify(value)}" in array.`;
						}
					}
					instance[property] = values;
				}
			},
			/**
			 * Sets a property that can have a value from a set of choices.
			 * @param {ResponsiveCanvas} instance
			 * @param {string} property
			 * @param {string} expectedType
			 * @param value
			 * @param {Array} choices
			 */
			setChoiceProperty(instance, property, expectedType, value, choices) {
				if (typeof value === expectedType) {
					let validChoice = false;
					for (const choice of choices) {
						if (value === choice) {
							instance[property] = value;
							validChoice = true;
						}
					}
					if (!validChoice) {
						throw `Error setting choice property ${property}: Invalid choice "${typeof value === "string" ? value : JSON.stringify(value)}".`;
					}
				} else {
					throw `Error setting choice property ${property}: Unexpected type "${typeof value === "string" ? value : JSON.stringify(value)}".`;
				}
			},
			/**
			 * Sets a property of a trace on a plot while checking that a valid trace ID was passed.
			 * @param {ResponsiveCanvas} instance
			 * @param {string} trace
			 * @param {string} property
			 * @param value
			 */
			setPlotDataProperty(instance, trace, property, value) {
				const defaultOption = defaultProperties.ResponsivePlot2DTrace[property];
				if (typeof instance.plotData[trace] !== "undefined") {
					const parameters = [instance.plotData[trace], property, defaultOption.type, value];
					if (Object.keys(defaultOption).includes("extra")) {
						parameters.push(defaultOption.extra);
					}
					propertySetters[defaultOption.setter](...parameters);
					instance._updatePlottingData();
				} else {
					throw `Error setting plotData property ${property}: Invalid trace ID "${typeof trace === "string" ? trace : JSON.stringify(trace)}"`;
				}
			}
		};
	
		/**
		 * @private
		 * @description This object holds the default values for all of the properties of the prototypes.
		 * "multi" means that the user can pass in a single value or an array of values.
		 * "extra" holds any extra data that the setter may require (array length, possible choices).
		 */
		const defaultProperties = {
			ResponsiveCanvas: {
				origin: {value: [0, 0], type: "number", setter: "setAxesProperty", multi: true}
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
		};
	
		/**
		 * @memberOf core
		 * @alias Pulsar.core.activeCanvases
		 * @description Object containing the active canvas objects with their ID as the keys. It is used
		 * internally by other functions such as {@link Pulsar.getActivePlots Pulsar.getActivePlots()}.
		 * #### Example Usage
		 * ```
		 * canvas = new Pulsar.ResponsiveCanvas("myCanvas");
		 * console.log(Pulsar.core.activeCanvases);
		 * // Object { myCanvas: Object {...} }
		 *
		 * console.log(Pulsar.core.activeCanvases.myCanvas instanceof Pulsar.core.ResponsiveCanvas);
		 * // true
		 * ```
		 */
		const activeCanvases = {};
	
		/**
		 * @memberOf core
		 * @alias Pulsar.core.ResponsiveCanvas
		 * @description Class representing the base canvas object which all other Pulsar canvas objects inherit from.
		 * This class is not meant to be instantiated directly by a user, mainly because it is not very useful by itself.
		 * However, it does provide a lot of useful functionality which is used by subclasses.
		 * A `ResponsiveCanvas` instance has two drawing surfaces, a background and a foreground.
		 * These drawing surfaces can be added to the HTML page as canvas elements by calling `show` (Does nothing in a Node.js context).
		 * These canvases will then fill the container element, and even change their size when the container element is resized.
		 * The coordinate origin of a ResponsiveCanvas can be changed with `setOrigin`, and it can be drawn on and animated
		 * by passing a drawing function to `setBackground` or `setForeground`. Read-only properties and methods beginning with
		 * an underscore should not be changed/called, otherwise they may cause unpredictable behaviour.
		 * #### Options
		 * When a `ResponsiveCanvas` is created, its properties can be specified by passing an optional object literal with the options as key-value pairs.
		 * The possible options are as follows: (When passing two values instead of just one, use an array).
		 * | Name | Type | Default | Description |
		 * --- | --- | --- | ---
		 * | `origin` | number \| Array.\<number\> \| string | `[0, 0]` | See {@link Pulsar.core.ResponsiveCanvas#setOrigin setOrigin()}. |
		 */
		class ResponsiveCanvas {
			/**
			 * @param {string} id The ID of the canvas object.
			 * @param {Object} [options={}]  Optional parameters from the table below.
			 */
			constructor(id, options={}) {
				/**
				 * @readonly
				 * @description The unique ID for the canvas object.
				 * @type {string}
				 */
				this.id = "";
				/**
				 * @readonly
				 * @description An object holding data about the time evolution of the canvas object. The data is used internally
				 * by the time evolution methods. The `DOMHighResTimeStamps` are obtained from calls to
				 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Performance/now `performance.now()`}.
				 * @type {Object}
				 * @property {number} currentTimeValue The elapsed time (in seconds) since the time evolution was started or resumed.
				 * @property {DOMHighResTimeStamp} startTimestampMS Time (in milliseconds) that the time evolution was started or resumed.
				 * @property {DOMHighResTimeStamp} offsetTimestampMS The elapsed time (in milliseconds) since the time evolution
				 * was started or resumed (only updated when the time evolution is paused).
				 * @property {boolean} timeEvolutionActive Boolean representing whether time evolution is active or not.
				 */
				this.timeEvolutionData = {
					currentTimeValue: 0,
					startTimestampMS: 0,
					offsetTimestampMS: 0,
					timeEvolutionActive: false
				};
				/**
				 * @readonly
				 * @description Object which holds properties for the displaying of the canvas object on the HTML page, such as
				 * the origin value and backgroundCSS (if set).
				 * @type {Object}
				 */
				this.displayProperties = {
					origin: options.origin
				};
				/**
				 * @readonly
				 * @description Object containing key-value pairs of (normally - but not necessarily - numerical) constants for the drawing environment.
				 * Constants can be set with the {@link Pulsar.core.ResponsiveCanvas#setConstant setConstant()} method, and they can be connected up
				 * to an input element on the HTML page with the {@link Pulsar.core.ResponsiveCanvas#connectElementAttribute connectInputElement()} method.
				 * They do not provide much functionality by themselves, but other classes which extend `ResponsiveCanvas`
				 * make use of them for display and interactivity purposes.
				 * @type {Object}
				 */
				this.constants = {};
				this.setID(id);
				if (options.origin === "centre") {
					options.origin = [Math.round(this.width / 2), Math.round(this.height / 2)]; 
				}
				propertySetters.setupProperties(this, "ResponsiveCanvas", options);
			}
	
			/**
			 * @private
			 * @description Sets both canvas dimensions to the width and height properties, translates to the origin
			 * (since setting the width and height resets the transforms), and calls the updateBackground and updateForeground functions.
			 */
			_updateCanvasDimensions() {
				this.canvasContainer.style.width = `${this.width}px`;
				this.canvasContainer.style.height = `${this.height}px`;
				this.backgroundCanvas.width = this.width;
				this.backgroundCanvas.height = this.height;
				this.background.translate(this.origin.x, this.origin.y);
				this._updateBackground();
				this.foregroundCanvas.width = this.width;
				this.foregroundCanvas.height = this.height;
				this.foreground.translate(this.origin.x, this.origin.y);
				this._updateForeground();
			}
	
			/**
			 * @private
			 * @description Clears the background and runs the drawing function (if there is one).
			 */
			_updateBackground() {
				if (this.background !== undefined) {
					this.background.clearRect(-this.origin.x, -this.origin.y, this.width, this.height);
					if (this.backgroundFunction) {
						this.backgroundFunction(this.background, this.timeEvolutionData.currentTimeValue);
					}
				}
			}
	
			/**
			 * @private
			 * @description Clears the foreground and runs the drawing function (if there is one).
			 */
			_updateForeground() {
				if (this.foreground !== undefined) {
					this.foreground.clearRect(-this.origin.x, -this.origin.y, this.width, this.height);
					if (this.foregroundFunction) {
						this.foregroundFunction(this.foreground, this.timeEvolutionData.currentTimeValue);
					}
				}
			}
	
			/**
			 * Sets the drawing function for the background canvas to `drawingFunction` and updates the canvas.
			 * The argument `drawingFunction` should be a function which takes one or two arguments of its own, the first being the
			 * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D `CanvasRenderingContext2D`} for the background,
			 * and the second (which is optional) being the current time evolution value for the canvas object (in seconds).
			 * The second argument need only specified if the drawing function contains animations which depend on the current
			 * time value.
			 * #### Example Usage
			 * ```
			 * myCanvas.setBackground(context => {
			 *     context.fillStyle = "Red";
			 *     context.fillRect(0, 0, 100, 100);
			 * });
			 * ```
			 * @param {Function} drawingFunction The function which draws the background.
			 */
			setBackground(drawingFunction) {
				/**
				 * The function which draws the background.
				 * @type {Function}
				 */
				this.backgroundFunction = drawingFunction;
				this._updateBackground();
			}
	
			/**
			 * Sets the drawing function for the foreground canvas to `drawingFunction` and updates the canvas.
			 * The argument `drawingFunction` should be a function which takes one or two arguments of its own, the first being the
			 * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D `CanvasRenderingContext2D`} for the background,
			 * and the second (which is optional) being the current time evolution value for the canvas object (in seconds).
			 * For example usage see {@link Pulsar.core.ResponsiveCanvas#setBackground setBackground()}.
			 * @param {Function} drawingFunction The function which draws the foreground.
			 */
			setForeground(drawingFunction) {
				/**
				 * The function which draws the foreground.
				 * @type {Function}
				 */
				this.foregroundFunction = drawingFunction;
				this._updateForeground();
			}
	
			/**
			 * Sets the origin of both canvases to the point specified (in pixels).
			 * Two values may be passed for `x` then `y`, or one value may be passed to set the origins of both axes to the same value.
			 * The string `"centre"` may also be passed to conveniently set the origin to the middle of the canvas.
			 * Note that for the HTML5 canvas the origin is in the top-left corner by default and the x-axis points rightwards,
			 * while the y-axis points downwards.
			 * @param {string|number} point Either one number, two numbers, or the string `"centre"`.
			 */
			setOrigin(...point) {
				if (point.length === 1 && point[0] === "centre") {
					propertySetters.setAxesProperty(this,"origin", "number", Math.round(this.width / 2), Math.round(this.height / 2));
					this.displayProperties.origin = "centre";
				} else {
					propertySetters.setAxesProperty(this,"origin", "number", ...point);
				}
				if (this.backgroundCanvas !== undefined && this.foregroundCanvas !== undefined) {
					this._updateCanvasDimensions();
				}
			}
	
			/**
			 * Sets the ID of the canvas object to the value specified,
			 * which cannot be the same as another existing canvas object.
			 * If the canvas object is active on an HTML page, all of its elements will have their `ID`s updated.
			 * @param {string} id New ID for the canvas object.
			 */
			setID(id) {
				if (activeCanvases[id] === undefined) {
					propertySetters.setSingleProperty(this, "id", "string", id);
					activeCanvases[this.id] = this;
				} else {
					throw `Error creating ResponsiveCanvas object: Object with ID "${typeof id === "string" ? id : JSON.stringify(id)}" already exists.`;
				}
			}
	
			/**
			 * Sets the `background` CSS property of the background canvas to the string passed in.
			 * This can be used to set the background for the canvas object to a plain colour, gradient pattern or image
			 * (by default the background is transparent).
			 * @param {string} cssString A valid string for the CSS {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background `background`} property.
			 */
			setBackgroundCSS(cssString) {
				if (typeof cssString === "string") {
					if (this.backgroundCanvas !== undefined) {
						this.backgroundCanvas.style.background = cssString;
					}
					this.displayProperties.backgroundCSS = cssString;
				} else {
					throw `Error setting background CSS for canvas: Unexpected argument ${JSON.stringify(id)}`;
				}
			}
	
			/**
			 * Starts or resumes the time evolution of the foreground.
			 */
			startTime() {
				this.timeEvolutionData.timeEvolutionActive = true;
				this.timeEvolutionData.startTimestampMS = performance.now();
				window.requestAnimationFrame(timestamp => this._updateTime(timestamp));
			}
	
			/**
			 * Pauses the time evolution of the foreground.
			 */
			pauseTime() {
				this.timeEvolutionData.timeEvolutionActive = false;
				this.timeEvolutionData.offsetTimestampMS = performance.now() - this.timeEvolutionData.startTimestampMS;
			}
	
			/**
			 * Stops the time evolution of the foreground and resets the current timestamp to 0.
			 */
			stopTime() {
				this.timeEvolutionData.timeEvolutionActive = false;
				this.timeEvolutionData.currentTimeValue = 0;
				this.timeEvolutionData.offsetTimestampMS = 0;
				this._updateForeground();
			}
	
			/**
			 * @private
			 * @description Recursive function which updates the `currentTimeValue` and updates the foreground.
			 * @param currentTimestamp
			 */
			_updateTime(currentTimestamp) {
				if (this.timeEvolutionData.timeEvolutionActive) {
					this.timeEvolutionData.currentTimeValue = (this.timeEvolutionData.offsetTimestampMS + currentTimestamp - this.timeEvolutionData.startTimestampMS) / 1000;
					this._updateForeground();
					window.requestAnimationFrame(timestamp => this._updateTime(timestamp));
				}
			}
	
			/**
			 * Sets the value of a constant.
			 * @param name The name of the constant. This will be the key in the {@link Pulsar.core.ResponsiveCanvas#constants constants} object.
			 * @param value The value of the constant.
			 */
			setConstant(name, value) {
				this.constants[name] = value;
			}
		}
	
		/**
		 * The base class for all Pulsar plot objects.
		 * @memberOf core
		 * @alias Pulsar.core.ResponsivePlot2D
		 * @description This class is the base class for all Pulsar plot objects. It extends {@link Pulsar.core.ResponsiveCanvas ResponsiveCanvas}.
		 * A `ResponsivePlot2D` object can be created by calling the constructor, but the preferred method is to use the
		 * {@link Pulsar.Plot Pulsar.Plot} class. `ResponsivePlot2D` objects behave similarly to a `ResponsiveCanvas`.
		 * They have a background, which contains the axes and gridlines, and a foreground, which contains the plot data.
		 * The ticks and gridlines can be toggled and the intervals between them can be changed. The size of a unit on the grid
		 * is determined by the grid scale which, by default, is 50 pixels for both `x` and `y`, meaning that a step of one unit in both directions on
		 * the grid would be 50 pixels on the screen. This can be changed with the {@link Pulsar.core.ResponsivePlot2D#setGridScale setGridScale()} method.
		 * Data is added to the plot using the {@link Pulsar.core.ResponsivePlot2D#plot plot()} method.
		 * Read-only properties and methods beginning with an underscore should not be changed/called, otherwise they
		 * may cause unpredictable behaviour.
		 * #### Options
		 * When a `ResponsivePlot2D` is created, its properties can be specified by passing an optional object literal with the options as key-value pairs.
		 * The possible options are as follows (For a full example see the documentation for the {@link Pulsar.Plot Pulsar.Plot} class).
		 * When passing two values instead of just one, use an array.
		 * | Name | Type | Default | Description |
		 * --- | --- | --- | ---
		 * | `majorTicks` | boolean \| Array.\<boolean\> | `[true, true]` | See {@link Pulsar.core.ResponsivePlot2D#setMajorTicks setMajorTicks()}. |
		 * | `minorTicks` | boolean \| Array.\<boolean\> | `[false, false]` | See {@link Pulsar.core.ResponsivePlot2D#setMinorTicks setMinorTicks()}. |
		 * | `majorTickSize` | number \| Array.\<number\> | `[5, 5]` | See {@link Pulsar.core.ResponsivePlot2D#setMajorTickSize setMajorTickSize()}. |
		 * | `minorTickSize` | number \| Array.\<number\> | `[1, 1]` | See {@link Pulsar.core.ResponsivePlot2D#setMinorTickSize setMinorTickSize()}. |
		 * | `majorGridlines` | boolean \| Array.\<boolean\> | `[true, true]` | See {@link Pulsar.core.ResponsivePlot2D#setMajorGridlines setMajorGridlines()}. |
		 * | `minorGridlines` | boolean \| Array.\<boolean\> | `[false, false]` | See {@link Pulsar.core.ResponsivePlot2D#setMinorGridlines setMinorGridlines()}. |
		 * | `majorGridSize` | number \| Array.\<number\> | `[5, 5]` | See {@link Pulsar.core.ResponsivePlot2D#setMajorGridSize setMajorGridSize()}. |
		 * | `minorGridSize` | number \| Array.\<number\> | `[1, 1]` | See {@link Pulsar.core.ResponsivePlot2D#setMinorGridSize setMinorGridSize()}. |
		 * | `gridScale` | number \| Array.\<number\> | `[50, 50]` | See {@link Pulsar.core.ResponsivePlot2D#setGridScale setGridScale()}. |
		 */
		class ResponsivePlot2D extends ResponsiveCanvas {
			/**
			 * @param {string} container The ID of the plot object.
			 * @param {Object} [options={}]  Optional parameters from the table below.
			 */
			constructor(container, options={}) {
				super(container, options);
				propertySetters.setupProperties(this, "ResponsivePlot2D", options);
				/**
				 * @readonly
				 * @description The range of `x` values that will be shown on the plot.
				 * @type {number[]}
				 */
				this.xLims = [];
				/**
				 * @readonly
				 * @description The range of `y` values that will be shown on the plot.
				 * @type {number[]}
				 */
				this.yLims = [];
				/**
				 * @readonly
				 * @description Contains the data trace objects for the plot instance.
				 * The objects can be accessed using the trace ID as the key.
				 * #### Example Usage
				 * ```
				 * // myPlot is a ResponsivePlot2D instance.
				 * // In the previous code a trace with the ID "myData" has been added to myPlot.
				 *
				 * console.log(myPlot.plotData);
				 * // Object { myData: Object {...} }
				 * ```
				 * @type {Object}
				 */
				this.plotData = {};
				this._updateLimits();
				this.setBackground(context => {
					const drawGridSet = (majorOrMinor, xy, ticksOrGridlines, width, lineStart, lineEnd) => {
						const offset = width % 2 === 0 ? 0 : 0.5;
						const intervalSize = this[`${majorOrMinor + (ticksOrGridlines === "Ticks" ? "TickSize" : "GridSize")}`][xy];
						context.lineWidth = width;
						if (this[`${majorOrMinor + ticksOrGridlines}`][xy]) {
							context.beginPath();
							let currentValue = -Math.floor(this.origin[xy] / (intervalSize * this.gridScale[xy])) * intervalSize * this.gridScale[xy];
							if (xy === "x") {
								while (currentValue < this.width - this.origin.x) {
									context.moveTo(currentValue + offset, lineStart);
									context.lineTo(currentValue + offset, lineEnd);
									currentValue += this.gridScale.x * intervalSize;
								}
							} else if (xy === "y") {
								while (currentValue < this.height - this.origin.y) {
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
					drawGridSet("minor", "x", "Gridlines", 1, -this.origin.y, this.height - this.origin.y);
					drawGridSet("minor", "y", "Gridlines", 1, -this.origin.x, this.width - this.origin.x);
					drawGridSet("major", "x", "Gridlines", 2, -this.origin.y, this.height - this.origin.y);
					drawGridSet("major", "y", "Gridlines", 2, -this.origin.x, this.width - this.origin.x);
					drawGridSet("minor", "x", "Ticks", 1, -3, 3);
					drawGridSet("minor", "y", "Ticks", 1, -3, 3);
					drawGridSet("major", "x", "Ticks", 2, -6, 6);
					drawGridSet("major", "y", "Ticks", 2, -6, 6);
					context.beginPath();
					context.lineWidth = 3;
					context.moveTo(0.5, -this.origin.y);
					context.lineTo(0.5, this.height - this.origin.y);
					context.moveTo(-this.origin.x, 0.5);
					context.lineTo(this.width - this.origin.x, 0.5);
					context.stroke();
				});
			}
	
			/**
			 * @private
			 * @description Updates the `xLims` and `yLims` properties when the origin or gridScale is changed.
			 */
			_updateLimits() {
				this.xLims = [-this.origin.x / this.gridScale.x, (this.width - this.origin.x) / this.gridScale.x];
				this.yLims = [-this.origin.y / this.gridScale.y, (this.height - this.origin.y) / this.gridScale.y];
			}
	
			/**
			 * @private
			 * @description Updated the foreground drawing function whenever something to do with the plot data is changed
			 * (data is added/removed, trace properties are changed, or the `xLims`/`yLims` are changed).
			 */
			_updatePlottingData() {
				this.setForeground((context, timeValue) => {
					for (const datasetID of Object.keys(this.plotData)) {
						if (this.plotData[datasetID].visibility === true) {
							const dataset = this.plotData[datasetID];
							if (dataset.traceStyle !== "none") {
								context.strokeStyle = dataset.traceColour;
								context.lineWidth = dataset.traceWidth;
								context.lineJoin = "round";
								switch (dataset.traceStyle) {
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
								const dataGenerator = dataset.data(timeValue, this.xLims, this.yLims, 0.01, dataset.parameterRange);
								context.beginPath();
								for (const currentPoint of dataGenerator) {
									if (!Number.isSafeInteger(Math.round(currentPoint[1]))) {
										currentPoint[1] = currentPoint[1] > 0 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
									}
									context.lineTo(currentPoint[0] * this.gridScale.x, -currentPoint[1] * this.gridScale.y);
								}
								context.stroke();
							}
							if (dataset.markerStyle !== "none") {
								const markerSize = dataset.markerSize;
								context.strokeStyle = dataset.markerColour;
								context.fillStyle = dataset.markerColour;
								context.lineWidth = 2 * markerSize;
								const drawMarker = (() => {
									switch (dataset.markerStyle) {
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
													context.rotate(-theta - Math.PI/2);
													context.moveTo(0, -7 * markerSize);
													context.lineTo(-5 * markerSize, 7 * markerSize);
													context.lineTo(5 * markerSize, 7 * markerSize);
													context.lineTo(0, -7 * markerSize);
													context.fill();
													context.rotate(theta + Math.PI/2);
													context.translate(-x, -y);
												}
											};
									}
								})();
								const dataGenerator = dataset.data(timeValue, this.xLims, this.yLims, 0.001, dataset.parameterRange);
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
	
			/**
			 * Adds a data trace to the plot. The trace must be given a unique ID, so that it can be added to the
			 * {@link Pulsar.core.ResponsivePlot2D#plotData plotData} property of the plot object.
			 * There are several ways that data can be added, which can be divided into **continuous** and **discrete** data.
			 * These different methods are described by what to pass for the `data` argument.
			 * ##### Continuous Data
			 * - The simplest way to add continuous data to an array is simply by passing a function with a single argument for
			 * `x` which outputs a corresponding `y` value.
			 * ```
			 * plot.plot("sineWave", x => Math.sin(x));
			 * ```
			 * - Time dependence for the `y` values may also be introduced by using the second argument for time.
			 * ```
			 * plot.plot("movingSineWave", (x, t) => Math.sin(x-t));
			 * ```
			 * - Parametric curves can also be plotted by passing a two-element array with both elements being functions where
			 * the first argument is the free parameter.
			 * ```
			 * plot.plot("circle", [
			 *     p => Math.cos(p),
			 *     p => Math.sin(p)
			 * ], {
			 *     parameterRange: [0, 2*Math.PI]
			 * });
			 * ```
			 * - These parametric curves can also be made time-dependent using the second argument as time.
			 * ```
			 * plot.plot("lissajousFigure", [
			 *     (p, t) => Math.cos(3*p*t),
			 *     (p, t) => Math.sin(4*p*t)
			 * ], {
			 *     parameterRange: [0, 2*Math.PI]
			 * });
			 * ```
			 * ##### Discrete Data
			 * - The simplest method for discrete data is passing a two-element array where each element is an array of numbers, one
			 * for the `x` values and one for the `y` values. The arrays may be arbitrarily large, as long as they are the same length.
			 * ```
			 * plot.plot("discreteParabola", [
			 *     [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
			 *     [25, 16, 9, 4, 1, 0, 1, 4, 9, 16, 25]
			 * ]);
			 * ```
			 * - A variation of this is where the second array is replaced with a function which takes the `x` values as an
			 * argument, thus acting as a map.
			 * ```
			 * plot.plot("anotherDiscreteParabola", [
			 *     [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
			 *     x => x**2
			 * ]);
			 * ```
			 * - The function can also accept a time parameter.
			 * ```
			 * plot.plot("movingDiscreteParabola", [
			 *     [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
			 *     (x, t) => (x-t)**2
			 * ]);
			 * ```
			 * - The `x` values in a discrete plot can also be made to be time-dependent using functions (Note that any functions
			 * in the second array must have `x` as the first argument, even if it is not used).
			 * ```
			 * plot.plot("anticlockwiseHand", [
			 *     [0, t => Math.cos(t)],
			 *     [0, (x, t) => Math.sin(t)]
			 * ]);
			 * ```
			 * #### Options
			 * When a data trace is added, its properties can be specified by passing an optional object literal with the
			 * options as key-value pairs. The possible options are as follows.
			 * | Name | Type | Default | Description |
			 * --- | --- | --- | ---
			 * | `traceColour` | string | `"blue"` | See {@link Pulsar.core.ResponsivePlot2D#setTraceColour setTraceColour()}. |
			 * | `traceStyle` | string | `"solid"` | See {@link Pulsar.core.ResponsivePlot2D#setTraceStyle setTraceStyle()}. |
			 * | `traceWidth` | number | `3` | See {@link Pulsar.core.ResponsivePlot2D#setTraceWidth setTraceWidth()}. |
			 * | `markerColour` | string | `"blue"` | See {@link Pulsar.core.ResponsivePlot2D#setMarkerColour setMarkerColour()}. |
			 * | `markerStyle` | string | `"none"` | See {@link Pulsar.core.ResponsivePlot2D#setMarkerStyle setMarkerStyle()}. |
			 * | `markerSize` | number | `1` | See {@link Pulsar.core.ResponsivePlot2D#setMarkerSize setMarkerSize()}. |
			 * | `visibility` | boolean | `true` | See {@link Pulsar.core.ResponsivePlot2D#setVisibility setVisibility()}. |
			 * | `parameterRange` | number | `[0, 1]` | See {@link Pulsar.core.ResponsivePlot2D#setParameterRange setParameterRange()}. |
			 * @param {string} id A unique ID for the trace.
			 * @param {Array | Function} data Data to be plotted.
			 * @param {Object} [options={}] Optional parameters from the table below.
			 */
			plot(id, data, options={}) {
				if (typeof id === "string") {
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
									data: function*(t) {
										for (let i=0; i < data[0].length; i++) {
											const xValue = typeof data[0][i] === "function" ? data[0][i](t) : data[0][i];
											const yValue = typeof data[1][i] === "function" ? data[1][i](xValue, t) : data[1][i];
											yield [xValue, yValue];
										}
									}
								};
							} else if (typeof data[1] === "function") {
								if (typeof data[1](0, 0) !== "number") {
									throw "Error setting plot data: Plot function does not return numbers.";
								}
								for (let i = 0; i < data[0].length; i++) {
									if (typeof data[0][i] !== "number") {
										throw "Error setting plot data: Data array contains types which are not numbers.";
									}
								}
								this.plotData[id] = {
									data: function*(t) {
										for (const x of data[0]) {
											yield [x, data[1](x, t)];
										}
									}
								};
							}
						} else if (typeof data[0] === "function" && typeof data[1] === "function") {
							this.plotData[id] = {
								data: function*(t, xLims, yLims, step, paramLims) {
									let x = p => data[0](p, t);
									let y = p => data[1](p, t);
									let p = paramLims[0];
									while(p <= paramLims[1]) {
										yield [x(p), y(p)];
										p += step;
									}
									yield [x(p), y(p)];
								}
							};
						}
					} else if (typeof data === "function") {
						if (typeof data(0, 0) !== "number") {
							throw "Error setting plot data: Plot function does not return numbers.";
						}
						this.plotData[id] = {
							data: function*(t, xLims, yLims, step) {
								let x = xLims[0];
								let y = x => data(x, t);
								while (x <= xLims[1]) {
									while (true) { 
										if (x > xLims[1]) { 
											break;
										} else if (y(x) <= yLims[1] && y(x) >= yLims[0] && !Number.isNaN(y(x))) { 
											yield [x - step, y(x - step)];
											break;
										} else { 
											x += step;
										}
									}
									while (true) { 
										yield [x, y(x)];
										if (x > xLims[1] || y(x) > yLims[1] || y(x) < yLims[0] || Number.isNaN(y(x))) { 
											break;
										} else { 
											x += step;
										}
									}
								}
							}
						};
					} else {
						throw `Error setting plot data: Unrecognised data signature ${JSON.stringify(data)}.`;
					}
					propertySetters.setupProperties(this.plotData[id], "ResponsivePlot2DTrace", options);
					this._updatePlottingData();
				} else {
					throw `Error setting plot data: Unexpected type for ID "${JSON.stringify(id)}"`;
				}
			}
	
			/**
			 * Removes a trace from the plot.
			 * @param {string} id ID of the trace to be removed.
			 */
			removeData(id) {
				delete this.plotData[id];
				this._updatePlottingData();
			}
	
			setOrigin(...point) {
				super.setOrigin(...point);
				this._updateLimits();
			}
	
			/**
			 * Toggles the major ticks. Two values may be passed for `x` then `y`, or just a single value for both axes.
			 * @param {boolean} choices Either one or two booleans.
			 */
			setMajorTicks(...choices) {
				propertySetters.setAxesProperty(this,"majorTicks", "boolean", ...choices);
			}
	
			/**
			 * Toggles the minor ticks. Two values may be passed for `x` then `y`, or just a single value for both axes.
			 * @param {boolean} choices Either one or two booleans.
			 */
			setMinorTicks(...choices) {
				propertySetters.setAxesProperty(this,"minorTicks", "boolean", ...choices);
			}
	
			/**
			 * Sets the spacing of the major ticks (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
			 * @param {number} sizes Either one or two numbers.
			 */
			setMajorTickSize(...sizes) {
				propertySetters.setAxesProperty(this,"majorTickSize", "number", ...sizes);
			}
	
			/**
			 * Sets the spacing of the minor ticks (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
			 * @param {number} sizes Either one or two numbers.
			 */
			setMinorTickSize(...sizes) {
				propertySetters.setAxesProperty(this,"minorTickSize", "number", ...sizes);
			}
	
			/**
			 * Toggles the major gridlines. Two values may be passed for `x` then `y`, or just a single value for both axes.
			 * @param {boolean} choices Either one or two booleans.
			 */
			setMajorGridlines(...choices) {
				propertySetters.setAxesProperty(this,"majorGridlines", "boolean", ...choices);
			}
	
			/**
			 * Toggles the minor gridlines. Two values may be passed for `x` then `y`, or just a single value for both axes.
			 * @param {boolean} choices Either one or two booleans.
			 */
			setMinorGridlines(...choices) {
				propertySetters.setAxesProperty(this,"minorGridlines", "boolean", ...choices);
			}
	
			/**
			 * Sets the spacing of the major gridlines (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
			 * @param {number} sizes Either one or two numbers.
			 */
			setMajorGridSize(...sizes) {
				propertySetters.setAxesProperty(this,"majorGridSize", "number", ...sizes);
			}
	
			/**
			 * Sets the spacing of the minor gridlines (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
			 * @param {number} sizes Either one or two numbers.
			 */
			setMinorGridSize(...sizes) {
				propertySetters.setAxesProperty(this,"minorGridSize", "number", ...sizes);
			}
	
			/**
			 * Sets the size of 1 grid unit in pixels. Two values may be passed for `x` then `y`, or just a single value for both axes.
			 * @param {number} sizes Either one or two numbers.
			 */
			setGridScale(...sizes) {
				propertySetters.setAxesProperty(this,"gridScale", "number", ...sizes);
				this._updateLimits();
				this._updateForeground();
			}
	
			/**
			 * Changes the range of `x` values to be shown on the plot by moving the origin and altering the grid scale.
			 * @param {number} min The minimum value of `x`.
			 * @param {number} max The maximum value of `x`.
			 */
			setXLims(min, max) {
				if (max >= min) {
					propertySetters.setArrayProperty(this, "xLims", "number", [min, max], 2);
				} else {
					throw `Error setting xLims: Lower limit cannot be higher than or equal to higher limit.`;
				}
				this.gridScale.x = this.width / Math.abs(this.xLims[0] - this.xLims[1]);
				super.setOrigin(-this.xLims[0] * this.gridScale.x, this.origin.y);
				this._updateBackground();
				this._updatePlottingData();
	
			}
	
			/**
			 * Changes the range of `y` values to be shown on the plot by moving the origin and altering the grid scale.
			 * @param {number} min The minimum value of `y`.
			 * @param {number} max The maximum value of `y`.
			 */
			setYLims(min, max) {
				if (max >= min) {
					propertySetters.setArrayProperty(this, "xLims", "number", [min, max], 2);
				} else {
					throw `Error setting yLims: Lower limit cannot be higher than or equal to higher limit.`;
				}
				this.gridScale.y = this.height / Math.abs(this.yLims[0] - this.yLims[1]);
				super.setOrigin(this.origin.x, this.yLims[1] * this.gridScale.y);
				this._updateBackground();
				this._updatePlottingData();
			}
	
			/**
			 * Sets the colour of the specified trace. The specified colour must be one of the browser-recognised colours.
			 * @param {string} trace The ID of the trace to be updated.
			 * @param {string} colour The name of the colour.
			 */
			setTraceColour(trace, colour) {
				propertySetters.setPlotDataProperty(this, trace, "traceColour", colour);
			}
	
			/**
			 * Sets the style of the specified trace. Possible styles are: `solid`, `dotted`, `dashed`, `dashdot`, or `none`.
			 * @param {string} trace The ID of the trace to be updated.
			 * @param {string} style The name of the style.
			 */
			setTraceStyle(trace, style) {
				propertySetters.setPlotDataProperty(this, trace, "traceStyle", style);
			}
	
			/**
			 * Sets the width of the specified trace (in pixels).
			 * @param {string} trace The ID of the trace to be updated.
			 * @param {number} width The width of the trace in pixels.
			 */
			setTraceWidth(trace, width) {
				propertySetters.setPlotDataProperty(this, trace, "traceWidth", width);
			}
	
			/**
			 * Sets the colour of the markers on the specified trace. The specified colour must be one of the browser-recognised colours.
			 * @param {string} trace The ID of the trace to be updated.
			 * @param {string} colour The name of the colour.
			 */
			setMarkerColour(trace, colour) {
				propertySetters.setPlotDataProperty(this, trace, "markerColour", colour);
			}
	
			/**
			 * Sets the style of the markers the specified trace. Possible styles are: `circle`, `plus`, `cross`, `arrow`, or `none`.
			 * @param {string} trace The ID of the trace to be updated.
			 * @param {string} style The name of the style.
			 */
			setMarkerStyle(trace, style) {
				propertySetters.setPlotDataProperty(this, trace, "markerStyle", style);
			}
	
			/**
			 * Sets the width of the markers on the specified trace (in pixels).
			 * @param {string} trace The ID of the trace to be updated.
			 * @param {number} size The size of the markers in pixels.
			 */
			setMarkerSize(trace, size) {
				propertySetters.setPlotDataProperty(this, trace, "markerSize", size);
			}
	
			/**
			 * Toggles the visibility of the specified trace.
			 * @param {string} trace The ID of the trace to be updated.
			 * @param {boolean} value Set to `true` for the trace to be visible, `false` for it to be hidden.
			 */
			setVisibility(trace, value) {
				propertySetters.setPlotDataProperty(this, trace, "visibility", value);
			}
	
			/**
			 * Sets the range of values over which a parameter should be plotted. For example, to plot a circle using
			 * parameterised functions, one would do:
			 * ```
			 * // myPlot is a ResponsivePlot2D instance.
			 * myPlot.plot("circle", [p => Math.cos(p), p => Math.sin(p)]);
			 * myPlot.setParameterRange("circle", 0, 2*Math.PI);
			 * ```
			 * This property has no effect at all if the function plotted does not have a free parameter.
			 * @param {string} trace The ID of the trace to be updated.
			 * @param {number} min The minimum value of the free parameter.
			 * @param {number} max The maximum value of the free parameter.
			 */
			setParameterRange(trace, min, max) {
				if (max >= min) {
					propertySetters.setPlotDataProperty(this, trace, "parameterRange", [min, max]);
				} else {
					throw `Error setting parameterRange: Lower limit cannot be higher than or equal to higher limit.`;
				}
			}
		}
	
		return {
			activeCanvases: activeCanvases,
			ResponsiveCanvas: ResponsiveCanvas,
			ResponsivePlot2D: ResponsivePlot2D
		};
	})();
	
	/**
	 * @alias Pulsar.Plot
	 * @description
	 * Class representing the basic figure object that more complicated plot types inherit from. This type extends
	 * {@link Pulsar.core.ResponsivePlot2D ResponsivePlot2D}.
	 *
	 * #### Options
	 * The possible options are those from the {@link Pulsar.core.ResponsivePlot2D} and {@link Pulsar.core.ResponsiveCanvas} classes,
	 * with the addition of `xLims` and `yLims` - which if specified will override the `gridScale` option if either is present -
	 * and also a `backgroundCSS` option for specifying the background of the canvas. Here is the full list of options:
	 * | Name | Type | Default | Description |
	 * --- | --- | --- | ---
	 * | `origin` | number \| Array.\<number\> \| string | `[0, 0]` | See {@link Pulsar.core.ResponsiveCanvas#setOrigin ResponsiveCanvas.setOrigin()}. |
	 * | `backgroundCSS` | string | `""` | See {@link Pulsar.core.ResponsiveCanvas#setBackgroundCSS ResponsiveCanvas.setBackgroundCSS()}. |
	 * | `majorTicks` | boolean \| Array.\<boolean\> | `[true, true]` | See {@link Pulsar.core.ResponsivePlot2D#setMajorTicks ResponsivePlot2D.setMajorTicks()}. |
	 * | `minorTicks` | boolean \| Array.\<boolean\> | `[false, false]` | See {@link Pulsar.core.ResponsivePlot2D#setMinorTicks ResponsivePlot2D.setMinorTicks()}. |
	 * | `majorTickSize` | number \| Array.\<number\> | `[5, 5]` | See {@link Pulsar.core.ResponsivePlot2D#setMajorTickSize ResponsivePlot2D.setMajorTickSize()}. |
	 * | `minorTickSize` | number \| Array.\<number\> | `[1, 1]` | See {@link Pulsar.core.ResponsivePlot2D#setMinorTickSize ResponsivePlot2D.setMinorTickSize()}. |
	 * | `majorGridlines` | boolean \| Array.\<boolean\> | `[true, true]` | See {@link Pulsar.core.ResponsivePlot2D#setMajorGridlines ResponsivePlot2D.setMajorGridlines()}. |
	 * | `minorGridlines` | boolean \| Array.\<boolean\> | `[false, false]` | See {@link Pulsar.core.ResponsivePlot2D#setMinorGridlines ResponsivePlot2D.setMinorGridlines()}. |
	 * | `majorGridSize` | number \| Array.\<number\> | `[5, 5]` | See {@link Pulsar.core.ResponsivePlot2D#setMajorGridSize ResponsivePlot2D.setMajorGridSize()}. |
	 * | `minorGridSize` | number \| Array.\<number\> | `[1, 1]` | See {@link Pulsar.core.ResponsivePlot2D#setMinorGridSize ResponsivePlot2D.setMinorGridSize()}. |
	 * | `gridScale` | number \| Array.\<number\> | `[50, 50]` | See {@link Pulsar.core.ResponsivePlot2D#setGridScale ResponsivePlot2D.setGridScale()}. |
	 * | `xLims` | Array.\<number\> | Dependent on canvas size. | See {@link Pulsar.core.ResponsivePlot2D#setXLims ResponsivePlot2D.setXLims()}. |
	 * | `yLims` | Array.\<number\> | Dependent on canvas size. | See {@link Pulsar.core.ResponsivePlot2D#setYLims ResponsivePlot2D.setYLims()}. |
	 *
	 * #### Creating a simple plot of a parabola.
	 * ```
	 * // first, create a <div> element and add it to the body:
	 * const container = document.createElement("div");
	 * container.id = "myPlotContainer";
	 * container.style.width = "500px";
	 * container.style.height = "500px";
	 * document.body.appendChild(container);
	 *
	 * // now, we can create the plot:
	 * const figure = new Pulsar.Plot("myPlot", {
	 *     id: "parabola",
	 *     data: x => x**2
	 * }, {
	 *     origin: "centre",
	 *     minorTicks: true,
	 *     yLims: [-2, 4]
	 * });
	 * figure.show("#myPlotContainer");
	 * ```
	 */
	class Plot extends core.ResponsivePlot2D {
		/**
		 * @param {string} id - The ID of the plot object. Must be unique.
		 * @param {Object|null} data - The data to be plotted. The structure of the object follows the exact same pattern as the signature of
		 * [Pulsar.core.ResponsivePlot2D.plot()]{@link Pulsar.core.ResponsivePlot2D#plot}. If `null` is passed, no data will be plotted.
		 * @param {string} data.id - The ID for the trace. This ID will be the key for the relevant entry in the [plotData]{@link Pulsar.core.ResponsivePlot2D#plotData}
		 * property of the plot object.
		 * @param {Array | Function} data.data - The data to be plotted. See the [plot()]{@link Pulsar.core.ResponsivePlot2D#plot}
		 * method documentation for more details.
		 * @param {Object} data.object - The options for the data. See the [plot()]{@link Pulsar.core.ResponsivePlot2D#plot} method documentation for more details.
		 * @param {Object} options - Options for the plot.
		 */
		constructor(id, data=null, options={}) {
			super(id, options);
			if (options.hasOwnProperty("backgroundCSS")) {
				this.setBackgroundCSS(options.backgroundCSS);
			}
			if (options.hasOwnProperty("xLims")) {
				this.setXLims(...options.xLims);
			}
			if (options.hasOwnProperty("yLims")) {
				this.setYLims(...options.yLims);
			}
			if (data !== null) {
				this.plot(data.id, data.data, data.options);
			}
		}
	}
	
	/**
	 * Returns an object containing the active instances of {@link Pulsar.core.ResponsivePlot2D}.
	 * @function Pulsar.getActivePlots
	 * @returns {Object}
	 * #### Example Usage
	 * ```
	 * const plot = new Pulsar.Plot("myPlot");
	 * console.log(Pulsar.getActivePlots());
	 * // Object { myPlot: {...} }
	 * ```
	 */
	function getActivePlots() {
		const activePlots = {};
		for (const canvasID of Object.keys(core.activeCanvases)) {
			if (core.activeCanvases[canvasID] instanceof core.ResponsivePlot2D) {
				activePlots[canvasID] = core.activeCanvases[canvasID];
			}
		}
		return activePlots;
	}
	
	/**
	 * @alias Pulsar.core.ResponsiveCanvas#show
	 * @description Displays the canvas object on the HTML page inside the element specified by the query selector.
	 * A block-level element such as a `<div>` is recommended for the canvas object to work correctly.
	 * This is not available in Node.js environments.
	 * @param {string} element {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector Query selector} for the element.
	 */
	core.ResponsiveCanvas.prototype.show = function (element) {
		this.containerElement = document.querySelector(element);
		this.canvasContainer = document.createElement("div");
		this.canvasContainer.id = this.id;
		this.canvasContainer.style.position = "relative";
		this.backgroundCanvas = document.createElement("canvas");
		this.foregroundCanvas = document.createElement("canvas");
		this.backgroundCanvas.style.position = "absolute";
		this.backgroundCanvas.style.left = "0";
		this.backgroundCanvas.style.top = "0";
		this.backgroundCanvas.id = `${this.id}-background-canvas`;
		this.foregroundCanvas.style.position = "absolute";
		this.foregroundCanvas.style.left = "0";
		this.foregroundCanvas.style.top = "0";
		this.foregroundCanvas.id = `${this.id}-foreground-canvas`;
		this.canvasContainer.appendChild(this.backgroundCanvas);
		this.canvasContainer.appendChild(this.foregroundCanvas);
		this.containerElement.appendChild(this.canvasContainer);
		this.background = this.backgroundCanvas.getContext("2d");
		this.foreground = this.foregroundCanvas.getContext("2d");
		this.width = this.containerElement.clientWidth;
		this.height = this.containerElement.clientHeight;
		this.observer = new ResizeObserver(entries => {
			for (const entry of entries) {
				this.width = entry.target.clientWidth;
				this.height = entry.target.clientHeight;
				this._updateCanvasDimensions();
			}
		});
		this.observer.observe(this.containerElement);
		for (const property of Object.keys(this.displayProperties)) {
			this[`set${property[0].toUpperCase()}${property.slice(1)}`](this.displayProperties[property]);
		}
	};
	
	/**
	 * @alias Pulsar.core.ResponsiveCanvas#connectElementAttribute
	 * @description Sets up an event listener for `event` which when triggered will set the value of `constant` to the value
	 * of `attribute` on the `element`. The element attribute value can be transformed using the optional `transform` argument, which takes
	 * the form of a function with one argument (the input value) and one return (the transformed input value). One example usage
	 * of this is coercing a boolean to an number by passing the `Number` constructor (`Number(true) === 1, Number(false) === 0`).
	 *
	 * #### Example Usage
	 * ```
	 * // Creating a slider on the HTML page and connecting its `value` attribute to a constant.
	 * slider = document.createElement("input");
	 * slider.type = "range";
	 * document.body.appendChild(slider);
	 *
	 * // The following are functionally equivalent:
	 * plot.connectElementAttribute(slider, "input", "value", "myConstant", Number);
	 * // ----------
	 * slider.oninput = function() {
	 *     plot.setConstant("A", Number(this.value));
	 * };
	 * ```
	 * @param {string|Element} element A {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector Query selector} or a reference to the element.
	 * @param {string} event The event that will trigger the constant update.
	 * @param {string} attribute The attribute of the element which will become the constant value.
	 * @param {string} constant The name of the constant to be updated.
	 * @param {function} transform Optional transform function for the value of the input element.
	 */
	core.ResponsiveCanvas.prototype.connectElementAttribute = function(element, event, attribute, constant, transform=(x)=>x) {
		if (element instanceof Element) {
			element.addEventListener(event, () => {
				this.setConstant(constant, transform(element[attribute]));
			});
			this.setConstant(constant, transform(element[attribute]));
		} else if (typeof element === "string") {
			const target = document.querySelector(element);
			if (target instanceof Element) {
				target.addEventListener(event, () => {
					this.setConstant(constant, transform(target[attribute]));
				});
				this.setConstant(constant, transform(target[attribute]));
			} else {
				throw `Element with ID "${element}" could not be found.`;
			}
		} else {
			throw `Element is not a valid element.`;
		}
	};
	
	return {
		core: core,
		Plot: Plot,
		getActivePlots: getActivePlots
	};
})();