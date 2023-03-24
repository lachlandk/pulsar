import { suite, test, before, after } from "mocha";
import { expect } from "chai";

import { closeTestServer, startTestServer } from "../server.js";

suite("Figure class", function() {

	before(startTestServer(() => {
		window.testFigure = new window.Pulsar.Figure({
			plot: {
				origin: [100, 300]
			}
		});
		document.body.appendChild(testFigure);
	}));

	after(closeTestServer);

	test("Constructor creates a Plot with the figure instance as parent object", async function () {
		expect(await this.page.evaluate(() => window.testFigure.containers[0].parent === window.testFigure)).to.equal(true);
	});

	test("Constructor passes options under the \"plot\" property to the Plot constructor", async function () {
		expect(await this.page.evaluate(() => window.testFigure.containers[0].origin)).to.deep.equal({x: 100, y: 300});
	});
});
