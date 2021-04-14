const core = (function() {
	const propertySetters = {
		setupProperties(instance, prototype, options) {
			for (const key in defaultProperties[prototype]) {
				if (defaultProperties[prototype].hasOwnProperty(key)) {
					const option = defaultProperties[prototype][key];
					const optionProvided = Object.keys(options).includes(key);
					const parameters = [instance, key, option.type];
					if (Array.isArray(option.value)) {
						parameters.push(...(optionProvided ? (Array.isArray(options[key]) ? options[key] : [options[key]]) : option.value));
					} else {
						parameters.push(optionProvided ? options[key] : option.value);
					}
					if (Object.keys(defaultProperties[prototype][key]).includes("extra")) {
						parameters.push(option.extra);
					}
					propertySetters[option.setter](...parameters);
				}
			}
		},
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
		setSingleProperty(instance, property, expectedType, value) {
			if (typeof value === expectedType) {
				instance[property] = value;
			} else {
				throw `Error setting single property ${property}: Unexpected type "${typeof value === "string" ? value : JSON.stringify(value)}".`;
			}
		},
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
		setLegendProperty(instance, traceID, property, value) {
			const defaults = defaultProperties.ResponsivePlot2DTrace[property];
			if (typeof instance.legend[traceID] !== "undefined") {
				const parameters = [instance.legend[traceID], property, defaults.type, value];
				if (Object.keys(defaults).includes("extra")) {
					parameters.push(defaults.extra);
				}
				propertySetters[defaults.setter](...parameters);
				instance._updatePlottingData();
			} else {
				throw `Error setting legend property ${property}: Invalid trace ID "${typeof traceID === "string" ? traceID : JSON.stringify(traceID)}"`;
			}
		}
	};

	const defaultProperties = {
		ResponsiveCanvas: {
			origin: {value: [0, 0], type: "number", setter: "setAxesProperty"}
		},
		ResponsivePlot2D: {
			majorTicks: {value: [true, true], type: "boolean", setter: "setAxesProperty"},
			minorTicks: {value: [false, false], type: "boolean", setter: "setAxesProperty"},
			majorTickSize: {value: [5, 5], type: "number", setter: "setAxesProperty"},
			minorTickSize: {value: [1, 1], type: "number", setter: "setAxesProperty"},
			majorGridlines: {value: [true, true], type: "boolean", setter: "setAxesProperty"},
			minorGridlines: {value: [false, false], type: "boolean", setter: "setAxesProperty"},
			majorGridSize: {value: [5, 5], type: "number", setter: "setAxesProperty"},
			minorGridSize: {value: [1, 1], type: "number", setter: "setAxesProperty"},
			gridScale: {value: [50, 50], type: "number", setter: "setAxesProperty"}
		},
		ResponsivePlot2DTrace: {
			traceColour: {value: "blue", type: "string", setter: "setSingleProperty"},
			traceStyle: {value: "solid", type: "string", setter: "setChoiceProperty", extra: ["solid", "dotted", "dashed", "dashdot", "none"]},
			traceWidth: {value: 3, type: "number", setter: "setSingleProperty"},
			markerColour: {value: "blue", type: "string", setter: "setSingleProperty"},
			markerStyle: {value: "none", type: "string", setter: "setChoiceProperty", extra: ["circle", "plus", "cross", "none"]},
			markerSize: {value: 1, type: "number", setter: "setSingleProperty"}
		}
	};

	const activeCanvases = {};

	class ResponsiveCanvas {
		constructor(container, options={}) {
			if (typeof container === "string") {
				const element = document.getElementById(container);
				if (element) {
					this.container = element;
					this.id = container;
				} else {
					throw `Error in ResponsiveCanvas constructor: Element with ID ${JSON.stringify(container)} could not be found.`;
				}
				this.container = document.getElementById(container);
			} else if (container instanceof Element) {
				this.container = container;
				if (container.id) {
					this.id = container.id;
				} else {
					throw `Error in ResponsiveCanvas constructor: Container element must have a valid ID.`;
				}
			} else {
				throw "Error in ResponsiveCanvas constructor: Container parameter could not be recognised as an Element or an ID string.";
			}
			activeCanvases[this.id] = this;
			this.container.style.position = "relative";
			this.backgroundCanvas = document.createElement("canvas");
			this.foregroundCanvas = document.createElement("canvas");
			this.background = this.backgroundCanvas.getContext("2d");
			this.foreground = this.foregroundCanvas.getContext("2d");
			this.width = this.container.clientWidth;
			this.height = this.container.clientHeight;
			if (options.origin === "center" || options.origin === "centre") {
				options.origin = [Math.round(this.width / 2), Math.round(this.height / 2)];
			}
			propertySetters.setupProperties(this, "ResponsiveCanvas", options);
			this.observer = new ResizeObserver(entries => {
				for (const entry of entries) {
					this.width = entry.target.clientWidth;
					this.height = entry.target.clientHeight;
					this._updateCanvasDimensions();
				}
			});
			this.observer.observe(this.container);
			this.backgroundCanvas.style.position = "absolute";
			this.backgroundCanvas.style.left = "0";
			this.backgroundCanvas.style.top = "0";
			this.foregroundCanvas.style.position = "absolute";
			this.foregroundCanvas.style.left = "0";
			this.foregroundCanvas.style.top = "0";
			this.container.appendChild(this.backgroundCanvas);
			this.container.appendChild(this.foregroundCanvas);
			this.setID(this.id);
			this.currentTimeValue = 0;
			this.startTimeStamp = 0;
			this.offsetTimeStamp = 0;
			this.timeEvolutionActive = false;
		}

		_updateCanvasDimensions() {
			this.backgroundCanvas.width = this.width;
			this.backgroundCanvas.height = this.height;
			this.background.translate(this.origin.x, this.origin.y);
			this._updateBackground();
			this.foregroundCanvas.width = this.width;
			this.foregroundCanvas.height = this.height;
			this.foreground.translate(this.origin.x, this.origin.y);
			this._updateForeground();
		}

		_updateBackground() {
			this.background.clearRect(-this.origin.x, -this.origin.y, this.width, this.height);
			if (this.backgroundFunction) {
				this.backgroundFunction(this.background);
			}
		}

		_updateForeground() {
			this.foreground.clearRect(-this.origin.x, -this.origin.y, this.width, this.height);
			if (this.foregroundFunction) {
				this.foregroundFunction(this.foreground);
			}
		}

		setBackground(drawingFunction) {
			this.backgroundFunction = drawingFunction;
			this._updateBackground();
		}

		setForeground(drawingFunction) {
			this.foregroundFunction = drawingFunction;
			this._updateForeground();
		}

		startTime() {
			this.timeEvolutionActive = true;
			this.startTimeStamp = performance.now();
			window.requestAnimationFrame(timeStamp => this._updateTime(timeStamp));
		}

		pauseTime() {
			this.timeEvolutionActive = false;
			this.offsetTimeStamp = performance.now() - this.startTimeStamp;
		}

		stopTime() {
			this.timeEvolutionActive = false;
			this.currentTimeValue = 0;
			this.offsetTimeStamp = 0;
			this._updateForeground();
		}

		_updateTime(currentTimeStamp) {
			if (this.timeEvolutionActive) {
				this.currentTimeValue = (this.offsetTimeStamp + currentTimeStamp - this.startTimeStamp) / 1000;
				this._updateForeground();
				window.requestAnimationFrame(currentTimeStamp => this._updateTime(currentTimeStamp));
			}
		}

		setOrigin(...point) {
			if (point.length === 1 && (point[0] === "centre" || point[0] === "center")) {
				propertySetters.setAxesProperty(this,"origin", "number", Math.round(this.width / 2), Math.round(this.height / 2));
			} else {
				propertySetters.setAxesProperty(this,"origin", "number", ...point);
			}
			this._updateCanvasDimensions();
		}

		setID(id) {
			const oldID = this.id;
			propertySetters.setSingleProperty(this, "id", "string", id);
			delete activeCanvases[oldID];
			activeCanvases[this.id] = this;
			this.backgroundCanvas.parentElement.id = this.id;
			this.backgroundCanvas.id = `${this.id}-background-canvas`;
			this.foregroundCanvas.id = `${this.id}-foreground-canvas`;
		}

		setBackgroundCSS(cssString) {
			if (typeof cssString === "string") {
				this.backgroundCanvas.style.background = cssString;
			} else {
				throw `Error setting background CSS for canvas: Unexpected argument ${JSON.stringify(id)}`;
			}
		}
 	}

	class ResponsivePlot2D extends ResponsiveCanvas {
		constructor(container, options={}) {
			super(container, options);
			propertySetters.setupProperties(this, "ResponsivePlot2D", options);
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
			this.legend = {};
		}

		_updateLimits() {
			this.xLims = [-this.origin.x / this.gridScale.x, (this.width - this.origin.x) / this.gridScale.x];
			this.yLims = [-this.origin.y / this.gridScale.y, (this.height - this.origin.y) / this.gridScale.y];
		}

		_updatePlottingData() {
			this.setForeground(context => {
				for (const datasetID in this.legend) {
					if (this.legend.hasOwnProperty(datasetID)) {
						const dataset = this.legend[datasetID];
						if (dataset.traceStyle !== "none") {
							context.strokeStyle = dataset.traceColour;
							context.lineWidth = dataset.traceWidth;
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
							const dataGenerator = dataset.data(...this.xLims, ...this.yLims, 1 / 100, this.currentTimeValue);
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
								}
							})();
							const dataGenerator = dataset.data(...this.xLims, ...this.yLims, 1 / 100);
							for (const currentPoint of dataGenerator) {
								context.beginPath();
								drawMarker(context, currentPoint[0] * this.gridScale.x, -currentPoint[1] * this.gridScale.y);
							}
						}
					}
				}
			});
		}

		addData(data, id, options={}) {
			if (typeof id === "string") {
				if (Array.isArray(data) && data.length === 2 && Array.isArray(data[0]) && Array.isArray(data[1])) {
					if (data[0].length !== data[1].length) {
						throw "Error setting plot data: Lengths of data arrays are not equal";
					}
					for (let i = 0; i < data[0].length; i++) {
						if (typeof data[0][i] !== "number" || typeof data[1][i] !== "number") {
							throw "Error setting plot data: Data arrays contain types which are not numbers.";
						}
					}
					this.legend[id] = {
						data: function*() {
							for (let i=0; i < data[0].length; i++) {
								yield [data[0][i], data[1][i]];
							}
						}
					};
				} else if (typeof data === "function") {
					if (typeof data(0, 0) !== "number") {
						throw "Error setting plot data: Plot function does not return numbers.";
					}
					this.legend[id] = {
						data: function*(xMin, xMax, yMin, yMax, step, t) {
							// TODO: discontinuities
							let x = xMin;
							let y = x => data(x, t);
							while (x <= xMax) {
								while (true) { // while y is out of range or undefined
									if (x > xMax) { // if x is out of range, break without yielding previous point
										break;
									} else if (y(x) <= yMax && y(x) >= yMin && !Number.isNaN(y(x))) { // if y is in range, yield the previous point and break
										yield [x - step, y(x - step)];
										break;
									} else { // else increment x
										x += step;
									}
								}
								while (true) { // while y in in range and defined
									yield [x, y(x)];
									if (x > xMax || y(x) > yMax || y(x) < yMin || Number.isNaN(y(x))) { // if x or y is out of range, yield current point and break
										break;
									} else { // else increment x
										x += step;
									}
								}
							}
						}
					};
				} else {
					throw `Error setting plot data: Unrecognised data signature ${JSON.stringify(data)}.`;
				}
				propertySetters.setupProperties(this.legend[id], "ResponsivePlot2DTrace", options);
				this._updatePlottingData();
			} else {
				throw `Error setting plot data: Unexpected type for ID "${JSON.stringify(id)}"`;
			}
		}

		removeData(id) {
			delete this.legend[id];
			this._updatePlottingData();
		}

		setOrigin(...point) {
			super.setOrigin(...point);
			this._updateLimits();
		}

		setMajorTicks(...choices) {
			propertySetters.setAxesProperty(this,"majorTicks", "boolean", ...choices);
		}

		setMinorTicks(...choices) {
			propertySetters.setAxesProperty(this,"minorTicks", "boolean", ...choices);
		}

		setMajorTickSize(...sizes) {
			propertySetters.setAxesProperty(this,"majorTickSize", "number", ...sizes);
		}

		setMinorTickSize(...sizes) {
			propertySetters.setAxesProperty(this,"minorTickSize", "number", ...sizes);
		}

		setMajorGridlines(...choices) {
			propertySetters.setAxesProperty(this,"majorGridlines", "boolean", ...choices);
		}

		setMinorGridlines(...choices) {
			propertySetters.setAxesProperty(this,"minorGridlines", "boolean", ...choices);
		}

		setMajorGridSize(...sizes) {
			propertySetters.setAxesProperty(this,"majorGridSize", "number", ...sizes);
		}

		setMinorGridSize(...sizes) {
			propertySetters.setAxesProperty(this,"minorGridSize", "number", ...sizes);
		}

		setGridScale(...sizes) {
			propertySetters.setAxesProperty(this,"gridScale", "number", ...sizes);
			this._updateLimits();
			this._updateForeground();
		}

		setTraceColour(traceID, colour) {
			propertySetters.setLegendProperty(this, traceID, "traceColour", colour);
		}

		setTraceStyle(traceID, style) {
			propertySetters.setLegendProperty(this, traceID, "traceStyle", style);
		}

		setTraceWidth(traceID, width) {
			propertySetters.setLegendProperty(this, traceID, "traceWidth", width);
		}

		setMarkerColour(traceID, colour) {
			propertySetters.setLegendProperty(this, traceID, "markerColour", colour);
		}

		setMarkerStyle(traceID, style) {
			propertySetters.setLegendProperty(this, traceID, "markerStyle", style);
		}

		setMarkerSize(traceID, size) {
			propertySetters.setLegendProperty(this, traceID, "markerSize", size);
		}

		setXLims(...range) {
			const oldLims = this.xLims;
			propertySetters.setArrayProperty(this, "xLims", "number", range, 2);
			if (this.xLims[0] >= this.xLims[1]) {
				this.xLims = oldLims;
				throw `Error setting xLims: Lower limit cannot be higher than or equal to higher limit.`;
			}
			this.gridScale.x = this.width / Math.abs(this.xLims[0] - this.xLims[1]);
			super.setOrigin(-this.xLims[0] * this.gridScale.x, this.origin.y);
			this._updateBackground();
			this._updatePlottingData();
		}

		setYLims(...range) {
			const oldLims = this.yLims;
			propertySetters.setArrayProperty(this, "yLims", "number", range, 2);
			if (this.yLims[0] >= this.yLims[1]) {
				this.yLims = oldLims;
				throw `Error setting yLims: Lower limit cannot be higher than or equal to higher limit.`;
			}
			this.gridScale.y = this.height / Math.abs(this.yLims[0] - this.yLims[1]);
			super.setOrigin(this.origin.x, this.yLims[1] * this.gridScale.y);
			this._updateBackground();
			this._updatePlottingData();
		}
	}

	return {
		activeCanvases: activeCanvases,
		ResponsiveCanvas: ResponsiveCanvas,
		ResponsivePlot2D: ResponsivePlot2D
	};
})();
