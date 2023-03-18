import { suite, test, before, after } from "mocha";
import { expect } from "chai";

import { startTestServer, closeTestServer } from "../server.js";

suite("CanvasContainer class", function() {

	before(startTestServer(() => {
		window.testObject = new window.Pulsar.PulsarObject();
		testObject.style.width = "100px";
		testObject.style.height = "100px";
		document.body.appendChild(testObject);

		window.testContainer = new window.Pulsar.CanvasContainer(testObject);
		window.testCanvas = new window.Pulsar.ResponsiveCanvas(testContainer);
		window.testComponent = new window.Pulsar.Component(testCanvas, () => window.drawCalled = true);
	}));

	after(closeTestServer);

	test("Constructor pushes new instance to Container array of parent object and adds it as a child element", async function () {
		expect(await this.page.evaluate(() => window.testObject.containers[0] === window.testContainer)).to.equal(true);
		expect(await this.page.evaluate(() => window.testObject.children[0] === window.testContainer)).to.equal(true);
	});

	test("When parent object is resized, container fills parent and resizes canvas", async function() {
		await this.page.evaluate(() => {
			testObject.style.width = "200px";
			testObject.style.width = "300px";
			return new Promise(resolve => setTimeout(() => resolve(), 50));
		});
		expect(await this.page.evaluate(() => window.testContainer.clientWidth)).to.equal(await this.page.evaluate(() => window.testObject.clientWidth));
		expect(await this.page.evaluate(() => window.testContainer.clientHeight)).to.equal(await this.page.evaluate(() => window.testObject.clientHeight));

		expect(await this.page.evaluate(() => window.testCanvas.canvas.width)).to.equal(await this.page.evaluate(() => window.testContainer.clientWidth));
		expect(await this.page.evaluate(() => window.testCanvas.canvas.height)).to.equal(await this.page.evaluate(() => window.testContainer.clientHeight));
	});

	test("Expanding the container stretches the limits while keeping the origin fixed (scale is not affected)", async function() {
		const origin = await this.page.evaluate(() => window.testContainer.origin);
		await this.page.evaluate(() => {
			testObject.style.width = "400px";
			testObject.style.width = "500px";
			return new Promise(resolve => setTimeout(() => resolve(), 50));
		});
		const lowerXLim = await this.page.evaluate(() => -window.testContainer.origin.x / window.testContainer.scale.x);
		const upperXLim = await this.page.evaluate(() => (window.testContainer.clientWidth - window.testContainer.origin.x) / window.testContainer.scale.x);
		const lowerYLim = await this.page.evaluate(() => -(window.testContainer.clientHeight - window.testContainer.origin.y) / window.testContainer.scale.y);
		const upperYLim = await this.page.evaluate(() => window.testContainer.origin.y / window.testContainer.scale.y);
		expect(await this.page.evaluate(() => window.testContainer.origin)).to.deep.equal(origin);
		expect(await this.page.evaluate(() => window.testContainer.xLims[0])).to.equal(lowerXLim);
		expect(await this.page.evaluate(() => window.testContainer.xLims[1])).to.equal(upperXLim);
		expect(await this.page.evaluate(() => window.testContainer.yLims[0])).to.equal(lowerYLim);
		expect(await this.page.evaluate(() => window.testContainer.yLims[1])).to.equal(upperYLim);
	});

	test("setXLims() throws error if lower limit is above or equal to upper limit", async function() {
		expect(await this.page.evaluate(() => {
			try {
				window.testContainer.setXLims(5, -5);
			} catch (_) {
				return true;
			}
			return false;
		})).to.equal(true);
	});

	test("setXLims() sets x limits correctly", async function() {
		await this.page.evaluate(() => window.testContainer.setXLims(-5, 5));
		expect(await this.page.evaluate(() => window.testContainer.xLims)).to.deep.equal([-5, 5]);
	});

	test("setYLims() throws error if lower limit is above or equal to upper limit", async function() {
		expect(await this.page.evaluate(() => {
			try {
				window.testContainer.setYLims(2, 2);
			} catch (_) {
				return true;
			}
			return false;
		})).to.equal(true);
	});

	test("setYLims() sets y limits correctly", async function() {
		await this.page.evaluate(() => window.testContainer.setYLims(-2, 2));
		expect(await this.page.evaluate(() => window.testContainer.yLims)).to.deep.equal([-2, 2]);
	});

	test("setOrigin() updates origin correctly", async function() {
		await this.page.evaluate(() => window.testContainer.setOrigin(200, 300));
		expect(await this.page.evaluate(() => window.testContainer.origin)).to.deep.equal({x: 200, y: 300});
	});

	test("setOrigin() accepts \"centre\" as as argument", async function() {
		await this.page.evaluate(() => window.testContainer.setOrigin("centre"));
		const centre = await this.page.evaluate(() => {return {x: window.testCanvas.canvas.width / 2, y: window.testCanvas.canvas.height / 2};});
		expect(await this.page.evaluate(() => window.testContainer.origin)).to.deep.equal(centre);
	});
});
