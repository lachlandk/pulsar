declare type dataGenerator = (t: number, xLims: [number, number], yLims: [number, number], step: number, paramLims: [number, number]) => Generator<[number, number]>;
export declare function continuousFunctionGenerator(func: (x: number, t: number) => number): dataGenerator;
export declare function parametricFunctionGenerator(data: [(p: number, t: number) => number, (p: number, t: number) => number]): dataGenerator;
export declare function discreteMapGenerator(data: [number[], (x: number, t: number) => number]): dataGenerator;
export declare function discreteFunctionGenerator(data: [(number | ((t: number) => number))[], (number | ((x: number, t: number) => number))[]]): dataGenerator;
export {};
