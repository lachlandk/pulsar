import { ResponsiveCanvas } from "./ResponsiveCanvas.js";

/**
 * Object containing the active canvas objects with their ID as the keys. It is used
 * internally by other functions such as {@link getActivePlots `getActivePlots()`}.
 */
export const activeCanvases: {
    [id: string]: ResponsiveCanvas
} = {};
