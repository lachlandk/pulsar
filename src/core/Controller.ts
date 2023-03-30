import { PulsarObject } from "./PulsarObject.js";
import { Animation } from "./Animation.js";

/**
 * Singleton class which controls main event loop of Pulsar.
 * The event loop runs using a recursive call to [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).
 * On every pass of the loop, {@link ResponsiveCanvas | `ResponsiveCanvas`} instances which are in the DOM and have their {@link ResponsiveCanvas.updateFlag | `updateFlag`} set will be redrawn.
 * If {@link Controller.animationsActive | `animationsActive`} is set, all {@link Animation | `Animation`} instances will also be updated if they are visible in the DOM.
 */
export class Controller {
    /**
     * The singleton instance.
     */
    static instance: Controller
    /**
     * List of current {@link PulsarObject | `PulsarObject`} instances.
     */
    activeObjects: PulsarObject[] = []
    /**
     * List of current {@link Animation | `Animation`} instances.
     */
    activeAnimations: Animation[] = []
    /**
     * Indicates whether Animations are currently running.
     */
    animationsActive: boolean = false
    /**
     * The timestamp when the {@link Controller.start | `start()`} method was called.
     */
    startTimestamp: number = 0
    /**
     * The timestamp when the {@link Controller.pause | `pause()`} method was called.
     */
    offsetTimestamp: number = 0

    constructor() {
        // check if an instance exists
        if (Controller.instance !== undefined) {
            return Controller.instance;
        }
        Controller.instance = this;
        window.requestAnimationFrame(timestamp => this.update(timestamp));
    }

    /**
     * Starts time evolution of animations.
     */
    start() {
        this.animationsActive = true;
        this.startTimestamp = performance.now();
    }

    /**
     * Stops time evolution of animations and resets animation progress to `t=0`.
     */
    stop() {
        this.animationsActive = false;
        this.startTimestamp = 0;
        this.offsetTimestamp = 0;
        for (const animation of this.activeAnimations) {
            animation.animate(0);
        }
    }

    /**
     * Pauses time evolution of animations.
     */
    pause() {
        this.animationsActive = false;
        this.offsetTimestamp = this.offsetTimestamp + performance.now() - this.startTimestamp;
    }

    /**
     * Updates all animations if {@link Controller.animationsActive | `animationsActive`} is set, updates all canvases that have {@link ResponsiveCanvas.updateFlag | `updateFlag`} set.
     * Called as part of the event loop.
     * @param currentTimestamp Current timestamp of the app.
     */
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
