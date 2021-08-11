import { ResponsiveCanvas } from "./ResponsiveCanvas.js";

/**
 * Object containing the active canvas objects with their ID as the keys. It is used
 * internally by other objects.
 */
export const activeCanvases: {
    [id: string]: ResponsiveCanvas
} = {};
