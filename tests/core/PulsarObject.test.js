import { suite, test, before, after } from "mocha";
import { expect } from "chai";

import { closeTestServer, startTestServer } from "../server.js";

suite("PulsarObject class", function() {

	before(startTestServer(() => {
		window.testObject = new window.Pulsar.PulsarObject();
		document.body.appendChild(testObject);
	}));

	after(closeTestServer);

	test("Constructor pushes PulsarObject instance to activeObjects array on the controller", async function () {
		expect(await this.page.evaluate(() => window.Pulsar.Pulsar.activeObjects[0] === window.testObject)).to.equal(true);
	});

	test("hide() method sets the display to 'none'", async function() {
		await this.page.evaluate(() => window.testObject.hide());
		expect(await this.page.evaluate(() => window.testObject.style.display)).to.equal("none");
	});

	test("show() method sets the display to 'grid'", async function() {
		await this.page.evaluate(() => window.testObject.show());
		expect(await this.page.evaluate(() => window.testObject.style.display)).to.equal("grid");
	});
});
