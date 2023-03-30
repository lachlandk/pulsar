import { Pulsar } from "./Controller.js";
import { PulsarObject } from "./PulsarObject.js";
import { validatePropertyArg } from "./validators.js";

export type AnimationOptions = Partial<{
    period: number
    repeat: boolean
}>

/**
 * Class for an animation that happens on a {@link ResponsiveCanvas | `ResponsiveCanvas`}.
 * Time evolution of animations may be controlled using the {@link Controller | `Controller`}.
 */
export class Animation {
    /**
     * The parent {@link PulsarObject | `PulsarObject`} instance.
     */
    parent: PulsarObject
    /**
     * Function which generates a frame of the animation given a timestamp.
     */
    func: (time: number) => void
    /**
     * Period of the animation in milliseconds
     */
    period: number = Animation.Defaults.period
    /**
     * Indicates whether the animation repeats or not.
     */
    repeat: boolean = Animation.Defaults.repeat

    /**
     * Name | Default value
     * --- | ---
     * `period` | `1000`
     * `repeat` | `true`
     */
    static Defaults = {
        period: 1000,
        repeat: true
    }

    /**
     * @param parent Parent {@link PulsarObject | `PulsarObject`} instance.
     * @param func The animation function.
     * @param options Options for the animation.
     */
    constructor(parent: PulsarObject, func: (time: number) => void, options: AnimationOptions = {}) {
        this.parent = parent;
        this.func = func;

        for (const option in options) {
            const setter = `set${option.charAt(0).toUpperCase()}${option.slice(1)}`
            if (typeof (this as any)[setter] === "function") {
                (this as any)[setter](...(Array.isArray((options as any)[option]) ? (options as any)[option] : [(options as any)[option]]));
            }
        }

        Pulsar.activeAnimations.push(this);
    }

    /**
     * Calls {@link Animation.func} with the current timestamp if the animation should be running.
     * Called as part of the event loop if {@link Controller.animationsActive | `animationsActive`} is set.
     * @param time The current timestamp of the app.
     */
    animate(time: number) {
        // check if animation has completed
        if (time <= this.period || this.repeat) {
            this.func(time);
        }
    }

    /**
     * Sets the period.
     * @param period Period in milliseconds.
     */
    setPeriod(period: number) {
        this.period = validatePropertyArg(period, "number", "interval");
    }

    /**
     * Sets the repeat flag.
     * @param repeat Repeat flag.
     */
    setRepeat(repeat: boolean) {
        this.repeat = validatePropertyArg(repeat, "boolean", "repeat")
    }
}
