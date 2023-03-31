import { Component } from "../core/Component.js";
import { ResponsiveCanvas } from "../core/ResponsiveCanvas.js";
import { validateChoicePropertyArg, validatePropertyArg } from "../core/validators.js";
import { arange, array, NDArray } from "@lachlandk/quasar";

export type TraceOptions = Partial<{
    traceColour: string
    traceStyle: "solid" | "dotted" | "dashed" | "dashdot" | "none"
    traceWidth: number
    markerColour: string
    markerStyle: "circle" | "plus" | "cross" | "arrow" | "none"
    markerSize: number
    visibility: boolean
}>

/**
 * Component representing the data trace on a plot.
 */
export class Trace extends Component {
    /**
     * The x-axis data.
     */
    xData: NDArray = array([]);
    /**
     * The y-axis data.
     */
    yData: NDArray = array([]);
    /**
     * Colour of the data trace.
     */
    traceColour: string = Trace.Defaults.traceColour
    /**
     * Line style of the data trace.
     */
    traceStyle: "solid" | "dotted" | "dashed" | "dashdot" | "none" = Trace.Defaults.traceStyle
    /**
     * Line thickness of the data trace in pixels.
     */
    traceWidth: number = Trace.Defaults.traceWidth
    /**
     * Colour of the data markers.
     */
    markerColour: string = Trace.Defaults.markerColour
    /**
     * Style of the data markers.
     */
    markerStyle: "circle" | "plus" | "cross" | "arrow" | "none" = Trace.Defaults.markerStyle
    /**
     * Size of the data markers in pixels.
     */
    markerSize: number = Trace.Defaults.markerSize
    /**
     * Visibility of the data trace.
     */
    visibility: boolean = Trace.Defaults.visibility

    /**
     * Name | Default value
     * --- | ---
     * `traceColour` | `"blue"`
     * `traceStyle` | `"solid"`
     * `traceWidth` | `3`
     * `markerColour` | `"blue"`
     * `markerStyle` | `"none"`
     * `markerSize` | `1`
     * `visibility` | `true`
     */
    static Defaults = {
        traceColour: "blue",
        traceStyle: "solid" as "solid",
        traceWidth: 3,
        markerColour: "blue",
        markerStyle: "none" as "none",
        markerSize: 1,
        visibility: true
    }

    /** @hidden */
    constructor(canvas: ResponsiveCanvas, y: NDArray | number[], options: TraceOptions)
    /**
     * @param canvas The parent canvas.
     * @param x Data for the x-axis (optional, see {@link setData | `setData()`}).
     * @param y Data for the y-axis
     * @param options Options for the data trace.
     */
    constructor(canvas: ResponsiveCanvas, x: NDArray | number[], y: NDArray | number[], options: TraceOptions)
    constructor(canvas: ResponsiveCanvas, xOrY: NDArray | number[], yOrOptions: NDArray | number[] | TraceOptions, options: TraceOptions = {}) {
        super(canvas);
        const y = yOrOptions instanceof NDArray || Array.isArray(yOrOptions) ? yOrOptions : xOrY;
        const x = yOrOptions instanceof NDArray || Array.isArray(yOrOptions) ? xOrY : arange(y instanceof NDArray ? y.size : y.length);
        options = yOrOptions instanceof NDArray || Array.isArray(yOrOptions) ? options : yOrOptions;
        this.setData(x, y);

        for (const option in options) {
            const setter = `set${option.charAt(0).toUpperCase()}${option.slice(1)}`
            if (typeof (this as any)[setter] === "function") {
                (this as any)[setter](...(Array.isArray((options as any)[option]) ? (options as any)[option] : [(options as any)[option]]));
            }
        }
    }

    /** @hidden */
    setData(y: NDArray | number[]): void
    /**
     * Set the plotting data for the data trace.
     * `x` argument is optional. If it is omitted, the x data becomes the indices of the y data array.
     * @param x Data for the x-axis.
     * @param y Data for the y-axis.
     */
    setData(x: NDArray | number[], y: NDArray | number[]): void
    setData(xOrY: NDArray | number[], y?: NDArray | number[]) {
        if (Array.isArray(xOrY)) xOrY = array(xOrY);
        if (Array.isArray(y)) y = array(y);
        this.yData = y instanceof NDArray ? y : xOrY;
        this.xData = y instanceof NDArray ? xOrY : this.xData;

        if (this.xData.shape.length !== 1 || this.yData.shape.length !== 1) {
            throw `Error: Plot data arrays must be 1-dimensional.`;
        }
        if (this.xData.size !== this.yData.size) {
            throw `Error: Plot data arrays must be the same length. x has length ${this.xData.shape[0]}, y has length ${this.yData.shape[0]}.`
        }

        this.draw = context => {
            if (this.visibility) {
                const x = this.xData;
                const y = this.yData;
                function* points() {
                    for (let i = 0; i < x.size; i++) {
                        yield [x.get(i) as number, y.get(i) as number];
                    }
                }
                if (this.traceStyle !== "none") {
                    context.strokeStyle = this.traceColour;
                    context.lineWidth = this.traceWidth;
                    context.lineJoin = "round";
                    switch (this.traceStyle) {
                        case "solid":
                            context.setLineDash([]);
                            break;
                        case "dotted":
                            context.setLineDash([3, 3]);
                            break;
                        case "dashed":
                            context.setLineDash([10, 10]);
                            break;
                        case "dashdot":
                            context.setLineDash([15, 3, 3, 3]);
                            break;
                    }
                    context.beginPath();
                    for (const point of points()) {
                        if (!Number.isSafeInteger(Math.round(point[1]))) {
                            point[1] = point[1] > 0 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
                        }
                        context.lineTo(point[0] * this.canvas.container.scale.x, -point[1] * this.canvas.container.scale.y);
                    }
                    context.stroke();
                }
                if (this.markerStyle !== "none") {
                    const markerSize = this.markerSize;
                    context.strokeStyle = this.markerColour;
                    context.fillStyle = this.markerColour;
                    context.lineWidth = 2 * markerSize;
                    const drawMarker = (() => {
                        switch (this.markerStyle) {
                            case "circle":
                                return (context: CanvasRenderingContext2D, x: number, y: number) => {
                                    context.arc(x, y, 5 * markerSize, 0, 2 * Math.PI);
                                    context.fill();
                                };
                            case "plus":
                                return (context: CanvasRenderingContext2D, x: number, y: number) => {
                                    context.moveTo(x, y + 5 * markerSize);
                                    context.lineTo(x, y - 5 * markerSize);
                                    context.moveTo(x + 5 * markerSize, y);
                                    context.lineTo(x - 5 * markerSize, y);
                                    context.stroke();
                                };
                            case "cross":
                                return (context: CanvasRenderingContext2D, x: number, y: number) => {
                                    context.moveTo(x + 5 * markerSize, y + 5 * markerSize);
                                    context.lineTo(x - 5 * markerSize, y - 5 * markerSize);
                                    context.moveTo(x - 5 * markerSize, y + 5 * markerSize);
                                    context.lineTo(x + 5 * markerSize, y - 5 * markerSize);
                                    context.stroke();
                                };
                            case "arrow":
                                return (context: CanvasRenderingContext2D, x: number, y: number, theta: number) => {
                                    if (!isNaN(theta)) {
                                        context.translate(x, y);
                                        context.rotate(-theta - Math.PI/2);
                                        context.moveTo(0, -7 * markerSize);
                                        context.lineTo(-5 * markerSize, 7 * markerSize);
                                        context.lineTo(5 * markerSize, 7 * markerSize);
                                        context.lineTo(0, -7 * markerSize);
                                        context.fill();
                                        context.rotate(theta + Math.PI/2);
                                        context.translate(-x, -y);
                                    }
                                };
                        }
                    })();
                    let lastPoint = [NaN, NaN];
                    for (const currentPoint of points()) {
                        context.beginPath();
                        const point: [number, number] = [currentPoint[0] * this.canvas.container.scale.x, -currentPoint[1] * this.canvas.container.scale.y];
                        const angle = Math.atan2(point[1] - lastPoint[1], -point[0] + lastPoint[0]);
                        drawMarker(context, ...point, angle);
                        lastPoint = point;
                    }
                }
            }
        }
        this.canvas.updateFlag = true;
    }

    /**
     * Sets the colour of the data trace.
     * Must be a browser-recognised colour name.
     * @param colour
     */
    setTraceColour(colour: string) {
        this.traceColour = validatePropertyArg(colour, "string", "traceColour");
        this.canvas.updateFlag = true;
    }

    /**
     * Sets the style of the data trace.
     * @param style
     */
    setTraceStyle(style: "solid" | "dotted" | "dashed" | "dashdot" | "none") {
        this.traceStyle = validateChoicePropertyArg(style, ["solid", "dotted", "dashed", "dashdot", "none"], "traceStyle");
        this.canvas.updateFlag = true;
    }

    /**
     * Sets the line width of the data trace in pixels.
     * @param width
     */
    setTraceWidth(width: number) {
        this.traceWidth = validatePropertyArg(width, "number", "traceWidth");
        this.canvas.updateFlag = true;
    }

    /**
     * Sets the colour of the data markers.
     * Must be a browser-recognised colour name.
     * @param colour
     */
    setMarkerColour(colour: string) {
        this.markerColour = validatePropertyArg(colour, "string", "markerColour");
        this.canvas.updateFlag = true;
    }

    /**
     * Sets the style of the data markers.
     * @param style
     */
    setMarkerStyle(style: "circle" | "plus" | "cross" | "arrow" | "none") {
        this.markerStyle = validateChoicePropertyArg(style,["circle", "plus", "cross", "arrow", "none"], "markerStyle");
        this.canvas.updateFlag = true;
    }

    /**
     * Sets the size of the data markers in pixels.
     * @param size
     */
    setMarkerSize(size: number) {
        this.markerSize = validatePropertyArg(size, "number", "markerSize");
        this.canvas.updateFlag = true;
    }

    /**
     * Toggles the visibility of the data trace.
     * @param value
     */
    setVisibility(value: boolean) {
        this.visibility = validatePropertyArg(value, "boolean", "visibility");
        this.canvas.updateFlag = true;
    }
}
