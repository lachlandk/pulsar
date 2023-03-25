import {after, before, suite, test} from "mocha";
import { expect } from "chai";

import { closeTestServer, startTestServer } from "../server.js";

suite("Axis", function() {

	before(startTestServer(() => {
		window.testFigure = new window.Pulsar.Figure();
		document.body.appendChild(testFigure);
		window.testAxis = window.testFigure.containers[0].axis;
	}));

	after(closeTestServer);

	test("setMajorTicks() toggles major ticks correctly", async function () {
		await this.page.evaluate(() => window.testAxis.setMajorTicks(true));
		expect(await this.page.evaluate(() => window.testAxis.majorTicks)).to.deep.equal({x: true, y: true});
	});

	test("setMinorTicks() toggles minor ticks correctly", async function () {
		await this.page.evaluate(() => window.testAxis.setMinorTicks(false));
		expect(await this.page.evaluate(() => window.testAxis.minorTicks)).to.deep.equal({x: false, y: false});
	});

	test("setMajorTickSize() sets major tick size correctly", async function () {
		await this.page.evaluate(() => window.testAxis.setMajorTickSize(10, 15));
		expect(await this.page.evaluate(() => window.testAxis.majorTickSize)).to.deep.equal({x: 10, y: 15});
	});

	test("setMinorTickSize() sets minor tick size correctly", async function () {
		await this.page.evaluate(() => window.testAxis.setMinorTickSize(2, 3));
		expect(await this.page.evaluate(() => window.testAxis.minorTickSize)).to.deep.equal({x: 2, y: 3});
	});

	test("setMajorGridlines() toggles major gridlines correctly", async function () {
		await this.page.evaluate(() => window.testAxis.setMajorGridlines(false));
		expect(await this.page.evaluate(() => window.testAxis.majorGridlines)).to.deep.equal({x: false, y: false});
	});

	test("setMinorGridlines() toggles minor gridlines correctly", async function () {
		await this.page.evaluate(() => window.testAxis.setMinorGridlines(true));
		expect(await this.page.evaluate(() => window.testAxis.minorGridlines)).to.deep.equal({x: true, y: true});
	});

	test("setMajorGridSize() sets major grid size correctly", async function () {
		await this.page.evaluate(() => window.testAxis.setMajorGridSize(10, 15));
		expect(await this.page.evaluate(() => window.testAxis.majorGridSize)).to.deep.equal({x: 10, y: 15});
	});

	test("setMinorGridSize() sets minor grid size correctly", async function () {
		await this.page.evaluate(() => window.testAxis.setMinorGridSize(2, 3));
		expect(await this.page.evaluate(() => window.testAxis.minorGridSize)).to.deep.equal({x: 2, y: 3});
	});
});
