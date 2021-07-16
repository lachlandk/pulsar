import { suite, test, before } from "mocha";
import { JSDOM } from "jsdom";
import { expect } from "chai";

import { Plot } from "../../../build/pulsar/pulsar.js";

suite("ResponsivePlot2D", function() {

	before(() => {
		global.window = new JSDOM().window;
		global.document = window.document;
		global.ResizeObserver = class {
			observe() {}
		};
	});

	test("When plotting data is passed to the constructor, it is added to the plot correctly", function() {
		const testPlot = new Plot("dataTest", {
			id: "test",
			data: x => Math.exp(x)
		});
		expect(testPlot.plotData.test).to.not.equal(undefined);
	});

	test("When plotting data with options is passed to the constructor, the options are set correctly", function() {
		const testPlot = new Plot("dataTest2", {
			id: "test",
			data: x => Math.floor(x),
			options: {
				visibility: false
			}
		});
		expect(testPlot.plotData.test.properties.visibility).to.equal(false);
	});
});
