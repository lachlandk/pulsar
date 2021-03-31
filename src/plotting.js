const plot = function(container, [...data], options={}) {
	const plotObject = new core.ResponsivePlot2D(container, options);
	return plotObject;
}
