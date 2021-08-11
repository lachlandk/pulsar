// TODO: this module needs tests
import { activeCanvases } from "./activeCanvases.js";
class TimeEvolutionController {
    constructor() {
        this.canvasTimeData = [];
        this.globalLoopActive = false;
        this.startTimestamp = 0;
        this.offsetTimestamp = 0;
    }
    startAll() {
        for (const object of this.canvasTimeData) {
            object.timeEvolutionActive = true;
        }
        this.startTimestamp = performance.now();
        this.globalLoopActive = true;
        window.requestAnimationFrame(timestamp => this.updateObjects(timestamp));
    }
    pauseAll() {
        for (const object of this.canvasTimeData) {
            object.timeEvolutionActive = false;
        }
        this.offsetTimestamp = this.offsetTimestamp + performance.now() - this.startTimestamp;
    }
    stopAll() {
        for (const object of this.canvasTimeData) {
            object.timeEvolutionActive = false;
            activeCanvases[object.id].currentTimeValue = 0;
            activeCanvases[object.id].updateForeground();
        }
        this.startTimestamp = 0;
        this.offsetTimestamp = 0;
        this.globalLoopActive = false;
    }
    updateObjects(currentTimestamp) {
        if (this.globalLoopActive) {
            let atLeastOneActiveCanvas = false;
            for (const object of this.canvasTimeData) {
                if (object.timeEvolutionActive) {
                    atLeastOneActiveCanvas = true;
                    activeCanvases[object.id].currentTimeValue = (this.offsetTimestamp + currentTimestamp - this.startTimestamp) / 1000;
                    activeCanvases[object.id].updateForeground();
                }
            }
            if (atLeastOneActiveCanvas) {
                window.requestAnimationFrame(timestamp => this.updateObjects(timestamp));
            }
            else {
                this.globalLoopActive = false;
            }
        }
    }
    addObject(id, sync = true) {
        if (this.canvasTimeData.find(object => object.id === id) === undefined) {
            this.canvasTimeData.push({
                id: id,
                timeEvolutionActive: sync,
            });
        }
        else {
            throw `Error: Time data for canvas object with ID "${id}" already exists.`;
        }
    }
}
export const Time = new TimeEvolutionController();
