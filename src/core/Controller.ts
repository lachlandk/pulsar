import { PulsarObject } from "./PulsarObject.js";

class Controller {
    activeObjects: PulsarObject[] = []
    animationsActive: boolean = false
    startTimestamp: number = 0
    offsetTimestamp: number = 0

    constructor() {
        window.requestAnimationFrame(_ => this.update());
    }

    start() {
        this.animationsActive = true;
        this.startTimestamp = performance.now();
        window.requestAnimationFrame(_ => this.update());
    }

    stop() {
        this.animationsActive = false;
        this.startTimestamp = 0;
        this.offsetTimestamp = 0;
    }

    pause() {
        this.animationsActive = false;
        this.offsetTimestamp = this.offsetTimestamp + performance.now() - this.startTimestamp;
    }

    update() {
        for (const object of this.activeObjects) {
            if (object.parentElement !== null || object.style.display === "none") {
                for (const container of object.containers) {
                    for (const canvas of container.canvases) {
                        // check update flag and redraw all components
                        if (canvas.updateFlag) {
                            canvas.update();
                        }
                    }
                }
            }
        }

        // update animations
        if (this.animationsActive) {

        }

        window.requestAnimationFrame(_ => this.update());
    }
}

export const Pulsar = new Controller();
