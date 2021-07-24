import { Plot } from "./Plot.js";
import { activeCanvases } from "../core/index.js";

/**
 * Returns an object containing the active instances of {@link Plot `Plot`}.
 */
export function getActivePlots(): { [id: string]: Plot } {
    const activePlots: ReturnType<typeof getActivePlots> = {};
    for (const canvasID of Object.keys(activeCanvases)) {
        if (activeCanvases[canvasID] instanceof Plot) {
            activePlots[canvasID] = activeCanvases[canvasID] as Plot;
        }
    }
    return activePlots;
}
