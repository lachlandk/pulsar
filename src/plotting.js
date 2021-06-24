/***
 * @typedef {Object} core
 * @property {Object} activeCanvases
 */
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
// TODO: add an image to this
class Plot extends core.ResponsivePlot2D {
	/**
	 * @param {string} id - The ID of the plot object. Must be unique.
	 * @param {Object|null} data - The data to be plotted. The structure of the object follows the exact same pattern as the signature of
	 * [Pulsar.core.ResponsivePlot2D.addData()]{@link Pulsar.core.ResponsivePlot2D#addData}. If `null` is passed, no data will be plotted.
	 * @param {string} data.id - The ID for the trace. This ID will be the key for the relevant entry in the [plotData]{@link Pulsar.core.ResponsivePlot2D#plotData}
	 * property of the plot object.
	 * @param {Array | Function} data.data - The data to be plotted. See the [addData()]{@link Pulsar.core.ResponsivePlot2D#addData}
	 * method documentation for more details.
	 * @param {Object} data.object - The options for the data. See the [addData()]{@link Pulsar.core.ResponsivePlot2D#addData} method documentation for more details.
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
			this.addData(data.id, data.data, data.options);
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
