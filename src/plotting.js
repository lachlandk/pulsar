function getActivePlots() {
	const activePlots = {};
	for (const canvasID in core.activeCanvases) {
		if (core.activeCanvases[canvasID] instanceof core.ResponsivePlot2D) {
			activePlots[canvasID] = core.activeCanvases[canvasID];
		}
	}
	return activePlots;
}

function plot(id, data, options={}) {
	let plotObject;
	if (core.activeCanvases.hasOwnProperty(id)) {
		plotObject = core.activeCanvases[id];
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
		plotObject = new core.ResponsivePlot2D(id, options);
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
		for (const id in plotObject.plotData) {
			if (plotObject.plotData.hasOwnProperty(id)) {
				plotObject.removeData(id);
			}
		}
	}
	if (data !== null) {
		plotObject.addData(data.id, data.data, data.options);
	}
	return plotObject;
}
