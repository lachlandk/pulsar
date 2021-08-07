type dataGenerator = (t: number, xLims: [number, number], yLims: [number, number], step: number, paramLims: [number, number]) => Generator<[number, number]>;

export function continuousFunctionGenerator(func: (x: number, t: number) => number): dataGenerator {
    return function* (t, xLims, yLims, step) {
        // TODO: discontinuities
        let x = xLims[0];
        let y = (x: number) => func(x, t);
        while (x <= xLims[1]) {
            while (true) { // while y is out of range or undefined
                if (x > xLims[1]) { // if x is out of range, break without yielding previous point2D
                    break;
                } else if (y(x) <= yLims[1] && y(x) >= yLims[0] && !Number.isNaN(y(x))) { // if y is in range, yield the previous point2D and break
                    yield [x - step, y(x - step)];
                    break;
                } else { // else increment x
                    x += step;
                }
            }
            while (true) { // while y in in range and defined
                yield [x, y(x)];
                if (x > xLims[1] || y(x) > yLims[1] || y(x) < yLims[0] || Number.isNaN(y(x))) { // if x or y is out of range, yield current point2D and break
                    break;
                } else { // else increment x
                    x += step;
                }
            }
        }
    }
}

export function parametricFunctionGenerator(data: [(p: number, t: number) => number, (p: number, t: number) => number]): dataGenerator {
    return function* (t, xLims, yLims, step, paramLims) {
        let x = (p: number) => data[0](p, t);
        let y = (p: number) => data[1](p, t);
        let p = paramLims[0];
        while (p <= paramLims[1]) {
            yield [x(p), y(p)];
            p += step;
        }
        yield [x(p), y(p)];
    }
}

export function discreteMapGenerator(data: [number[], (x: number, t: number) => number]): dataGenerator {
    return function* (t) {
        // TODO: add support for NaN
        for (const x of data[0]) {
            yield [x, data[1](x, t)];
        }
    }
}

export function discreteFunctionGenerator(data: [(number | ((t: number) => number))[], (number | ((x: number, t: number) => number))[]]): dataGenerator {
    return function* (t) {
        // TODO: add support for NaN
        for (let i = 0; i < data[0].length; i++) {
            const xValue = typeof data[0][i] === "function" ? data[0][i](t) : data[0][i];
            const yValue = typeof data[1][i] === "function" ? data[1][i](xValue, t) : data[1][i];
            yield [xValue, yValue];
        }
    }
}
