const core = (function() {
	const propertySetters = {
		setAxesProperty(property, expectedType, ...values) {
			if (values.length === 1 && typeof values[0] === expectedType) {
				return {
					x: values[0],
					y: values[0]
				};
			} else if (values.length === 2 && typeof values[0] === expectedType && typeof values[1] === expectedType) {
				return {
					x: values[0],
					y: values[1]
				};
			} else {
				throw `Error setting axes ${property}: Unexpected value ${JSON.stringify(values)}.`;
			}
		},
		setSingleProperty(property, expectedType, value) {
			if (typeof value === expectedType) {
				return value;
			} else {
				throw `Error setting ${property}: Unexpected value ${JSON.stringify(value)}.`;
			}
		},
		setArrayProperty(expectedType, length, value) {

		},
		setChoiceProperty(expectedType, choices, value) {

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

	class ResponsiveCanvas {
		constructor(container) {
			if (typeof container === "string") {
				const element = document.getElementById(container);
				if (element) {
					this.container = element;
				} else {
					throw `Error in ResponsiveCanvas constructor: Element with ID ${JSON.stringify(container)} could not be found.`;
				}
				this.container = document.getElementById(container);
			} else if (container instanceof Element) {
				this.container = container;
			} else {
				throw "Error in ResponsiveCanvas constructor: Container parameter could not be recognised as an Element or an ID string.";
			}
			this.container.style.position = "relative";
			this.backgroundCanvas = document.createElement("canvas");
			this.foregroundCanvas = document.createElement("canvas");
			this.background = this.backgroundCanvas.getContext("2d");
			this.foreground = this.foregroundCanvas.getContext("2d");
			this.width = this.container.clientWidth;
			this.height = this.container.clientHeight;
			this.observer = new ResizeObserver(entries => {
				for (const entry of entries) {
					this.width = entry.contentBoxSize.inlineSize;
					this.height = entry.contentBoxSize.blockSize;
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
			this.origin = { // TODO: add to options
				x: 0,
				y: 0
			};
		}

		updateCanvasDimensions() {
			this.backgroundCanvas.width = Math.round(this.width);
			this.backgroundCanvas.height = Math.round(this.height);
			this.background.translate(this.origin.x, this.origin.y);
			this.updateBackground();
			this.foregroundCanvas.width = Math.round(this.width);
			this.foregroundCanvas.height = Math.round(this.height);
			this.foreground.translate(this.origin.x, this.origin.y);
			this.updateForeground();
		}

		setBackground(drawingFunction) {
			this.backgroundFunction = drawingFunction;
		}

		setForeground(drawingFunction) {
			this.foregroundFunction = drawingFunction;
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
			this.background.translate(-this.origin.x, -this.origin.y);
			this.foreground.translate(-this.origin.x, -this.origin.y);
			if (point.length === 1 && (point[0] === "centre" || point[0] === "center")) {
				this.origin = propertySetters.setAxesProperty("origin", "number", Math.round(this.width / 2), Math.round(this.height / 2));
			} else {
				this.origin = propertySetters.setAxesProperty("origin", "number", ...point);
			}
			this.background.translate(this.origin.x, this.origin.y);
			this.updateBackground();
			this.foreground.translate(this.origin.x, this.origin.y);
			this.updateForeground();
		}
	}

	class ResponsivePlot2D extends ResponsiveCanvas {
		constructor(container, options={}) {
			super(container);

			this.backgroundCanvas.style.background = "green";
			for (const option in defaultProperties.ResponsivePlot2D) {
				if (defaultProperties.ResponsivePlot2D.hasOwnProperty(option)) {
					const key = defaultProperties.ResponsivePlot2D[option];
					const multipleValues = Array.isArray(key.value);
					if (Object.keys(options).includes(option)) {
						if (multipleValues) {
							this[option] = propertySetters[key.setter](option, key.type, ...(Array.isArray(options[option]) ? options[option] : [options[option]]));
						} else {
							this[option] = propertySetters[key.setter](option, key.type, options[option]);
						}
					} else {
						if (multipleValues) {
							this[option] = propertySetters[key.setter](option, key.type, ...key.value);
						} else {
							this[option] = propertySetters[key.setter](option, key.type, key.value);
						}
					}
				}
			}
			this.setBackground(function(context) {
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
			this.xLims = [0, this.width / this.gridScale.x];
			this.yLims = [0, this.height / this.gridScale.y];
		}

		setOrigin(...point) {
			super.setOrigin(...point);
			this.xLims = [-this.origin.x / this.gridScale.x, (this.width - this.origin.x) / this.gridScale.x];
			this.yLims = [-this.origin.y / this.gridScale.y, (this.height - this.origin.y) / this.gridScale.y];
		}

		setMajorTicks(...values) {
			this.majorTicks = propertySetters.setAxesProperty("majorTicks", "boolean", ...values);
			this.updateBackground();
		}

		setMinorTicks(...values) {
			this.minorTicks = propertySetters.setAxesProperty("minorTicks", "boolean", ...values);
			this.updateBackground();
		}

		setMajorTickSize(...values) {
			this.majorTickSize = propertySetters.setAxesProperty("majorTickSize", "number", ...values);
			this.updateBackground();
		}

		setMinorTickSize(...values) {
			this.minorTickSize = propertySetters.setAxesProperty("minorTickSize", "number", ...values);
			this.updateBackground();
		}

		setMajorGridlines(...values) {
			this.majorGridlines = propertySetters.setAxesProperty("majorGridlines", "boolean", ...values);
			this.updateBackground();
		}

		setMinorGridlines(...values) {
			this.minorGridlines = propertySetters.setAxesProperty("minorGridlines", "boolean", ...values);
			this.updateBackground();
		}

		setMajorGridSize(...values) {
			this.majorGridSize = propertySetters.setAxesProperty("majorGridSize", "number", ...values);
			this.updateBackground();
		}

		setMinorGridSize(...values) {
			this.minorGridSize = propertySetters.setAxesProperty("minorGridSize", "number", ...values);
			this.updateBackground();
		}

		setGridScale(value) {
			this.gridScale = propertySetters.setAxesProperty("gridScale", "number", ...value);
			this.updateBackground();this.updateForeground();
		}

		setTraceColour(value) {
			// TODO: implement
		}

		setTraceStyle(value) {
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
		ResponsiveCanvas: ResponsiveCanvas,
		ResponsivePlot2D: ResponsivePlot2D
	};
})();
