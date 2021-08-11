// TODO: this module needs tests
class defaults {
    constructor() {
        this.values = {
            ResponsiveCanvas: {
                origin: { x: 0, y: 0 },
                backgroundCSS: ""
            },
            ResponsivePlot2D: {
                origin: { x: 0, y: 0 },
                backgroundCSS: "",
                majorTicks: { x: true, y: true },
                minorTicks: { x: false, y: false },
                majorTickSize: { x: 5, y: 5 },
                minorTickSize: { x: 1, y: 1 },
                majorGridlines: { x: true, y: true },
                minorGridlines: { x: false, y: false },
                majorGridSize: { x: 5, y: 5 },
                minorGridSize: { x: 1, y: 1 },
                xLims: [0, 10],
                yLims: [-10, 0]
            },
            ResponsivePlot2DTrace: {
                traceColour: "blue",
                traceStyle: "solid",
                traceWidth: 3,
                markerColour: "blue",
                markerStyle: "none",
                markerSize: 1,
                visibility: true,
                parameterRange: [0, 1]
            }
        };
        // static setDefault(proto: {[property: string]: unknown}, property: string, value: unknown) {
        //     proto[property] = value;
        // }
    }
    create(...protos) {
        return Object.assign({}, ...Array.from(protos, (proto) => this.values[proto]));
    }
    mergeOptions(instance, type, options) {
        for (const option of Object.keys(options)) {
            if (option in this.values[type]) {
                const setterFunc = instance[`set${option.charAt(0).toUpperCase()}${option.slice(1)}`];
                if (setterFunc !== undefined) {
                    setterFunc.call(instance, ...(Array.isArray(options[option]) ? options[option] : [options[option]]));
                }
            }
        }
    }
}
export const Defaults = new defaults();
