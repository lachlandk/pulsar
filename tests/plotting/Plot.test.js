import {after, before, suite, test} from "mocha";
import { expect } from "chai";

import { closeTestServer, startTestServer } from "../server.js";

suite("Plot class", function() {

	before(startTestServer(() => {
		window.testFigure = new window.Pulsar.Figure({
			plot: {
				background: {
					background: "green"
				},
				foreground: {
					background: "red"
				},
				axis: {
					majorTicks: true
				}
			}
		});
		document.body.appendChild(testFigure);
		window.testPlot = window.testFigure.containers[0];
	}));

	after(closeTestServer);

	test("Constructor creates a foreground and background ResponsiveCanvas and an Axis component on the background", async function () {
		expect(await this.page.evaluate(() => window.testPlot.background.constructor.name)).to.equal("ResponsiveCanvas");
		expect(await this.page.evaluate(() => window.testPlot.foreground.constructor.name)).to.equal("ResponsiveCanvas");
		expect(await this.page.evaluate(() => window.testPlot.axis.constructor.name)).to.equal("Axis");
		expect(await this.page.evaluate(() => window.testPlot.axis.canvas === window.testPlot.background)).to.equal(true);
	});

	test("Constructor passes options under the \"background\" property to the background ResponsiveCanvas constructor", async function () {
		expect(await this.page.evaluate(() => window.testPlot.background.background)).to.equal("green");
	});

	test("Constructor passes options under the \"foreground\" property to the foreground ResponsiveCanvas constructor", async function () {
		expect(await this.page.evaluate(() => window.testPlot.foreground.background)).to.equal("red");
	});

	test("Constructor passes options under the \"axis\" property to the Axis constructor", async function () {
		expect(await this.page.evaluate(() => window.testPlot.axis.majorTicks)).to.deep.equal({x: true, y: true});
	});

	test("plot() creates a Trace component on the foreground and pushes it to data array", async function () {
		await this.page.evaluate(() => window.testTrace = window.testPlot.plot([]));
		expect(await this.page.evaluate(() => window.testTrace.canvas === window.testPlot.foreground)).to.equal(true);
		expect(await this.page.evaluate(() => window.testPlot.data[0] === window.testTrace)).to.equal(true);
	});
});
