export declare type OptionTypes = {
    ResponsiveCanvas: Partial<{
        origin: [number, number] | number | "centre";
        backgroundCSS: string;
    }>;
    ResponsivePlot2D: Partial<{
        majorTicks: [boolean, boolean] | boolean;
        minorTicks: [boolean, boolean] | boolean;
        majorTickSize: [number, number] | number;
        minorTickSize: [number, number] | number;
        majorGridlines: [boolean, boolean] | boolean;
        minorGridlines: [boolean, boolean] | boolean;
        majorGridSize: [number, number] | number;
        minorGridSize: [number, number] | number;
        xLims: [number, number];
        yLims: [number, number];
    }>;
    ResponsivePlot2DTrace: Partial<{
        traceColour: string;
        traceStyle: "solid" | "dotted" | "dashed" | "dashdot" | "none";
        traceWidth: number;
        markerColour: string;
        markerStyle: "circle" | "plus" | "cross" | "arrow" | "none";
        markerSize: number;
        visibility: boolean;
        parameterRange: [number, number];
    }>;
};
declare class defaults {
    values: {
        [proto: string]: object;
    };
    create(...protos: string[]): any;
    mergeOptions(instance: object, type: string, options: {
        [name: string]: any;
    }): void;
}
export declare const Defaults: defaults;
export {};
