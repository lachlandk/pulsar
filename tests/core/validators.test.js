import { suite, test } from "mocha";
import { expect } from "chai";

import { validateAxesPropertyArgs, validatePropertyArg, validateArrayPropertyArgs, validateChoicePropertyArg } from "../../build/core/validators.js";

suite("Type checking functions", function() {
	const testObject = {};

	test("validatePropertyArg() throws error when passed incorrect data", function () {
		expect(() => testObject.propertyArg = validatePropertyArg("test", "number", "propertyArg")).to.throw();
		expect(testObject.propertyArg).to.equal(undefined);
	});

	test("validatePropertyArg() sets property correctly", function () {
		testObject.propertyArg = validatePropertyArg("test", "string", "propertyArg");
		expect(testObject.propertyArg).to.equal("test");
	});

	test("validateArrayPropertyArgs() throws error when passed incorrect data", function () {
		expect(() => testObject.arrayPropertyArg = validateArrayPropertyArgs("test", "number", 3, "arrayPropertyArg")).to.throw();
		expect(() => testObject.arrayPropertyArg = validateArrayPropertyArgs([1, 2, 3], "number", 4, "arrayPropertyArg")).to.throw();
		expect(() => testObject.arrayPropertyArg = validateArrayPropertyArgs(["1", "2", "3"], "number", 3, "arrayPropertyArg")).to.throw();
		expect(testObject.arrayPropertyArg).to.equal(undefined);
	});

	test("validateArrayPropertyArgs() sets property correctly", function() {
		testObject.arrayPropertyArg = validateArrayPropertyArgs( [1, 2, 3], "number", 3, "arrayPropertyArg");
		expect(testObject.arrayPropertyArg).to.deep.equal([1, 2, 3]);
	});

	test("validateChoicePropertyArg() throws error when passed incorrect data", function () {
		expect(() => testObject.choicePropertyArg = validateChoicePropertyArg(0, [1, 2, 3], "choicePropertyArg")).to.throw();
		expect(() => testObject.choicePropertyArg = validateChoicePropertyArg("0",[1, 2, 3], "choicePropertyArg")).to.throw();
		expect(testObject.choicePropertyArg).to.equal(undefined);
	});

	test("validateChoicePropertyArg() sets property correctly", function() {
		testObject.choicePropertyArg = validateChoicePropertyArg(true, [true, false], "choicePropertyArg");
		expect(testObject.choicePropertyArg).to.equal(true);
	});

	test("validateAxesPropertyArgs() throws error when passed incorrect data", function () {
		expect(() => testObject.axesPropertyArgs = validateAxesPropertyArgs(["test"], "number", "axesPropertyArgs")).to.throw();
		expect(() => testObject.axesPropertyArgs = validateAxesPropertyArgs([1, 2, 3], "number", "axesPropertyArgs")).to.throw();
		expect(testObject.axesPropertyArgs).to.equal(undefined);
	});

	test("validateAxesPropertyArgs() sets property correctly", function() {
		testObject.axesPropertyArgs = validateAxesPropertyArgs([0, 0], "number", "axesPropertyArgs");
		expect(testObject.axesPropertyArgs).to.deep.equal({x: 0, y: 0});
		testObject.axesPropertyArgs = validateAxesPropertyArgs([1], "number", "axesPropertyArgs");
		expect(testObject.axesPropertyArgs).to.deep.equal({x: 1, y: 1});
	});
});
