/**
 * @licence
 * Pulsar.js - A javascript data visualisation framework
 * Copyright (C) 2021  Lachlan Dufort-Kennett
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import { ResponsiveCanvas } from "./core/index.js";
export declare const core: {
    ResponsiveCanvas: typeof ResponsiveCanvas;
    activeCanvases: {
        [id: string]: ResponsiveCanvas;
    };
};
import { ResponsivePlot2D, ResponsivePlot2DTrace } from "./plotting/index.js";
export declare const plotting: {
    ResponsivePlot2D: typeof ResponsivePlot2D;
    ResponsivePlot2DTrace: typeof ResponsivePlot2DTrace;
};
export { Time } from "./core/index.js";
export * from "./Defaults.js";
export * from "./Plot.js";
