export type point2D = {
    x: number
    y: number
};

export type choice2D = {
    x: boolean
    y: boolean
}

export type drawingFunction = (context: CanvasRenderingContext2D, timeValue: number) => void;
