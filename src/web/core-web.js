/**
 * @alias Pulsar.core.ResponsiveCanvas#show
 * @description Displays the canvas object on the HTML page inside the element specified by the query selector.
 * A block-level element such as a `<div>` is recommended for the canvas object to work correctly.
 * This is not available in Node.js environments.
 * @param {string} element {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector Query selector} for the element.
 */
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
	this.observer = new ResizeObserver(entries => {
		for (const entry of entries) {
			this.width = entry.target.clientWidth;
			this.height = entry.target.clientHeight;
			this._updateCanvasDimensions();
		}
	});
	this.observer.observe(this.containerElement);
	for (const property of Object.keys(this.displayProperties)) {
		this[`set${property[0].toUpperCase()}${property.slice(1)}`](this.displayProperties[property]);
	}
};

/**
 * @alias Pulsar.core.ResponsiveCanvas#connectElementAttribute
 * @description Sets up an event listener for `event` which when triggered will set the value of `constant` to the value
 * of `attribute` on the `element`. The element attribute value can be transformed using the optional `transform` argument, which takes
 * the form of a function with one argument (the input value) and one return (the transformed input value). One example usage
 * of this is coercing a boolean to an number by passing the `Number` constructor (`Number(true) === 1, Number(false) === 0`).
 *
 * #### Example Usage
 * ```
 * // Creating a slider on the HTML page and connecting its `value` attribute to a constant.
 * slider = document.createElement("input");
 * slider.type = "range";
 * document.body.appendChild(slider);
 *
 * // The following are functionally equivalent:
 * plot.connectElementAttribute(slider, "input", "value", "myConstant", Number);
 * // ----------
 * slider.oninput = function() {
 *     plot.setConstant("A", Number(this.value));
 * };
 * ```
 * @param {string|Element} element A {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector Query selector} or a reference to the element.
 * @param {string} event The event that will trigger the constant update.
 * @param {string} attribute The attribute of the element which will become the constant value.
 * @param {string} constant The name of the constant to be updated.
 * @param {function} transform Optional transform function for the value of the input element.
 */
core.ResponsiveCanvas.prototype.connectElementAttribute = function(element, event, attribute, constant, transform=(x)=>x) {
	if (element instanceof Element) {
		element.addEventListener(event, () => {
			this.setConstant(constant, transform(element[attribute]));
		});
		this.setConstant(constant, transform(element[attribute]));
	} else if (typeof element === "string") {
		const target = document.querySelector(element);
		if (target instanceof Element) {
			target.addEventListener(event, () => {
				this.setConstant(constant, transform(target[attribute]));
			});
			this.setConstant(constant, transform(target[attribute]));
		} else {
			throw `Element with ID "${element}" could not be found.`;
		}
	} else {
		throw `Element is not a valid element.`;
	}
};
