import { suite, test, before } from "mocha";
import { JSDOM } from "jsdom";
import { expect } from "chai";

import { getActivePlots, Plot } from "../../../build/pulsar/pulsar.js";
import { ResponsiveCanvas } from "../../../build/pulsar/core/index.js";

suite("ResponsivePlot2D", function() {

	before(() => {
		global.window = new JSDOM().window;
		global.document = window.document;
		global.ResizeObserver = class {
			observe() {}
		};
	});

	test("getActivePlots() returns an object with active instances of the Plot class", function() {
		const testCanvas1 = new ResponsiveCanvas("canvas1");
		const testCanvas2 = new ResponsiveCanvas("canvas2");
		const testPlot1 = new Plot("plot1");
		const testPlot2 = new Plot("plot2");
		const activePlots = getActivePlots();
		expect(activePlots).to.include({
			"plot1": testPlot1,
			"plot2": testPlot2
		});
		expect(activePlots).to.not.include({
			"canvas1": testCanvas1,
			"canvas2": testCanvas2
		});
	});
});
