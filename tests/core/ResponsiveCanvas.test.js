import { suite, test, before, after } from "mocha";
import { expect } from "chai";

import { closeTestServer, startTestServer } from "../server.js";

suite("ResponsiveCanvas class", function() {

	before(startTestServer(() => {
		window.testObject = new window.Pulsar.PulsarObject();
		testObject.style.width = "500px";
		testObject.style.height = "500px";
		document.body.appendChild(testObject);

		window.drawCalled = false;
		window.testContainer = new window.Pulsar.CanvasContainer(testObject);
		window.testCanvas = new window.Pulsar.ResponsiveCanvas(testContainer);
		window.testComponent = new window.Pulsar.Component(testCanvas, () => window.drawCalled = true);
	}));

	after(closeTestServer);

	test("ResponsiveCanvas canvas fills its container when created", async function() {
		expect(await this.page.evaluate(() => window.testContainer.clientWidth)).to.equal(await this.page.evaluate(() => window.testCanvas.canvas.width));
		expect(await this.page.evaluate(() => window.testContainer.clientHeight)).to.equal(await this.page.evaluate(() => window.testCanvas.canvas.height));
	});

	test("update() calls draw method of each component and unsets animations flag", async function () {
		await this.page.evaluate(async () => await window.testCanvas.update());
		expect(await this.page.evaluate(() => window.drawCalled)).to.equal(true);
		expect(await this.page.evaluate(() => window.testCanvas.updateFlag)).to.equal(false);
	});

	test("setBackground() sets background property and updates background style of the canvas", async function() {
		await this.page.evaluate(() => window.testCanvas.setBackground("blue"));
		expect(await this.page.evaluate(() => window.testCanvas.background)).to.equal("blue");
		expect(await this.page.evaluate(() => window.testCanvas.canvas.style.background)).to.equal("blue");
	});
});
