core.ResponsiveCanvas.prototype.show = function (element) {
	this.containerElement = document.querySelector(element);
	this.canvasContainer = document.createElement("div");
	this.canvasContainer.id = this.id;
	this.canvasContainer.style.position = "relative";
	this.backgroundCanvas = document.createElement("canvas");
	this.foregroundCanvas = document.createElement("canvas");
	this.backgroundCanvas.style.position = "absolute";
	this.backgroundCanvas.style.left = "0";
	this.backgroundCanvas.style.top = "0";
	this.backgroundCanvas.id = `${this.id}-background-canvas`;
	this.foregroundCanvas.style.position = "absolute";
	this.foregroundCanvas.style.left = "0";
	this.foregroundCanvas.style.top = "0";
	this.foregroundCanvas.id = `${this.id}-foreground-canvas`;
	this.canvasContainer.appendChild(this.backgroundCanvas);
	this.canvasContainer.appendChild(this.foregroundCanvas);
	this.containerElement.appendChild(this.canvasContainer);
	this.background = this.backgroundCanvas.getContext("2d");
	this.foreground = this.foregroundCanvas.getContext("2d");
	this.width = this.containerElement.clientWidth;
	this.height = this.containerElement.clientHeight;
	this._observer = new ResizeObserver(entries => {
		for (const entry of entries) {
			this.width = entry.target.clientWidth;
			this.height = entry.target.clientHeight;
			this._updateCanvasDimensions();
		}
	});
	this._observer.observe(this.containerElement);
	for (const property of Object.keys(this.displayProperties)) {
		this[`set${property[0].toUpperCase()}${property.slice(1)}`](this.displayProperties[property]);
	}
};
