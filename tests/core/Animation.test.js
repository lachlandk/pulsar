import { suite, test, before, after } from "mocha";
import { expect } from "chai";

import { closeTestServer, startTestServer } from "../server.js";

suite("Animation class", function() {

	before(startTestServer(() => {
		window.testObject = new window.Pulsar.PulsarObject();
		document.body.appendChild(testObject);

		window.animationCalled = false;
		window.testAnimation = new window.Pulsar.Animation(testObject, () => {
			window.animationCalled = true;
		});
	}));

	after(closeTestServer);

	test("Constructor pushes Animation instance to activeAnimations array of Controller object", async function() {
		expect(await this.page.evaluate(() => window.Pulsar.Pulsar.activeAnimations[0] === window.testAnimation)).to.equal(true);
	});

	test("animate() doesn't call animation function if it has completed (time > period and repeat is set to false)", async function() {
		await this.page.evaluate(() => {
			window.animationCalled = false;
			window.noRepeatTest = new window.Pulsar.Animation(testObject, () => {
				window.animationCalled = true;
			}, {
				duration: 1000,
				repeat: false
			});
			window.noRepeatTest.animate(1001);
		});
		expect(await this.page.evaluate(() => window.animationCalled)).to.equal(false);
	});

	test("animate() calls animation function if time is greater than the period and repeat is set to true", async function() {
		await this.page.evaluate(() => {
			window.animationCalled = false;
			window.repeatTest = new window.Pulsar.Animation(testObject, () => {
				window.animationCalled = true;
			}, {
				duration: 1000,
				repeat: true
			});
			window.repeatTest.animate(1001);
		});
		expect(await this.page.evaluate(() => window.animationCalled)).to.equal(true);
	});

	test("setPeriod() sets period of animation correctly",async function() {
		await this.page.evaluate(() => window.testAnimation.setPeriod(10));
		expect(await this.page.evaluate(() => window.testAnimation.period)).to.equal(10);
	});

	test("setRepeat sets repeat toggle correctly", async function() {
		await this.page.evaluate(() => window.testAnimation.setRepeat(false));
		expect(await this.page.evaluate(() => window.testAnimation.repeat)).to.equal(false);
	});
});
