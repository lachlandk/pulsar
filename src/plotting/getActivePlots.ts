import { PlotObject, Plot } from "./Plot.js";
import { activeCanvases } from "../core/index.js";

export function getActivePlots(): { [id: string]: PlotObject } {
    const activePlots: ReturnType<typeof getActivePlots> = {};
    for (const canvasID of Object.keys(activeCanvases)) {
        if (activeCanvases[canvasID] instanceof Plot) {
            activePlots[canvasID] = activeCanvases[canvasID] as PlotObject;
        }
    }
    return activePlots;
}
