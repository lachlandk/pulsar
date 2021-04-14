function getActivePlots () {
	const activePlots = {};
	for (const canvasID in core.activeCanvases) {
		if (core.activeCanvases[canvasID] instanceof core.ResponsivePlot2D) {
			activePlots[canvasID] = core.activeCanvases[canvasID];
		}
	}
	return activePlots;
}

const plot = function(container, data, options={}) {
	const plotObject = new core.ResponsivePlot2D(container, options);
	return plotObject;
};
