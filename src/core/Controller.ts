import { PulsarObject } from "./PulsarObject.js";
import { Animation } from "./Animation.js";

class Controller {
    static instance: Controller
    activeObjects: PulsarObject[] = []
    activeAnimations: Animation[] = []
    animationsActive: boolean = false
    startTimestamp: number = 0
    offsetTimestamp: number = 0

    constructor() {
        // check if an instance exists
        if (Controller.instance !== undefined) {
            return Controller.instance;
        }
        Controller.instance = this;
        window.requestAnimationFrame(timestamp => this.update(timestamp));
    }

    start() {
        this.animationsActive = true;
        this.startTimestamp = performance.now();
    }

    stop() {
        this.animationsActive = false;
        this.startTimestamp = 0;
        this.offsetTimestamp = 0;
        for (const animation of this.activeAnimations) {
            animation.animate(0);
        }
    }

    pause() {
        this.animationsActive = false;
        this.offsetTimestamp = this.offsetTimestamp + performance.now() - this.startTimestamp;
    }

    update(currentTimestamp: number) {
        // update animations
        if (this.animationsActive) {
            for (const animation of this.activeAnimations) {
                if (animation.parent.parentElement !== null && animation.parent.style.display !== "none") {
                    animation.animate(this.offsetTimestamp + currentTimestamp - this.startTimestamp);
                }
            }
        }
        for (const object of this.activeObjects) {
            if (object.parentElement !== null && object.style.display !== "none") {
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
        window.requestAnimationFrame(timestamp => this.update(timestamp));
    }
}

export const Pulsar = new Controller();
