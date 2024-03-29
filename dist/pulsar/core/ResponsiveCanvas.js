import { propertySetters } from "../helpers/index.js";
import { activeCanvases } from "./activeCanvases.js";
import { Defaults } from "../Defaults.js";
import { Time } from "./TimeEvolutionController.js";
/**
 * Class representing the base canvas object which all other Pulsar canvas objects inherit from.
 * This class is not meant to be instantiated directly by a user, mainly because it is not very useful by itself.
 * However, it does provide a lot of useful functionality which is used by subclasses.
 * A `ResponsiveCanvas` instance has two drawing surfaces, a background and a foreground.
 * These drawing surfaces can be added to the HTML page as canvas elements by calling `show`.
 * These canvases will then fill the container element, and even change their size when the container element is resized.
 * The coordinate origin of a ResponsiveCanvas can be changed with `setOrigin`, and it can be drawn on and animated
 * by passing a drawing function to `setBackground` or `setForeground`. Read-only properties and methods beginning with
 * an underscore should not be changed/called, otherwise they may cause unpredictable behaviour.
 */
export class ResponsiveCanvas {
    /**
     * @param id The ID of the canvas object.
     * @param options  Optional parameters.
     */
    constructor(id, options = {}) {
        /**
         * The unique ID for the canvas object.
         */
        this.id = "";
        /**
         *
         */
        this.properties = Defaults.create("ResponsiveCanvas");
        this.currentTimeValue = 0;
        // TODO: add child objects to options to allow more options
        const canvasContainer = document.createElement("div");
        canvasContainer.style.display = "grid";
        canvasContainer.style.width = "100%";
        canvasContainer.style.height = "100%";
        const backgroundCanvas = document.createElement("canvas");
        backgroundCanvas.style.gridArea = "1 / 1";
        const foregroundCanvas = document.createElement("canvas");
        foregroundCanvas.style.gridArea = "1 / 1";
        canvasContainer.appendChild(backgroundCanvas);
        canvasContainer.appendChild(foregroundCanvas);
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                this.resizeEventListener(entry);
                this.updateBackground();
                this.updateForeground();
            }
        });
        resizeObserver.observe(canvasContainer);
        this._displayData = {
            width: 0,
            height: 0,
            originArgCache: null,
            parentElement: null,
            resizeObserver: resizeObserver,
            canvasContainer: canvasContainer,
            backgroundCanvas: backgroundCanvas,
            foregroundCanvas: foregroundCanvas,
            background: backgroundCanvas.getContext("2d"),
            foreground: foregroundCanvas.getContext("2d"),
            backgroundFunction: () => { },
            foregroundFunction: () => { }
        };
        Time.addObject(id);
        this.setID(id);
        Defaults.mergeOptions(this, "ResponsiveCanvas", options);
    }
    resizeEventListener(entry) {
        this._displayData.width = entry.target.clientWidth;
        this._displayData.height = entry.target.clientHeight;
        this._displayData.backgroundCanvas.width = this._displayData.width;
        this._displayData.backgroundCanvas.height = this._displayData.height;
        this._displayData.foregroundCanvas.width = this._displayData.width;
        this._displayData.foregroundCanvas.height = this._displayData.height;
        if (this._displayData.originArgCache !== null) {
            this.setOrigin(this._displayData.originArgCache);
        }
        this._displayData.background.translate(this.properties.origin.x, this.properties.origin.y); // because changing the size of a canvas resets it
        this._displayData.foreground.translate(this.properties.origin.x, this.properties.origin.y);
    }
    /**
      * Updates the background.
      */
    updateBackground() {
        this._displayData.background.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayData.width, this._displayData.height);
        this._displayData.backgroundFunction(this._displayData.background);
    }
    /**
      * Updates the foreground.
      */
    updateForeground() {
        this._displayData.foreground.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayData.width, this._displayData.height);
        this._displayData.foregroundFunction(this._displayData.foreground, this.currentTimeValue);
    }
    /**
     * Sets the drawing function for the background canvas to `drawingFunction` and updates the canvas.
     * The argument `drawingFunction` should be a function which takes one or two arguments of its own, the first being the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D `CanvasRenderingContext2D`} for the background,
     * and the second (which is optional) being the current time evolution value for the canvas object (in seconds).
     * @param drawingFunction The function which draws the background.
     */
    setBackground(drawingFunction) {
        this._displayData.backgroundFunction = drawingFunction;
        this.updateBackground();
    }
    /**
     * Sets the drawing function for the foreground canvas to `drawingFunction` and updates the canvas.
     * The argument `drawingFunction` should be a function which takes one or two arguments of its own, the first being the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D `CanvasRenderingContext2D`} for the background,
     * and the second (which is optional) being the current time evolution value for the canvas object (in seconds).
     * The second argument need only specified if the drawing function contains animations which depend on the current
     * time value.
     * @param drawingFunction The function which draws the foreground.
     */
    setForeground(drawingFunction) {
        this._displayData.foregroundFunction = drawingFunction;
        this.updateForeground();
    }
    /**
     * Sets the origin of both canvases to the point2D specified (in pixels).
     * Two values may be passed for `x` then `y`, or one value may be passed to set the origins of both axes to the same value.
     * The string `"centre"` may also be passed to conveniently set the origin to the middle of the canvas.
     * Note that for the HTML5 canvas the origin is in the top-left corner by default and the x-axis points rightwards,
     * while the y-axis points downwards.
     * @param point
     */
    setOrigin(...point) {
        if (point.length === 1 && point[0] === "centre") {
            propertySetters.setAxesProperty(this, "origin", "number", Math.round(this._displayData.width / 2), Math.round(this._displayData.height / 2));
            this._displayData.originArgCache = point[0];
        }
        else {
            propertySetters.setAxesProperty(this, "origin", "number", ...point);
            this._displayData.originArgCache = null;
        }
        this._displayData.background.resetTransform();
        this._displayData.background.translate(this.properties.origin.x, this.properties.origin.y);
        this.updateBackground();
        this._displayData.foreground.resetTransform();
        this._displayData.foreground.translate(this.properties.origin.x, this.properties.origin.y);
        this.updateForeground();
    }
    /**
     * Sets the ID of the canvas object to the value specified,
     * which cannot be the same as another existing canvas object.
     * If the canvas object is active on an HTML page, all of its elements will have their `ID`s updated.
     * @param id New ID for the canvas object.
     */
    setID(id) {
        if (activeCanvases[id] === undefined) {
            delete activeCanvases[this.id];
            Time.canvasTimeData.find(object => object.id === id).id = id;
            this.id = id;
            activeCanvases[this.id] = this;
        }
        else {
            throw `Error creating ResponsiveCanvas object: Object with ID "${id}" already exists.`;
        }
    }
    /**
     * Sets the `background` CSS property of the background canvas to the string passed in.
     * This can be used to set the background for the canvas object to a plain colour, gradient pattern or image
     * (by default the background is transparent).
     * @param cssString A valid string for the CSS {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background `background`} property.
     */
    setBackgroundCSS(cssString) {
        propertySetters.setSingleProperty(this, "backgroundCSS", "string", cssString);
        this._displayData.backgroundCanvas.style.background = cssString;
    }
    // /**
    //  * Starts or resumes the time evolution of the foreground.
    //  */
    // startTime() {}
    // /**
    //  * Pauses the time evolution of the foreground.
    //  */
    // pauseTime() {}
    // /**
    //  * Stops the time evolution of the foreground and resets the current timestamp to 0.
    //  */
    // stopTime() {}
    /**
     * Display the canvas object in an HTML element.
     * @param element
     */
    show(element) {
        if (element instanceof Element) {
            this._displayData.parentElement = element;
        }
        else {
            this._displayData.parentElement = document.querySelector(element);
        }
        if (this._displayData.parentElement !== null) {
            this._displayData.parentElement.appendChild(this._displayData.canvasContainer);
            this._displayData.width = this._displayData.canvasContainer.clientWidth;
            this._displayData.height = this._displayData.canvasContainer.clientHeight;
            if (this._displayData.originArgCache !== null) {
                this.setOrigin(this._displayData.originArgCache);
            }
            this.setBackgroundCSS(this.properties.backgroundCSS); // TODO: shouldn't have to call this again
        }
        else {
            throw `HTMLElement with querySelector "${element}" could not be found.`;
        }
    }
    hide() {
        if (this._displayData.parentElement !== null) {
            this._displayData.parentElement.removeChild(this._displayData.canvasContainer);
            this._displayData.parentElement = null;
        }
    }
}
