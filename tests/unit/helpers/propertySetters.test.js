import { suite, test } from "mocha";
import { expect } from "chai";

import { propertySetters } from "../../../build/pulsar/helpers/index.js";

suite("Property setters", function() {
	const testObject = {
		properties: {}
	};

	test("setSingleProperty() throws error when passed incorrect data", function () {
		expect(() => propertySetters.setSingleProperty(testObject, "singlePropertyTest", "number", "test")).to.throw();
		expect(testObject.properties.singlePropertyTest).to.equal(undefined);
	});

	test("setSingleProperty() sets property correctly", function () {
		propertySetters.setSingleProperty(testObject, "singlePropertyTest", "string", "test");
		expect(testObject.properties.singlePropertyTest).to.equal("test");
	});

	test("setArrayProperty() throws error when passed incorrect data", function () {
		expect(() => propertySetters.setArrayProperty(testObject, "arrayPropertyTest", "number", "test", 3)).to.throw();
		expect(() => propertySetters.setArrayProperty(testObject, "arrayPropertyTest", "number", [1, 2, 3], 4)).to.throw();
		expect(() => propertySetters.setArrayProperty(testObject, "arrayPropertyTest", "number", ["1", "2", "3"], 3)).to.throw();
		expect(testObject.properties.arrayPropertyTest).to.equal(undefined);
	});

	test("setArrayProperty() sets property correctly", function() {
		propertySetters.setArrayProperty(testObject, "arrayPropertyTest", "number", [1, 2, 3], 3);
		expect(testObject.properties.arrayPropertyTest).to.deep.equal([1, 2, 3]);
	});

	test("setChoiceProperty() throws error when passed incorrect data", function () {
		expect(() => propertySetters.setChoiceProperty(testObject, "choicePropertyTest", "number", 0, [1, 2, 3])).to.throw();
		expect(() => propertySetters.setChoiceProperty(testObject, "choicePropertyTest", "number", "0", [1, 2, 3])).to.throw();
		expect(testObject.properties.choicePropertyTest).to.equal(undefined);
	});

	test("setChoiceProperty() sets property correctly", function() {
		propertySetters.setChoiceProperty(testObject, "choicePropertyTest", "boolean", true, [true, false]);
		expect(testObject.properties.choicePropertyTest).to.equal(true);
	});

	test("setAxesProperty() throws error when passed incorrect data", function () {
		expect(() => propertySetters.setAxesProperty(testObject, "axesPropertyTest", "number", "test")).to.throw();
		expect(() => propertySetters.setAxesProperty(testObject, "axesPropertyTest", "number", 1, 2, 3)).to.throw();
		expect(testObject.properties.axesPropertyTest).to.equal(undefined);
	});

	test("setAxesProperty() sets property correctly", function() {
		propertySetters.setAxesProperty(testObject, "axesPropertyTest", "number", 0, 0);
		expect(testObject.properties.axesPropertyTest).to.deep.equal({x: 0, y: 0});
		propertySetters.setAxesProperty(testObject, "axesPropertyTest", "number", 1);
		expect(testObject.properties.axesPropertyTest).to.deep.equal({x: 1, y: 1});
	});
});
