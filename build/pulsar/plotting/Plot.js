import { ResponsivePlot2D } from "../core/index.js";
export class Plot extends ResponsivePlot2D {
    constructor(id, data, options = {}) {
        super(id, options);
        if (data !== undefined) {
            this.plot(data.id, data.data, data.options);
        }
    }
}
