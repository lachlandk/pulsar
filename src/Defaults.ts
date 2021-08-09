// TODO: this module needs tests

export type OptionTypes = {
    ResponsiveCanvas: Partial<{
        origin: [number, number] | number | "centre"
        backgroundCSS: string
    }>,
    ResponsivePlot2D: Partial<{
        majorTicks: [boolean, boolean] | boolean
        minorTicks: [boolean, boolean] | boolean
        majorTickSize: [number, number] | number
        minorTickSize: [number, number] | number
        majorGridlines: [boolean, boolean] | boolean
        minorGridlines: [boolean, boolean] | boolean
        majorGridSize: [number, number] | number
        minorGridSize: [number, number] | number
        xLims: [number, number]
        yLims: [number, number]
    }>,
    ResponsivePlot2DTrace: Partial<{
        traceColour: string
        traceStyle: "solid" | "dotted" | "dashed" | "dashdot" | "none"
        traceWidth: number
        markerColour: string
        markerStyle: "circle" | "plus" | "cross" | "arrow" | "none"
        markerSize: number
        visibility: boolean
        parameterRange: [number, number]
    }>
}

class defaults {
    values: {[proto: string]: object} = {
        ResponsiveCanvas: {
          origin: {x: 0, y: 0},
          backgroundCSS: ""
      },
      ResponsivePlot2D: {
        origin: {x: 0, y: 0},
        backgroundCSS: "",
        majorTicks: {x: true, y: true},
        minorTicks: {x: false, y: false},
        majorTickSize: {x: 5, y: 5},
        minorTickSize: {x: 1, y: 1},
        majorGridlines: {x: true, y: true},
        minorGridlines: {x: false, y: false},
        majorGridSize: {x: 5, y: 5},
        minorGridSize: {x: 1, y: 1},
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
  }

  create(...protos: string[]) {
      return Object.assign({}, ...Array.from(protos, (proto: string) => this.values[proto]))
  }

  mergeOptions(instance: object, type: string, options: {[name: string]: any}) {
      for (const option of Object.keys(options)) {
          if (option in this.values[type]) {
              const setterFunc = (instance as {[method: string]: any})[`set${option.charAt(0).toUpperCase()}${option.slice(1)}`];
              if (setterFunc !== undefined) {
                  setterFunc.call(instance, ...(Array.isArray(options[option]) ? options[option] : [options[option]]));
              }
          }
      }
  }

  // static setDefault(proto: {[property: string]: unknown}, property: string, value: unknown) {
  //     proto[property] = value;
  // }
}

export const Defaults = new defaults();
