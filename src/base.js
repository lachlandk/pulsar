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

		this.backgroundCanvas = document.createElement("canvas");
		this.foregroundCanvas = document.createElement("canvas");
		this.background = this.backgroundCanvas.getContext("2d");
		this.foreground = this.foregroundCanvas.getContext("2d");
		this.width = this.container.clientWidth;
		this.height = this.container.clientHeight;
		this.observer = new ResizeObserver(entries => {
			for (const entry of entries) {
				this.width = entry.contentBoxSize.inlineSize;
				this.height = entry.contentBoxSize.blockSize;
				this.updateCanvas();
			}
		});
		this.observer.observe(this.container);
		this.backgroundCanvas.style.position = "absolute";
		this.backgroundCanvas.style.left = 0;
		this.backgroundCanvas.style.top = 0;
		this.foregroundCanvas.style.position = "absolute";
		this.foregroundCanvas.style.left = 0;
		this.foregroundCanvas.style.top = 0;
		this.container.appendChild(this.backgroundCanvas);
		this.container.appendChild(this.foregroundCanvas);
		this.background.scale(window.devicePixelRatio, window.devicePixelRatio);
		this.foreground.scale(window.devicePixelRatio, window.devicePixelRatio);

		this.origin = [0, 0];
		this.setOrigin = function(...point) {
			if (Array.isArray(point) && point.length === 2) {
				this.origin = point;
				this.background.translate(...this.origin);
				this.foreground.translate(...this.origin);
			} else if (typeof point[0] === "string" && (point[0] === "centre" || point[0] === "center")) {
				this.origin = [this.width / 2, this.height / 2];
				this.background.translate(...this.origin);
				this.foreground.translate(...this.origin);
			} else {
				throw `Error in setOrigin method: Unsupported signature "${point}".`;
			}
		};

		this.updateCanvas = function() {
			this.backgroundCanvas.width = this.width * window.devicePixelRatio;
			this.backgroundCanvas.height = this.height * window.devicePixelRatio;
			this.background.clearRect(0, 0, this.width, this.height);
			this.background.translate(...this.origin);
			this.foregroundCanvas.width = this.width * window.devicePixelRatio;
			this.foregroundCanvas.height = this.height * window.devicePixelRatio;
			this.foreground.clearRect(0, 0, this.width, this.height);
			this.foreground.translate(...this.origin);
			if (this.backgroundFunction) {
				this.backgroundFunction(this.background);
			}
			if (this.foregroundFunction) {
				this.foregroundFunction(this.foreground);
			}
		};

		this.setBackground = function(drawingFunction) {
			this.backgroundFunction = drawingFunction;
		}

		this.setForeground = function(drawingFunction) {
			this.foregroundFunction = drawingFunction;
		}
	};

	return {
		ResponsiveCanvas: ResponsiveCanvas
	};
})();
