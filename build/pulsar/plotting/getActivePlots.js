import { Plot } from "./Plot.js";
import { activeCanvases } from "../core/index.js";
export function getActivePlots() {
    const activePlots = {};
    for (const canvasID of Object.keys(activeCanvases)) {
        if (activeCanvases[canvasID] instanceof Plot) {
            activePlots[canvasID] = activeCanvases[canvasID];
        }
    }
    return activePlots;
}
