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
	} else {
		plotObject = new core.ResponsivePlot2D(container);
	}
	const optionList = [
		"origin",
		"backgroundCSS",
		"xLims",
		"yLims",
		"majorTicks",
		"minorTicks",
		"majorGridlines",
		"minorGridlines",
		"majorTickSize",
		"minorTickSize",
		"majorGridSize",
		"minorGridSize"
	];
	for (const option of optionList) {
		if (options.hasOwnProperty(option)) {
			const optionSetter = plotObject[`set${option.charAt(0).toUpperCase() + option.slice(1)}`];
			if (optionSetter.length === 0) {
				optionSetter.call(plotObject, ...(Array.isArray(options[option]) ? options[option] : [options[option]]));
			} else {
				optionSetter.call(plotObject, options[option]);
			}
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
