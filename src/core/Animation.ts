import { Pulsar } from "./Controller.js";
import { PulsarObject } from "./PulsarObject.js";
import { validatePropertyArg } from "./validators.js";

export type AnimationOptions = Partial<{
    period: number
    repeat: boolean
}>

export class Animation {
    parent: PulsarObject
    func: (time: number) => void
    period: number = Animation.Defaults.period
    repeat: boolean = Animation.Defaults.repeat

    static Defaults = {
        period: 1000,
        repeat: true
    }

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

    animate(time: number) {
        // check if animation has completed
        if (time <= this.period || this.repeat) {
            this.func(time);
        }
    }

    setPeriod(period: number) {
        this.period = validatePropertyArg(period, "number", "interval");
    }

    setRepeat(repeat: boolean) {
        this.repeat = validatePropertyArg(repeat, "boolean", "repeat")
    }
}
