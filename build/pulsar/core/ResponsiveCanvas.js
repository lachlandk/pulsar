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
        this._displayProperties = {
            width: 0,
            height: 0,
            originArgCache: { x: 0, y: 0 },
            containerElement: null,
            resizeObserver: null,
            canvasContainer: null,
            backgroundCanvas: null,
            foregroundCanvas: null,
            background: null,
            foreground: null,
            backgroundFunction: null,
            foregroundFunction: null
        };
        // TODO: add child objects to options to allow more options
        this.setID(id);
        setupProperties(this, "ResponsiveCanvas", options);
    }
    _updateCanvasDimensions() {
        if (this._displayProperties.canvasContainer !== null) {
            this._displayProperties.canvasContainer.style.width = `${this._displayProperties.width}px`;
            this._displayProperties.canvasContainer.style.height = `${this._displayProperties.height}px`;
            this._displayProperties.backgroundCanvas.width = this._displayProperties.width;
            this._displayProperties.backgroundCanvas.height = this._displayProperties.height;
            this._displayProperties.background.translate(this.properties.origin.x, this.properties.origin.y);
            this._updateBackground();
            this._displayProperties.foregroundCanvas.width = this._displayProperties.width;
            this._displayProperties.foregroundCanvas.height = this._displayProperties.height;
            this._displayProperties.foreground.translate(this.properties.origin.x, this.properties.origin.y);
            this._updateForeground();
        }
    }
    _updateBackground() {
        if (this._displayProperties.background !== null) {
            this._displayProperties.background.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayProperties.width, this._displayProperties.height);
            if (this._displayProperties.backgroundFunction) {
                this._displayProperties.backgroundFunction(this._displayProperties.background, this._timeEvolutionData.currentTimeValue);
            }
        }
    }
    _updateForeground() {
        if (this._displayProperties.foreground !== null) {
            this._displayProperties.foreground.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayProperties.width, this._displayProperties.height);
            if (this._displayProperties.foregroundFunction) {
                this._displayProperties.foregroundFunction(this._displayProperties.foreground, this._timeEvolutionData.currentTimeValue);
            }
        }
    }
    setBackground(drawingFunction) {
        this._displayProperties.backgroundFunction = drawingFunction;
        this._updateBackground();
    }
    setForeground(drawingFunction) {
        this._displayProperties.foregroundFunction = drawingFunction;
        this._updateForeground();
    }
    setOrigin(...point) {
        if (point.length === 1 && point[0] === "centre") {
            propertySetters.setAxesProperty(this, "origin", "number", Math.round(this._displayProperties.width / 2), Math.round(this._displayProperties.height / 2));
            this._displayProperties.originArgCache = "centre";
        }
        else {
            propertySetters.setAxesProperty(this, "origin", "number", ...point);
            this._displayProperties.originArgCache = this.properties.origin;
        }
        if (this._displayProperties.backgroundCanvas !== null && this._displayProperties.foregroundCanvas !== null) {
            this._updateCanvasDimensions();
        }
    }
    setID(id) {
        if (activeCanvases[id] === undefined) {
            this.id = id;
            activeCanvases[this.id] = this;
        }
        else {
            throw `Error creating ResponsiveCanvas object: Object with ID "${id}" already exists.`;
        }
    }
    setBackgroundCSS(cssString) {
        propertySetters.setSingleProperty(this, "backgroundCSS", "string", cssString);
        if (this._displayProperties.backgroundCanvas !== null) {
            this._displayProperties.backgroundCanvas.style.background = cssString;
        }
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
        this._timeEvolutionData.currentTimeValue = 0;
        this._timeEvolutionData.offsetTimestampMS = 0;
        this._updateForeground();
    }
    _updateTime(currentTimestamp) {
        if (this._timeEvolutionData.timeEvolutionActive) {
            this._timeEvolutionData.currentTimeValue = (this._timeEvolutionData.offsetTimestampMS + currentTimestamp - this._timeEvolutionData.startTimestampMS) / 1000;
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
            });
            this.setConstant(constant, transform(element[attribute]));
        }
        else {
            const target = document.querySelector(element);
            if (target instanceof Element) {
                target.addEventListener(event, () => {
                    this.setConstant(constant, transform(target[attribute]));
                });
                this.setConstant(constant, transform(target[attribute]));
            }
            else {
                throw `Element with ID "${element}" could not be found.`;
            }
        }
    }
    show(element) {
        // TODO: get rid of containerElement (replace with canvasContainer)
        this._displayProperties.containerElement = document.querySelector(element);
        if (this._displayProperties.containerElement !== null) {
            this._displayProperties.canvasContainer = document.createElement("div");
            this._displayProperties.canvasContainer.id = this.id;
            this._displayProperties.canvasContainer.style.position = "relative";
            this._displayProperties.backgroundCanvas = document.createElement("canvas");
            this._displayProperties.foregroundCanvas = document.createElement("canvas");
            this._displayProperties.backgroundCanvas.style.position = "absolute";
            this._displayProperties.backgroundCanvas.style.left = "0";
            this._displayProperties.backgroundCanvas.style.top = "0";
            this._displayProperties.backgroundCanvas.id = `${this.id}-background-canvas`;
            this._displayProperties.foregroundCanvas.style.position = "absolute";
            this._displayProperties.foregroundCanvas.style.left = "0";
            this._displayProperties.foregroundCanvas.style.top = "0";
            this._displayProperties.foregroundCanvas.id = `${this.id}-foreground-canvas`;
            this._displayProperties.canvasContainer.appendChild(this._displayProperties.backgroundCanvas);
            this._displayProperties.canvasContainer.appendChild(this._displayProperties.foregroundCanvas);
            this._displayProperties.containerElement.appendChild(this._displayProperties.canvasContainer);
            this._displayProperties.background = this._displayProperties.backgroundCanvas.getContext("2d");
            this._displayProperties.foreground = this._displayProperties.foregroundCanvas.getContext("2d");
            this._displayProperties.width = this._displayProperties.containerElement.clientWidth;
            this._displayProperties.height = this._displayProperties.containerElement.clientHeight;
            this._displayProperties.resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    this._displayProperties.width = entry.target.clientWidth;
                    this._displayProperties.height = entry.target.clientHeight;
                    this._updateCanvasDimensions();
                }
            });
            this._displayProperties.resizeObserver.observe(this._displayProperties.containerElement);
            for (const property of Object.keys(this.properties)) {
                this[`set${property[0].toUpperCase()}${property.slice(1)}`](this.properties[property]);
            }
        }
        else {
            throw `Element with querySelector "${element}" could not be found.`;
        }
    }
}
