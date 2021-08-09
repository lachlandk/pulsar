import { OptionTypes } from "../Defaults.js";
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
export declare class ResponsiveCanvas {
    /**
     * The unique ID for the canvas object.
     */
    id: string;
    /**
     *
     */
    properties: any;
    protected _timeEvolutionData: {
        currentTimeValue: number;
        startTimestampMS: number;
        offsetTimestampMS: number;
        timeEvolutionActive: boolean;
    };
    protected _displayData: {
        width: number;
        height: number;
        originArgCache: "centre" | null;
        parentElement: Element | null;
        resizeObserver: ResizeObserver;
        canvasContainer: HTMLDivElement;
        backgroundCanvas: HTMLCanvasElement;
        foregroundCanvas: HTMLCanvasElement;
        background: CanvasRenderingContext2D;
        foreground: CanvasRenderingContext2D;
        backgroundFunction: (context: CanvasRenderingContext2D) => void;
        foregroundFunction: (context: CanvasRenderingContext2D, timeValue: number) => void;
    };
    /**
     * @param id The ID of the canvas object.
     * @param options  Optional parameters.
     */
    constructor(id: string, options?: OptionTypes["ResponsiveCanvas"]);
    resizeEventListener(entry: ResizeObserverEntry): void;
    /**
      * Updates the background.
      */
    updateBackground(): void;
    /**
      * Updates the foreground.
      */
    updateForeground(): void;
    /**
     * Sets the drawing function for the background canvas to `drawingFunction` and updates the canvas.
     * The argument `drawingFunction` should be a function which takes one or two arguments of its own, the first being the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D `CanvasRenderingContext2D`} for the background,
     * and the second (which is optional) being the current time evolution value for the canvas object (in seconds).
     * @param drawingFunction The function which draws the background.
     */
    setBackground(drawingFunction: (context: CanvasRenderingContext2D) => void): void;
    /**
     * Sets the drawing function for the foreground canvas to `drawingFunction` and updates the canvas.
     * The argument `drawingFunction` should be a function which takes one or two arguments of its own, the first being the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D `CanvasRenderingContext2D`} for the background,
     * and the second (which is optional) being the current time evolution value for the canvas object (in seconds).
     * The second argument need only specified if the drawing function contains animations which depend on the current
     * time value.
     * @param drawingFunction The function which draws the foreground.
     */
    setForeground(drawingFunction: (context: CanvasRenderingContext2D, timeValue: number) => void): void;
    /**
     * Sets the origin of both canvases to the point2D specified (in pixels).
     * Two values may be passed for `x` then `y`, or one value may be passed to set the origins of both axes to the same value.
     * The string `"centre"` may also be passed to conveniently set the origin to the middle of the canvas.
     * Note that for the HTML5 canvas the origin is in the top-left corner by default and the x-axis points rightwards,
     * while the y-axis points downwards.
     * @param point
     */
    setOrigin(...point: ("centre" | number)[]): void;
    /**
     * Sets the ID of the canvas object to the value specified,
     * which cannot be the same as another existing canvas object.
     * If the canvas object is active on an HTML page, all of its elements will have their `ID`s updated.
     * @param id New ID for the canvas object.
     */
    setID(id: string): void;
    /**
     * Sets the `background` CSS property of the background canvas to the string passed in.
     * This can be used to set the background for the canvas object to a plain colour, gradient pattern or image
     * (by default the background is transparent).
     * @param cssString A valid string for the CSS {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background `background`} property.
     */
    setBackgroundCSS(cssString: string): void;
    /**
     * Starts or resumes the time evolution of the foreground.
     */
    startTime(): void;
    /**
     * Pauses the time evolution of the foreground.
     */
    pauseTime(): void;
    /**
     * Stops the time evolution of the foreground and resets the current timestamp to 0.
     */
    stopTime(): void;
    protected _updateTime(currentTimestamp: number): void;
    /**
     * Display the canvas object in an HTML element.
     * @param element
     */
    show(element: string | Element): void;
}
