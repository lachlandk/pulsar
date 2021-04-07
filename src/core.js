const core = (function() {
	const propertySetters = {
		setupProperties(instance, prototype, options) {
			for (const key in defaultProperties[prototype]) {
				if (defaultProperties[prototype].hasOwnProperty(key)) {
					const option = defaultProperties[prototype][key];
					const multipleValues = Array.isArray(option.value);
					if (Object.keys(options).includes(key)) {
						if (multipleValues) {
							propertySetters[option.setter](instance, key, option.type, ...(Array.isArray(options[key]) ? options[key] : [options[key]]));
						} else {
							propertySetters[option.setter](instance, key, option.type, options[key]);
						}
					} else {
						if (multipleValues) {
							propertySetters[option.setter](instance, key, option.type, ...option.value);
						} else {
							propertySetters[option.setter](instance, key, option.type, option.value);
						}
					}
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
		},
		setSingleProperty(instance, property, expectedType, value) {
			if (typeof value === expectedType) {
				instance[property] = value;
			} else {
				throw `Error setting property ${property}: Unexpected value ${JSON.stringify(value)}.`;
			}
		},
		setArrayProperty(instance, expectedType, length, value) {

		},
		setChoiceProperty(instance, expectedType, choices, value) {

		}
	};

	const defaultProperties = {
		ResponsiveCanvas: {
			origin: {value: [0, 0], type: "number", setter: "setAxesProperty"}
		},
		ResponsivePlot2D: {
			majorTicks: {value: [true, true], type: "boolean", setter: "setAxesProperty"},
			minorTicks: {value: [true, true], type: "boolean", setter: "setAxesProperty"},
			majorTickSize: {value: [5, 5], type: "number", setter: "setAxesProperty"},
			minorTickSize: {value: [1, 1], type: "number", setter: "setAxesProperty"},
			majorGridlines: {value: [true, true], type: "boolean", setter: "setAxesProperty"},
			minorGridlines: {value: [false, false], type: "boolean", setter: "setAxesProperty"},
			majorGridSize: {value: [5, 5], type: "number", setter: "setAxesProperty"},
			minorGridSize: {value: [1, 1], type: "number", setter: "setAxesProperty"},
			gridScale: {value: [10, 10], type: "number", setter: "setAxesProperty"}
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
					this.id = `${this.constructor.name}-${Object.keys(activeCanvases).length + 1}`;
					container.id = this.id;
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
					this.updateCanvasDimensions();
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
		}

		updateCanvasDimensions() {
			this.backgroundCanvas.width = this.width;
			this.backgroundCanvas.height = this.height;
			this.background.translate(this.origin.x, this.origin.y);
			this.updateBackground();
			this.foregroundCanvas.width = this.width;
			this.foregroundCanvas.height = this.height;
			this.foreground.translate(this.origin.x, this.origin.y);
			this.updateForeground();
		}

		setBackground(drawingFunction) {
			this.backgroundFunction = drawingFunction;
			this.updateBackground();
		}

		setForeground(drawingFunction) {
			this.foregroundFunction = drawingFunction;
			this.updateForeground();
		}

		updateBackground() {
			this.background.clearRect(-this.origin.x, -this.origin.y, this.width, this.height);
			if (this.backgroundFunction) {
				this.backgroundFunction(this.background);
			}
		}

		updateForeground() {
			this.foreground.clearRect(-this.origin.x, -this.origin.y, this.width, this.height);
			if (this.foregroundFunction) {
				this.foregroundFunction(this.foreground);
			}
		}

		setOrigin(...point) {
			if (point.length === 1 && (point[0] === "centre" || point[0] === "center")) {
				propertySetters.setAxesProperty(this,"origin", "number", Math.round(this.width / 2), Math.round(this.height / 2));
			} else {
				propertySetters.setAxesProperty(this,"origin", "number", ...point);
			}
			this.updateBackground();
			this.updateForeground();
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
			this.updateLimits();
			this.setBackground(context => {
				// TODO: implement ticks
				const drawGridSet = (which, width) => {
					context.lineWidth = width;
					const offset = width % 2 === 0 ? 0 : 0.5;
					context.beginPath();
					if (this[`${which}Gridlines`].x) {
						let currentX = 0;
						while (currentX > -this.origin.x) {
							context.moveTo(currentX + offset, -this.origin.y);
							context.lineTo(currentX + offset, this.height - this.origin.y);
							currentX -= Math.round(this.gridScale.x * this[`${which}GridSize`].x);
						}
						currentX = this.gridScale.x * this[`${which}GridSize`].x;
						while (currentX < this.width - this.origin.x) {
							context.moveTo(currentX + offset, -this.origin.y);
							context.lineTo(currentX + offset, this.height - this.origin.y);
							currentX += Math.round(this.gridScale.x * this[`${which}GridSize`].x);
						}
					}
					if (this[`${which}Gridlines`].y) {
						let currentY = 0;
						while (currentY > -this.origin.y) {
							context.moveTo(-this.origin.x, currentY + offset);
							context.lineTo(this.width - this.origin.x, currentY + offset);
							currentY -= Math.round(this.gridScale.y * this[`${which}GridSize`].y);
						}
						currentY = this.gridScale.y * this[`${which}GridSize`].y;
						while (currentY < this.height - this.origin.y) {
							context.moveTo(-this.origin.x, currentY + offset);
							context.lineTo(this.width - this.origin.x, currentY + offset);
							currentY += Math.round(this.gridScale.y * this[`${which}GridSize`].y);
						}
					}
					context.stroke();
				};
				context.lineCap = "square";
				context.strokeStyle = "rgb(0, 0, 0)";
				drawGridSet("minor", 1);
				drawGridSet("major", 2);
				context.lineWidth = 3;
				context.beginPath();
				context.moveTo(0.5, -this.origin.y);
				context.lineTo(0.5, this.height - this.origin.y);
				context.moveTo(-this.origin.x, 0.5);
				context.lineTo(this.width - this.origin.x, 0.5);
				context.stroke();
			});
			this.legend = {};
		}

		setOrigin(...point) {
			super.setOrigin(...point);
			this.updateLimits();
		}

		updateLimits() {
			this.xLims = [-this.origin.x / this.gridScale.x, (this.width - this.origin.x) / this.gridScale.x];
			this.yLims = [-this.origin.y / this.gridScale.y, (this.height - this.origin.y) / this.gridScale.y];
		}

		updatePlottingData() {
			this.setForeground(context => {
				for (const datasetID in this.legend) {
					if (this.legend.hasOwnProperty(datasetID)) {
						const dataset = this.legend[datasetID];
						const dataGenerator = dataset.data(...this.xLims, ...this.yLims, 1 / (10 * this.gridScale.x));
						// TODO: set stroke, markers
						context.strokeStyle = "red";
						context.lineWidth = 3;
						context.beginPath();
						let lastPoint;
						for (const currentPoint of dataGenerator) {
							if (!Number.isSafeInteger(Math.round(currentPoint[1]))) {
								currentPoint[1] = currentPoint[1] > 0 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
							}
							if (lastPoint && Math.abs(lastPoint[1] - currentPoint[1]) < this.height / this.gridScale.y) {
								// TODO: this deals with large discontinuities but not small ones so this will have to be changed in the future
								context.lineTo(currentPoint[0] * this.gridScale.x, -currentPoint[1] * this.gridScale.y);
							} else {
								context.moveTo(currentPoint[0] * this.gridScale.x, -currentPoint[1] * this.gridScale.y);
							}
							// TODO: draw marker
							lastPoint = currentPoint;
						}
						context.stroke();
					}
				}
			});
		}

		addData(data, id) {
			if (typeof id !== "undefined") {
				if (Array.isArray(data) && data.length === 2 && Array.isArray(data[0]) && Array.isArray(data[1])) {
					console.log(data);
					// check if lengths are the same
					// check if all entries are numbers
					// use generator function!
					// add to legend
				} else if (typeof data === "function") {
					if (typeof data(0) !== "number") {
						throw "Error setting plot data: Plot function does not return numbers.";
					}
					const generator = function*(xMin, xMax, yMin, yMax, step) {
						let x = xMin;
						let y = x => data(x);
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
					};
					this.legend[id] = {
						data: generator,
						markerStyle: "none"
					};
				} else {
					throw `Error setting plot data: Unrecognised data signature ${JSON.stringify(data)}.`;
				}
				this.updatePlottingData();
			} else {
				throw `Error setting plot data: No ID string provided.`;
			}
		}

		removeData(id) {
			delete this.legend[id];
			this.updatePlottingData();
		}

		setMajorTicks(...values) {
			propertySetters.setAxesProperty(this,"majorTicks", "boolean", ...values);
			this.updateBackground();
		}

		setMinorTicks(...values) {
			propertySetters.setAxesProperty(this,"minorTicks", "boolean", ...values);
			this.updateBackground();
		}

		setMajorTickSize(...values) {
			propertySetters.setAxesProperty(this,"majorTickSize", "number", ...values);
			this.updateBackground();
		}

		setMinorTickSize(...values) {
			propertySetters.setAxesProperty(this,"minorTickSize", "number", ...values);
			this.updateBackground();
		}

		setMajorGridlines(...values) {
			propertySetters.setAxesProperty(this,"majorGridlines", "boolean", ...values);
			this.updateBackground();
		}

		setMinorGridlines(...values) {
			propertySetters.setAxesProperty(this,"minorGridlines", "boolean", ...values);
			this.updateBackground();
		}

		setMajorGridSize(...values) {
			propertySetters.setAxesProperty(this,"majorGridSize", "number", ...values);
			this.updateBackground();
		}

		setMinorGridSize(...values) {
			propertySetters.setAxesProperty(this,"minorGridSize", "number", ...values);
			this.updateBackground();
		}

		setGridScale(...values) {
			propertySetters.setAxesProperty(this,"gridScale", "number", ...values);
			this.updateBackground();
			this.updateForeground();
		}

		setTraceColour(value) {
			// TODO: implement
		}

		setTraceStyle(value) {
			// none, dash, line
			// TODO: implement
		}

		setTraceWidth(value) {
			// TODO: implement
		}

		setMarkerStyle(value) {
			// TODO: implement
		}

		setMarkerSize(value) {
			// TODO: implement
		}

		setMarkerColour(value) {
			// TODO: implement
		}

		setXLims(range) {
			// TODO: implement
		}

		setYLims(range) {
			// TODO: implement
		}
	}

	return {
		activeCanvases: activeCanvases,
		ResponsiveCanvas: ResponsiveCanvas,
		ResponsivePlot2D: ResponsivePlot2D
	};
})();
