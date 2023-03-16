import { suite, test, before } from "mocha";
import { expect } from "chai";

import { Component } from "../../build/pulsar/core/Component.js";

suite("Component class", function() {

	before(function () {
		this.canvas = {
			components: [],
			updateFlag: false
		};
	});

	test("Component constructor pushes Component to canvas Components array and triggers updateFlag", function () {
		const component = new Component(this.canvas);
		expect(this.canvas.components[0]).to.deep.equal(component);
		expect(this.canvas.updateFlag).to.equal(true);
	});
});
