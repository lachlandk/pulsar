import { suite, test, before, after } from "mocha";
import { expect } from "chai";

import { startTestServer, closeTestServer } from "../server.js";

suite("Controller object", function() {

	before(startTestServer(() => {
		window.testObject = new window.Pulsar.PulsarObject();
		document.body.appendChild(testObject);

		window.testContainer = new window.Pulsar.CanvasContainer(testObject);
		window.testCanvas = new window.Pulsar.ResponsiveCanvas(testContainer);

		window.animationCalled = false;
		window.animationTimestamp = 0;
		window.testAnimation = new window.Pulsar.Animation(testObject, time => {
			window.animationCalled = true;
			window.animationTimestamp = time;
		});
	}));

	after(closeTestServer);

	test("Only 1 instance of Controller can exist (creating a new instance returns the existing instance)", async function() {
		expect(await this.page.evaluate(() => {
			const duplicateController = new window.Pulsar.Pulsar.constructor();
			return duplicateController === window.Pulsar.Pulsar;
		})).to.equal(true);
	});

	test("start() starts all animations and sets startTimestamp", async function() {
		await this.page.evaluate(() => window.Pulsar.Pulsar.start());
		expect(await this.page.evaluate(() => window.Pulsar.Pulsar.animationsActive)).to.equal(true);
		expect(await this.page.evaluate(() => window.Pulsar.Pulsar.startTimestamp)).to.be.above(0);
	});

	test("stop() stops all animations and resets animation progress to 0", async function() {
		await this.page.evaluate(async () => {
			window.Pulsar.Pulsar.start();
			await new Promise(resolve => setTimeout(() => resolve(), 20));
			window.Pulsar.Pulsar.stop();
		});
		expect(await this.page.evaluate(() => window.Pulsar.Pulsar.animationsActive)).to.equal(false);
		expect(await this.page.evaluate(() => window.animationTimestamp)).to.equal(0);
	});

	test("pause() stops all animations and sets offsetTimestamp", async function() {
		await this.page.evaluate(async () => {
			window.Pulsar.Pulsar.start();
			await new Promise(resolve => setTimeout(() => resolve(), 20));
			window.Pulsar.Pulsar.pause();
		});
		expect(await this.page.evaluate(() => window.Pulsar.Pulsar.animationsActive)).to.equal(false);
		expect(await this.page.evaluate(() => window.animationTimestamp)).to.be.above(0);
	});

	test("update() updates all canvases that have updateFlag set to true", async function() {
		await this.page.evaluate(() => {
			window.testCanvas.updateFlag = true;
			return new Promise(resolve => setTimeout(() => resolve(), 20));
		});
		expect(await this.page.evaluate(() => window.testCanvas.updateFlag)).to.equal(false);
	});

	test("If animationsActive is set to true, update() calls all animation functions with current timestamp", async function() {
		await this.page.evaluate(() => {
			window.animationCalled = false;
			window.Pulsar.Pulsar.start();
			return new Promise(resolve => setTimeout(() => resolve(), 20));
		});
		expect(await this.page.evaluate(() => window.animationCalled)).to.equal(true);
		expect(await this.page.evaluate(() => window.animationTimestamp)).to.be.above(0);
	});

	test("If the parent object associated with a canvas is hidden, the canvas should not be updated", async function() {
		await this.page.evaluate(() => {
			window.testObject.hide();
			window.testCanvas.updateFlag = true;
			return new Promise(resolve => setTimeout(() => resolve(), 20));
		});
		expect(await this.page.evaluate(() => window.testCanvas.updateFlag)).to.equal(true);
		await this.page.evaluate(() => window.testObject.show());
	});

	test("If the parent object associated with a canvas is not in the DOM, the canvas should not be updated", async function() {
		await this.page.evaluate(() => {
			window.testObject.remove();
			window.testCanvas.updateFlag = true;
			return new Promise(resolve => setTimeout(() => resolve(), 20));
		});
		expect(await this.page.evaluate(() => window.testCanvas.updateFlag)).to.equal(true);
		await this.page.evaluate(() => document.body.appendChild(testObject));
	});

	test("If the parent object associated with an animation is hidden, it should not play", async function() {
		await this.page.evaluate(() => {
			window.testObject.hide();
			window.animationCalled = false;
			window.Pulsar.Pulsar.start();
			return new Promise(resolve => setTimeout(() => resolve(), 20));
		});
		expect(await this.page.evaluate(() => window.animationCalled)).to.equal(false);
		await this.page.evaluate(() => window.testObject.show());
	});

	test("If the parent object associated with an animation is not in the DOM, it should not play", async function() {
		await this.page.evaluate(() => {
			window.testObject.remove();
			window.animationCalled = false;
			window.Pulsar.Pulsar.start();
			return new Promise(resolve => setTimeout(() => resolve(), 20));
		});
		expect(await this.page.evaluate(() => window.animationCalled)).to.equal(false);
		await this.page.evaluate(() => document.body.appendChild(testObject));
	});
});
