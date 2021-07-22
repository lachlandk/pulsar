import { optionsObjects } from "./defaults.js";
import { setupProperties, propertySetters } from "../helpers/index.js";
import { activeCanvases } from "./activeCanvases.js";
export class ResponsiveCanvas {
    constructor(id, options = {}) {
        this.id = "";
        this.properties = Object.assign({}, optionsObjects.ResponsiveCanvas);
        this.constants = {};
        this._timeEvolutionData = {
            currentTimeValue: 0,
            startTimestampMS: 0,
            offsetTimestampMS: 0,
            timeEvolutionActive: false
        };
        this._displayData = {
            width: 0,
            height: 0,
            originArgCache: [0],
            containerElement: null,
            resizeObserver: new ResizeObserver(entries => {
                for (const entry of entries) {
                    this._displayData.width = entry.target.clientWidth;
                    this._displayData.height = entry.target.clientHeight;
                    this._updateCanvasDimensions();
                }
            }),
            backgroundCanvas: document.createElement("canvas"),
            foregroundCanvas: document.createElement("canvas"),
            background: null,
            foreground: null,
            backgroundFunction: (() => { }),
            foregroundFunction: (() => { })
        };
        // TODO: add child objects to options to allow more options
        this.setID(id);
        if (options.origin === "centre") {
            this.setOrigin("centre");
            delete options.origin;
        }
        setupProperties(this, "ResponsiveCanvas", options);
        this._displayData.backgroundCanvas.style.position = "absolute";
        this._displayData.backgroundCanvas.style.left = "0";
        this._displayData.backgroundCanvas.style.top = "0";
        this._displayData.backgroundCanvas.id = `${this.id}-background-canvas`;
        this._displayData.background = this._displayData.backgroundCanvas.getContext("2d");
        this._displayData.foregroundCanvas.style.position = "absolute";
        this._displayData.foregroundCanvas.style.left = "0";
        this._displayData.foregroundCanvas.style.top = "0";
        this._displayData.foregroundCanvas.id = `${this.id}-foreground-canvas`;
        this._displayData.foreground = this._displayData.foregroundCanvas.getContext("2d");
    }
    _updateCanvasDimensions() {
        if (this._displayData.containerElement !== null) {
            this._displayData.containerElement.style.width = `${this._displayData.width}px`;
            this._displayData.containerElement.style.height = `${this._displayData.height}px`;
            this._displayData.backgroundCanvas.width = this._displayData.width;
            this._displayData.backgroundCanvas.height = this._displayData.height;
            this._displayData.background.translate(this.properties.origin.x, this.properties.origin.y);
            this._updateBackground();
            this._displayData.foregroundCanvas.width = this._displayData.width;
            this._displayData.foregroundCanvas.height = this._displayData.height;
            this._displayData.foreground.translate(this.properties.origin.x, this.properties.origin.y);
            this._updateForeground();
        }
    }
    _updateBackground() {
        if (this._displayData.background !== null) {
            this._displayData.background.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayData.width, this._displayData.height);
            this._displayData.backgroundFunction(this._displayData.background, this._timeEvolutionData.currentTimeValue);
        }
    }
    _updateForeground() {
        if (this._displayData.foreground !== null) {
            this._displayData.foreground.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayData.width, this._displayData.height);
            this._displayData.foregroundFunction(this._displayData.foreground, this._timeEvolutionData.currentTimeValue);
        }
    }
    setBackground(drawingFunction) {
        this._displayData.backgroundFunction = drawingFunction;
        this._updateBackground();
    }
    setForeground(drawingFunction) {
        this._displayData.foregroundFunction = drawingFunction;
        this._updateForeground();
    }
    setOrigin(...point) {
        if (point.length === 1 && point[0] === "centre") {
            propertySetters.setAxesProperty(this, "origin", "number", Math.round(this._displayData.width / 2), Math.round(this._displayData.height / 2));
        }
        else {
            propertySetters.setAxesProperty(this, "origin", "number", ...point);
        }
        this._displayData.originArgCache = point;
        this._updateCanvasDimensions();
    }
    setID(id) {
        if (activeCanvases[id] === undefined) {
            delete activeCanvases[this.id];
            this.id = id;
            activeCanvases[this.id] = this;
        }
        else {
            throw `Error creating ResponsiveCanvas object: Object with ID "${id}" already exists.`;
        }
    }
    setBackgroundCSS(cssString) {
        propertySetters.setSingleProperty(this, "backgroundCSS", "string", cssString);
        this._displayData.backgroundCanvas.style.background = cssString;
    }
    startTime() {
        this._timeEvolutionData.timeEvolutionActive = true;
        this._timeEvolutionData.startTimestampMS = performance.now();
        window.requestAnimationFrame(timestamp => this._updateTime(timestamp));
    }
    pauseTime() {
        this._timeEvolutionData.timeEvolutionActive = false;
        this._timeEvolutionData.offsetTimestampMS = performance.now() - this._timeEvolutionData.startTimestampMS;
    }
    stopTime() {
        this._timeEvolutionData.timeEvolutionActive = false;
        this._timeEvolutionData.startTimestampMS = 0;
        this._timeEvolutionData.offsetTimestampMS = 0;
        this._timeEvolutionData.currentTimeValue = 0;
        this._updateBackground();
        this._updateForeground();
    }
    _updateTime(currentTimestamp) {
        if (this._timeEvolutionData.timeEvolutionActive) {
            const currentTime = this._timeEvolutionData.offsetTimestampMS + currentTimestamp - this._timeEvolutionData.startTimestampMS;
            this._timeEvolutionData.currentTimeValue = currentTime < 0 ? 0 : currentTime / 1000;
            this._updateBackground();
            this._updateForeground();
            window.requestAnimationFrame(timestamp => this._updateTime(timestamp));
        }
    }
    setConstant(name, value) {
        this.constants[name] = value;
    }
    connectElementAttribute(element, event, attribute, constant, transform = (x) => x) {
        if (element instanceof Element) {
            element.addEventListener(event, () => {
                this.setConstant(constant, transform(element[attribute]));
                this._updateForeground();
            });
            this.setConstant(constant, transform(element[attribute]));
        }
        else {
            const target = document.querySelector(element);
            if (target instanceof Element) {
                target.addEventListener(event, () => {
                    this.setConstant(constant, transform(target[attribute]));
                    this._updateForeground();
                });
                this.setConstant(constant, transform(target[attribute]));
            }
            else {
                throw `Element with ID "${element}" could not be found.`;
            }
        }
    }
    show(element) {
        if (element instanceof HTMLElement) {
            this._displayData.containerElement = element;
        }
        else {
            this._displayData.containerElement = document.querySelector(element);
        }
        if (this._displayData.containerElement !== null) {
            this._displayData.containerElement.style.position = "relative";
            this._displayData.containerElement.appendChild(this._displayData.backgroundCanvas);
            this._displayData.containerElement.appendChild(this._displayData.foregroundCanvas);
            this._displayData.width = this._displayData.containerElement.clientWidth;
            this._displayData.height = this._displayData.containerElement.clientHeight;
            this._displayData.resizeObserver.observe(this._displayData.containerElement);
            this.setOrigin(...this._displayData.originArgCache);
            this.setBackgroundCSS(this.properties.backgroundCSS);
        }
        else {
            throw `HTMLElement with querySelector "${element}" could not be found.`;
        }
    }
}
