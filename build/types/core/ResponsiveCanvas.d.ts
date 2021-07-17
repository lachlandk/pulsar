import { ResponsiveCanvasOptions } from "./defaults.js";
import { point2D, drawingFunction } from "../helpers/index.js";
export interface ResponsiveCanvasObject {
    id: string;
    properties: {
        origin: point2D;
        backgroundCSS: string;
    };
    constants: {
        [name: string]: any;
    };
    setBackground: (drawingFunction: drawingFunction) => void;
    setForeground: (drawingFunction: drawingFunction) => void;
    setOrigin: (...point: ("centre" | number)[]) => void;
    setID: (id: string) => void;
    setBackgroundCSS: (cssString: string) => void;
    startTime: () => void;
    pauseTime: () => void;
    stopTime: () => void;
    setConstant: (name: string, value: any) => void;
    connectElementAttribute: (element: string | Element, event: string, attribute: string, constant: string, transform: (x: any) => any) => void;
    show: (element: string | HTMLElement) => void;
}
export declare class ResponsiveCanvas implements ResponsiveCanvasObject {
    id: string;
    properties: ResponsiveCanvasObject["properties"];
    constants: ResponsiveCanvasObject["constants"];
    protected _timeEvolutionData: {
        currentTimeValue: number;
        startTimestampMS: number;
        offsetTimestampMS: number;
        timeEvolutionActive: boolean;
    };
    protected _displayData: {
        width: number;
        height: number;
        originArgCache: (number | "centre")[];
        containerElement: HTMLElement | null;
        resizeObserver: ResizeObserver;
        backgroundCanvas: HTMLCanvasElement;
        foregroundCanvas: HTMLCanvasElement;
        background: CanvasRenderingContext2D | null;
        foreground: CanvasRenderingContext2D | null;
        backgroundFunction: drawingFunction;
        foregroundFunction: drawingFunction;
    };
    constructor(id: string, options?: Partial<ResponsiveCanvasOptions>);
    protected _updateCanvasDimensions(): void;
    protected _updateBackground(): void;
    protected _updateForeground(): void;
    setBackground(drawingFunction: drawingFunction): void;
    setForeground(drawingFunction: drawingFunction): void;
    setOrigin(...point: ("centre" | number)[]): void;
    setID(id: string): void;
    setBackgroundCSS(cssString: string): void;
    startTime(): void;
    pauseTime(): void;
    stopTime(): void;
    protected _updateTime(currentTimestamp: number): void;
    setConstant(name: string, value: any): void;
    connectElementAttribute(element: string | Element, event: string, attribute: string, constant: string, transform?: (x: any) => any): void;
    show(element: string | HTMLElement): void;
}
