import { Component } from "../core/Component.js";
import { ResponsiveCanvas } from "../core/ResponsiveCanvas.js";
import { validateAxesPropertyArgs } from "../core/validators.js";

export type AxisOptions = Partial<{
    majorTicks: [boolean, boolean] | boolean
    minorTicks: [boolean, boolean] | boolean
    majorTickSize: [number, number] | number
    minorTickSize: [number, number] | number
    majorGridlines: [boolean, boolean] | boolean
    minorGridlines: [boolean, boolean] | boolean
    majorGridSize: [number, number] | number
    minorGridSize: [number, number] | number
}>

export class Axis extends Component {
    majorTicks: {x: boolean, y: boolean} = Axis.Defaults.majorTicks
    minorTicks: {x: boolean, y: boolean} = Axis.Defaults.minorTicks
    majorTickSize: {x: number, y: number} = Axis.Defaults.majorTickSize
    minorTickSize: {x: number, y: number} = Axis.Defaults.minorTickSize
    majorGridlines: {x: boolean, y: boolean} = Axis.Defaults.majorGridlines
    minorGridlines: {x: boolean, y: boolean} = Axis.Defaults.minorGridlines
    majorGridSize: {x: number, y: number} = Axis.Defaults.majorGridSize
    minorGridSize: {x: number, y: number} = Axis.Defaults.minorGridSize

    static Defaults = {
        majorTicks: {x: false, y: false},
        minorTicks: {x: true, y: true},
        majorTickSize: {x: 5, y: 5},
        minorTickSize: {x: 1, y: 1},
        majorGridlines: {x: true, y: true},
        minorGridlines: {x: false, y: false},
        majorGridSize: {x: 5, y: 5},
        minorGridSize: {x: 1, y: 1}
    }

    constructor(canvas: ResponsiveCanvas, options: AxisOptions = {}) {
        super(canvas, context => {
            const drawGridSet = (majorOrMinor: "major" | "minor", xy: "x" | "y", ticksOrGridlines: "Ticks" | "Gridlines", width: number, lineStart: number, lineEnd: number) => {
                const offset = width % 2 === 0 ? 0 : 0.5;
                const intervalSize = (this as any)[`${majorOrMinor + (ticksOrGridlines === "Ticks" ? "TickSize" : "GridSize")}`][xy];
                context.lineWidth = width;
                if ((this as any)[`${majorOrMinor}${ticksOrGridlines}`][xy]) {
                    context.beginPath();
                    let currentValue = -Math.floor(this.canvas.container.origin[xy] / (intervalSize * this.canvas.container.scale[xy])) * intervalSize * this.canvas.container.scale[xy];
                    if (xy === "x") {
                        while (currentValue < this.canvas.container.clientWidth - this.canvas.container.origin.x) {
                            context.moveTo(currentValue + offset, lineStart);
                            context.lineTo(currentValue + offset, lineEnd);
                            currentValue += this.canvas.container.scale.x * intervalSize;
                        }
                    } else {
                        while (currentValue < this.canvas.container.clientHeight - this.canvas.container.origin.y) {
                            context.moveTo(lineStart, currentValue + offset);
                            context.lineTo(lineEnd, currentValue + offset);
                            currentValue += this.canvas.container.scale.y * intervalSize;
                        }
                    }
                    context.stroke();
                }
            };
            context.lineCap = "square";
            context.strokeStyle = "rgb(0, 0, 0)";
            drawGridSet("minor", "x", "Gridlines", 1, -this.canvas.container.origin.y, this.canvas.container.clientHeight - this.canvas.container.origin.y);
            drawGridSet("minor", "y", "Gridlines", 1, -this.canvas.container.origin.x, this.canvas.container.clientWidth - this.canvas.container.origin.x);
            drawGridSet("major", "x", "Gridlines", 2, -this.canvas.container.origin.y, this.canvas.container.clientHeight - this.canvas.container.origin.y);
            drawGridSet("major", "y", "Gridlines", 2, -this.canvas.container.origin.x, this.canvas.container.clientWidth - this.canvas.container.origin.x);
            drawGridSet("minor", "x", "Ticks", 1, -3, 3);
            drawGridSet("minor", "y", "Ticks", 1, -3, 3);
            drawGridSet("major", "x", "Ticks", 2, -6, 6);
            drawGridSet("major", "y", "Ticks", 2, -6, 6);
            context.beginPath();
            context.lineWidth = 3;
            // draw axes
            context.moveTo(0.5, -this.canvas.container.origin.y);
            context.lineTo(0.5, this.canvas.container.clientHeight - this.canvas.container.origin.y);
            context.moveTo(-this.canvas.container.origin.x, 0.5);
            context.lineTo(this.canvas.container.clientWidth - this.canvas.container.origin.x, 0.5);
            context.stroke();
        });

        for (const option in options) {
            const setter = `set${option.charAt(0).toUpperCase()}${option.slice(1)}`
            if (typeof (this as any)[setter] === "function") {
                (this as any)[setter](...(Array.isArray((options as any)[option]) ? (options as any)[option] : [(options as any)[option]]));
            }
        }
    }

    setMajorTicks(...choices: [boolean] | [boolean, boolean]) {
        this.majorTicks = validateAxesPropertyArgs(choices, "boolean", "majorTicks");
        this.canvas.updateFlag = true;
    }

    setMinorTicks(...choices: [boolean] | [boolean, boolean]) {
        this.minorTicks = validateAxesPropertyArgs(choices, "boolean", "minorTicks");
        this.canvas.updateFlag = true;
    }

    setMajorTickSize(...sizes: [number] | [number, number]) {
        this.majorTickSize = validateAxesPropertyArgs(sizes, "number", "majorTickSize");
        this.canvas.updateFlag = true;
    }

    setMinorTickSize(...sizes: [number] | [number, number]) {
        this.minorTickSize = validateAxesPropertyArgs(sizes, "number", "minorTickSize");
        this.canvas.updateFlag = true;
    }

    setMajorGridlines(...choices: [boolean] | [boolean, boolean]) {
        this.majorGridlines = validateAxesPropertyArgs(choices, "boolean", "majorGridlines");
        this.canvas.updateFlag = true;
    }

    setMinorGridlines(...choices: [boolean] | [boolean, boolean]) {
        this.minorGridlines = validateAxesPropertyArgs(choices, "boolean", "minorGridlines");
        this.canvas.updateFlag = true;
    }

    setMajorGridSize(...sizes: [number] | [number, number]) {
        this.majorGridSize = validateAxesPropertyArgs(sizes, "number", "majorGridSize");
        this.canvas.updateFlag = true;
    }

    setMinorGridSize(...sizes: [number] | [number, number]) {
        this.minorGridSize = validateAxesPropertyArgs(sizes, "number", "minorGridSize");
        this.canvas.updateFlag = true;
    }
}