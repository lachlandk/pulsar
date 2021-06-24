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
module.exports = (function () {
	const core = (function() {
		const propertySetters = {
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

		const activeCanvases = {};

		class ResponsiveCanvas {
			constructor(id, options={}) {
				this.id = "";
				this.timeEvolutionData = {
					currentTimeValue: 0,
					startTimestampMS: 0,
					offsetTimestampMS: 0,
					timeEvolutionActive: false
				};
				this.displayProperties = {
					origin: options.origin
				};
				this.setID(id);
				if (options.origin === "centre") {
					options.origin = [Math.round(this.width / 2), Math.round(this.height / 2)]; 
				}
				propertySetters.setupProperties(this, "ResponsiveCanvas", options);
			}

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

			_updateBackground() {
				if (this.background !== undefined) {
					this.background.clearRect(-this.origin.x, -this.origin.y, this.width, this.height);
					if (this.backgroundFunction) {
						this.backgroundFunction(this.background, this.timeEvolutionData.currentTimeValue);
					}
				}
			}

			_updateForeground() {
				if (this.foreground !== undefined) {
					this.foreground.clearRect(-this.origin.x, -this.origin.y, this.width, this.height);
					if (this.foregroundFunction) {
						this.foregroundFunction(this.foreground, this.timeEvolutionData.currentTimeValue);
					}
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

			setID(id) {
				if (activeCanvases[id] === undefined) {
					propertySetters.setSingleProperty(this, "id", "string", id);
					activeCanvases[this.id] = this;
				} else {
					throw `Error creating ResponsiveCanvas object: Object with ID "${typeof id === "string" ? id : JSON.stringify(id)}" already exists.`;
				}
			}

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

			startTime() {
				this.timeEvolutionData.timeEvolutionActive = true;
				this.timeEvolutionData.startTimestampMS = performance.now();
				window.requestAnimationFrame(timestamp => this._updateTime(timestamp));
			}

			pauseTime() {
				this.timeEvolutionData.timeEvolutionActive = false;
				this.timeEvolutionData.offsetTimestampMS = performance.now() - this.timeEvolutionData.startTimestampMS;
			}

			stopTime() {
				this.timeEvolutionData.timeEvolutionActive = false;
				this.timeEvolutionData.currentTimeValue = 0;
				this.timeEvolutionData.offsetTimestampMS = 0;
				this._updateForeground();
			}

			_updateTime(currentTimestamp) {
				if (this.timeEvolutionData.timeEvolutionActive) {
					this.timeEvolutionData.currentTimeValue = (this.timeEvolutionData.offsetTimestampMS + currentTimestamp - this.timeEvolutionData.startTimestampMS) / 1000;
					this._updateForeground();
					window.requestAnimationFrame(timestamp => this._updateTime(timestamp));
				}
			}
	 	}

		class ResponsivePlot2D extends ResponsiveCanvas {
			constructor(container, options={}) {
				super(container, options);
				propertySetters.setupProperties(this, "ResponsivePlot2D", options);
				this.xLims = [];
				this.yLims = [];
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

			_updateLimits() {
				this.xLims = [-this.origin.x / this.gridScale.x, (this.width - this.origin.x) / this.gridScale.x];
				this.yLims = [-this.origin.y / this.gridScale.y, (this.height - this.origin.y) / this.gridScale.y];
			}

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

			removeData(id) {
				delete this.plotData[id];
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

			setTraceColour(trace, colour) {
				propertySetters.setPlotDataProperty(this, trace, "traceColour", colour);
			}

			setTraceStyle(trace, style) {
				propertySetters.setPlotDataProperty(this, trace, "traceStyle", style);
			}

			setTraceWidth(trace, width) {
				propertySetters.setPlotDataProperty(this, trace, "traceWidth", width);
			}

			setMarkerColour(trace, colour) {
				propertySetters.setPlotDataProperty(this, trace, "markerColour", colour);
			}

			setMarkerStyle(trace, style) {
				propertySetters.setPlotDataProperty(this, trace, "markerStyle", style);
			}

			setMarkerSize(trace, size) {
				propertySetters.setPlotDataProperty(this, trace, "markerSize", size);
			}

			setVisibility(trace, value) {
				propertySetters.setPlotDataProperty(this, trace, "visibility", value);
			}

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

	class Plot extends core.ResponsivePlot2D {
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

	function getActivePlots() {
		const activePlots = {};
		for (const canvasID of Object.keys(core.activeCanvases)) {
			if (core.activeCanvases[canvasID] instanceof core.ResponsivePlot2D) {
				activePlots[canvasID] = core.activeCanvases[canvasID];
			}
		}
		return activePlots;
	}


			return {
		core: core,
		Plot: Plot,
		getActivePlots: getActivePlots
	};
})();