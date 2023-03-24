import { suite, test, before, after } from "mocha";
import { expect } from "chai";

import { closeTestServer, startTestServer } from "../server.js";

suite("Trace class", function() {

	before(startTestServer(() => {
		window.testObject = new window.Pulsar.PulsarObject();
		document.body.appendChild(testObject);
		
		window.testContainer = new window.Pulsar.CanvasContainer(testObject);
		window.testCanvas = new window.Pulsar.ResponsiveCanvas(testContainer);
		window.testTrace = new window.Pulsar.Trace(testCanvas, []);
	}));

	after(closeTestServer);

	test("Constructor accepts 2 ndarrays, 2 arrays or a mix", async function () {
		await this.page.evaluate(() => window.testTrace2 = new window.Pulsar.Trace(testCanvas, [1, 2, 3], [4, 5, 6]));
		expect(await this.page.evaluate(() => window.testTrace2.xData.constructor.name)).to.equal("NDArray");
		expect(await this.page.evaluate(() => window.testTrace2.xData.shape)).to.deep.equal([3]);
		expect(await this.page.evaluate(() => window.testTrace2.yData.constructor.name)).to.equal("NDArray");
		expect(await this.page.evaluate(() => window.testTrace2.yData.shape)).to.deep.equal([3]);
	});

	test("Constructor accepts 1 ndarrays or array and sets x data to the indices", async function () {
		await this.page.evaluate(() => window.testTrace2 = new window.Pulsar.Trace(testCanvas, [4, 5, 6]));
		expect(await this.page.evaluate(() => window.testTrace2.xData.constructor.name)).to.equal("NDArray");
		expect(await this.page.evaluate(() => window.testTrace2.xData.shape)).to.deep.equal([3]);
	});

	test("setData() accepts 2 ndarrays, 2 arrays or a mix", async function () {
		await this.page.evaluate(() => window.testTrace.setData([1, 2, 3, 4], [5, 6, 7, 8]));
		expect(await this.page.evaluate(() => window.testTrace.xData.constructor.name)).to.equal("NDArray");
		expect(await this.page.evaluate(() => window.testTrace.xData.shape)).to.deep.equal([4]);
		expect(await this.page.evaluate(() => window.testTrace.yData.constructor.name)).to.equal("NDArray");
		expect(await this.page.evaluate(() => window.testTrace.yData.shape)).to.deep.equal([4]);
	});

	test("setData() accepts 1 ndarrays or array and sets x data to the indices", async function () {
		await this.page.evaluate(() => window.testTrace.setData([5, 6, 7, 8]));
		expect(await this.page.evaluate(() => window.testTrace.xData.constructor.name)).to.equal("NDArray");
		expect(await this.page.evaluate(() => window.testTrace.xData.shape)).to.deep.equal([4]);
	});

	test("setData() throws an error if arrays are of a different length", async function () {
		expect(await this.page.evaluate(() => {
			try {
				window.testTrace.setData([1, 2, 3], [4, 5, 6, 7]);
			} catch (_) {
				return true;
			}
			return false;
		})).to.equal(true);
	});

	test("setTraceColour() sets trace colour correctly", async function () {
		await this.page.evaluate(() => window.testTrace.setTraceColour("red"));
		expect(await this.page.evaluate(() => window.testTrace.traceColour)).to.equal("red");
	});

	test("setTraceStyle() sets trace style correctly, throws error if style doesn't exist", async function () {
		await this.page.evaluate(() => window.testTrace.setTraceStyle("dotted"));
		expect(await this.page.evaluate(() => window.testTrace.traceStyle)).to.equal("dotted");
		expect(await this.page.evaluate(() => {
			try {
				window.testTrace.setTraceStyle("fake-style");
			} catch (_) {
				return true;
			}
			return false;
		})).to.equal(true);
	});

	test("setTraceWidth() sets trace width correctly", async function () {
		await this.page.evaluate(() => window.testTrace.setTraceWidth(5));
		expect(await this.page.evaluate(() => window.testTrace.traceWidth)).to.equal(5);
	});

	test("setMarkerColour() sets marker colour correctly", async function () {
		await this.page.evaluate(() => window.testTrace.setMarkerColour("red"));
		expect(await this.page.evaluate(() => window.testTrace.markerColour)).to.equal("red");
	});

	test("setMarkerStyle() sets marker style correctly, throws error if style doesn't exist", async function () {
		await this.page.evaluate(() => window.testTrace.setMarkerStyle("cross"));
		expect(await this.page.evaluate(() => window.testTrace.markerStyle)).to.equal("cross");
		expect(await this.page.evaluate(() => {
			try {
				window.testTrace.setMarkerStyle("fake-style");
			} catch (_) {
				return true;
			}
			return false;
		})).to.equal(true);
	});

	test("setMarkerSize() sets marker size correctly", async function () {
		await this.page.evaluate(() => window.testTrace.setMarkerSize(5));
		expect(await this.page.evaluate(() => window.testTrace.markerSize)).to.equal(5);
	});

	test("setVisibility() sets visibility property correctly", async function () {
		await this.page.evaluate(() => window.testTrace.setVisibility(false));
		expect(await this.page.evaluate(() => window.testTrace.visibility)).to.equal(false);
	});
});
