/***
 * @typedef {Object} core
 * @property {Object} activeCanvases
 */
/**
 * @function Pulsar.plot
 * @param {string} id - The ID of the plot object. Must be unique.
 * @param {Object|null} data - The data to be plotted. The structure of the object follows the exact same pattern as the signature of
 * [Pulsar.core.ResponsivePlot2D.addData()]{@link Pulsar.core.ResponsivePlot2D#addData}. If `null` is passed, no data will be plotted.
 * @param {string} data.id - The ID for the trace. This ID will be the key for the relevant entry in the [plotData]{@link Pulsar.core.ResponsivePlot2D#plotData}
 * property of the plot object.
 * @param {Array | Function} data.data - The data to be plotted. See the [addData()]{@link Pulsar.core.ResponsivePlot2D#addData}
 * method documentation for more details.
 * @param {Object} data.object - The options for the data. See the [addData()]{@link Pulsar.core.ResponsivePlot2D#addData} method documentation for more details.
 * @param {Object} options - Options for the plot.
 * @returns {Pulsar.core.ResponsivePlot2D}
 * @description
 * Creates a plot with the specified ID, if one doesn't exist already, and plots the data with the options specified,
 * returning the {@link Pulsar.core.ResponsivePlot2D} object representing the plot. If a plot with the specified ID already exists,
 * then the data is added to the existing plot, the options passed are overridden and the existing plot object is returned.
 *
 * #### Options
 * The possible options are those from the {@link Pulsar.core.ResponsivePlot2D} and {@link Pulsar.core.ResponsiveCanvas} classes,
 * with the addition of `xLims` and `yLims` - which if specified will override the `gridScale` option - and also a `backgroundCSS` option for
 * specifying the background of the canvas. Here is the full list of options.
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
 * | `reset` | boolean | `false` | Removes all data from the plot before adding the new data specified. |
 *
 * #### Creating a simple plot of a parabola.
 * ```
 * // first, create a <div> element and add it to the body:
 * const container = document.createElement("div");
 * container.id = "myPlot";
 * container.style.width = "500px";
 * container.style.height = "500px";
 * document.body.appendChild(container);
 *
 * // now, we can create the plot:
 * Pulsar.plot("myPlot", {
 *     id: "parabola",
 *     data: x => x**2
 * }, {
 *     origin: "centre",
 *     minorTicks: true,
 *     yLims: [-2, 4]
 * });
 * ```
 */
function plot(id, data, options={}) {
	let plotObject;
	if (core.activeCanvases[id] !== undefined) {
		plotObject = core.activeCanvases[id];
		for (const option in options) {
			if (options.hasOwnProperty(option) && option !== "gridScale") {
				const optionSetter = plotObject[`set${option.charAt(0).toUpperCase() + option.slice(1)}`];
				if (optionSetter !== undefined) {
					if (optionSetter.length === 0) {
						optionSetter.call(plotObject, ...(Array.isArray(options[option]) ? options[option] : [options[option]]));
					} else {
						optionSetter.call(plotObject, options[option]);
					}
				}
			}
		}
	} else {
		plotObject = new core.ResponsivePlot2D(id, options);
		if (options.hasOwnProperty("backgroundCSS")) {
			plotObject.setBackgroundCSS(options.backgroundCSS);
		}
		if (options.hasOwnProperty("xLims")) {
			plotObject.setXLims(...options.xLims);
		}
		if (options.hasOwnProperty("yLims")) {
			plotObject.setYLims(...options.yLims);
		}
	}
	if (options.hasOwnProperty("reset") && options.reset === true) {
		for (const id of Object.keys(plotObject.plotData)) {
			plotObject.removeData(id);
		}
	}
	if (data !== null) {
		plotObject.addData(data.id, data.data, data.options);
	}
	return plotObject;
}

/**
 * Returns an object containing the active instances of {@link Pulsar.core.ResponsivePlot2D}.
 * @function Pulsar.getActivePlots
 * @returns {Object}
 * #### Example Usage
 * ```
 * plot = Pulsar.plot("myPlot", null);
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
