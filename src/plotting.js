function getActivePlots() {
	const activePlots = {};
	for (const canvasID in core.activeCanvases) {
		if (core.activeCanvases[canvasID] instanceof core.ResponsivePlot2D) {
			activePlots[canvasID] = core.activeCanvases[canvasID];
		}
	}
	return activePlots;
}

function plot(container, dataObject, options={}) {
	let plotObject;
	const plotID = typeof container === "string" ? container : document.getElementById(container);
	if (core.activeCanvases.hasOwnProperty(plotID)) {
		plotObject = core.activeCanvases[plotID];
		for (const option in options) {
			if (options.hasOwnProperty(option)) {
				const optionSetter = plotObject[`set${option.charAt(0).toUpperCase() + option.slice(1)}`];
				if (optionSetter.length === 0) {
					optionSetter.call(plotObject, ...(Array.isArray(options[option]) ? options[option] : [options[option]]));
				} else {
					optionSetter.call(plotObject, options[option]);
				}
			}
		}
	} else {
		plotObject = new core.ResponsivePlot2D(container, options);
		if (options.hasOwnProperty("backgroundCSS")) {
			plotObject.setBackgroundCSS(options.backgroundCSS);
		}
		if (options.hasOwnProperty("xLims")) {
			plotObject.setXLims(options.xLims);
		}
		if (options.hasOwnProperty("yLims")) {
			plotObject.setYLims(options.yLims);
		}
	}
	if (options.hasOwnProperty("reset") && options.reset === true) {
		for (const id in plotObject.legend) {
			if (plotObject.legend.hasOwnProperty(id)) {
				plotObject.removeData(id);
			}
		}
	}
	if (dataObject !== null) {
		plotObject.addData(dataObject.id, dataObject.data, dataObject.options);
	}
	return plotObject;
}
