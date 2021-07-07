import { ResponsiveCanvas, ResponsivePlot2D } from "./core/index.js";
export declare const core: {
    ResponsiveCanvas: typeof ResponsiveCanvas;
    ResponsivePlot2D: typeof ResponsivePlot2D;
    activeCanvases: {
        [id: string]: import("./core/ResponsiveCanvas.js").ResponsiveCanvasObject;
    };
};
export { Plot } from "./plotting/index.js";
export { getActivePlots } from "./plotting/index.js";
