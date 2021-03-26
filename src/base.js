const base = (function() {
	const ResponsiveCanvas = function(container) {
		if (typeof container === "string") {
			const element = document.getElementById(container);
			if (element) {
				this.container = element;
			} else {
				throw `Error in ResponsiveCanvas constructor: Element with ID "${container}" could not be found.`;
			}
			this.container = document.getElementById(container);
		} else if (container instanceof Element) {
			this.container = container;
		} else{
			throw "Error in ResponsiveCanvas constructor: Container parameter could not be recognised as an Element or an ID string.";
		}
		this.container.style.position = "relative";


		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.observer = new ResizeObserver(entries => {
			for (const entry of entries) {
				this.width = entry.contentBoxSize.inlineSize;
				this.height = entry.contentBoxSize.blockSize;
				this.canvas.width = this.width * window.devicePixelRatio;
				this.canvas.height = this.height * window.devicePixelRatio;
			}
		});
		this.observer.observe(this.container);
		this.canvas.style.position = "absolute";
		this.canvas.style.left = 0;
		this.canvas.style.top = 0;
		this.container.appendChild(this.canvas);
		this.context.scale(window.devicePixelRatio, window.devicePixelRatio);

		this.canvas.style.background = "red";  // for testing purposes
	};

	return {
		ResponsiveCanvas: ResponsiveCanvas
	}
})();
