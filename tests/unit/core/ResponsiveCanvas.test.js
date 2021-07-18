import { suite, test, before, afterEach } from "mocha";
import { JSDOM } from "jsdom";
import { expect } from "chai";
import sinon from "sinon";

import { ResponsiveCanvas, optionsObjects, activeCanvases } from "../../../build/pulsar/core/index.js";

suite("ResponsiveCanvas", function() {

	before(function() {
		global.window = new JSDOM().window;
		global.document = window.document;
		global.performance = window.performance;
		global.Element = window.Element;
		global.HTMLElement = window.HTMLElement;
		global.Event = window.Event;
		window.requestAnimationFrame = () => {};
		sinon.stub(window, "requestAnimationFrame")
			.onFirstCall().callsFake(callback => callback())
			.returns(1);
		global.ResizeObserver = class {
			observe() {}
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	test("Default properties are set correctly when no options are provided.", function() {
		const testCanvas = new ResponsiveCanvas("canvasDefaultTest");
		for (const property of Object.keys(testCanvas.properties)) {
			expect(testCanvas.properties[property]).to.deep.equal(optionsObjects.ResponsiveCanvas[property]);
		}
	});

	test("When 'origin' option is provided the property is set correctly", function() {
		const testCanvas = new ResponsiveCanvas("originOptionTest", {
			origin: [1, 1]
		});
		expect(testCanvas.properties.origin).to.deep.equal({x: 1, y: 1});
		const testCanvas2 = new ResponsiveCanvas("originOptionTest2", {
			origin: 2
		});
		expect(testCanvas2.properties.origin).to.deep.equal({x: 2, y: 2});
		const testCanvas3 = new ResponsiveCanvas("originOptionTest3", {
			origin: "centre"
		});
		expect(testCanvas3.properties.origin).to.deep.equal({x: 0, y: 0});
	});

	test("When 'backgroundCSS' option is provided the option is set correctly", function() {
		const testCanvas = new ResponsiveCanvas("backgroundCSSOptionTest", {
			backgroundCSS: "red"
		});
		expect(testCanvas.properties.backgroundCSS).to.equal("red");
	});

	test("_updateCanvasDimensions() calls _updateBackground() and _updateForeground()", function() {
		const testCanvas = new ResponsiveCanvas("_updateCanvasDimensionsTest");
		testCanvas._displayData.containerElement = document.createElement("div");
		const _updateBackgroundSpy = sinon.spy(testCanvas, "_updateBackground");
		const _updateForegroundSpy = sinon.spy(testCanvas, "_updateForeground");
		const backgroundTranslateSpy = sinon.spy(testCanvas._displayData.background, "translate");
		const foregroundTranslateSpy = sinon.spy(testCanvas._displayData.foreground, "translate");
		testCanvas._updateCanvasDimensions();
		expect(_updateBackgroundSpy.calledOnce).to.equal(true);
		expect(_updateForegroundSpy.calledOnce).to.equal(true);
		expect(backgroundTranslateSpy.calledOnce).to.equal(true);
		expect(foregroundTranslateSpy.calledWith(testCanvas.properties.origin.x, testCanvas.properties.origin.y)).to.equal(true);
		expect(backgroundTranslateSpy.calledOnce).to.equal(true);
		expect(foregroundTranslateSpy.calledWith(testCanvas.properties.origin.x, testCanvas.properties.origin.y)).to.equal(true);
	});

	test("_updateBackground() calls the background drawing function once with the background canvas context and the current time value", function() {
		const testCanvas = new ResponsiveCanvas("_updateBackgroundTest");
		const backgroundFunctionSpy = sinon.spy(testCanvas._displayData, "backgroundFunction");
		testCanvas._updateBackground();
		expect(backgroundFunctionSpy.calledOnce).to.equal(true);
		expect(backgroundFunctionSpy.calledWith(testCanvas._displayData.background, testCanvas._timeEvolutionData.currentTimeValue)).to.equal(true);
	});

	test("_updateForeground() calls the foreground drawing function once with the foreground canvas context and the current time value", function() {
		const testCanvas = new ResponsiveCanvas("_updateForegroundTest");
		const foregroundFunctionSpy = sinon.spy(testCanvas._displayData, "foregroundFunction");
		testCanvas._updateForeground();
		expect(foregroundFunctionSpy.calledOnce).to.equal(true);
		expect(foregroundFunctionSpy.calledWith(testCanvas._displayData.foreground, testCanvas._timeEvolutionData.currentTimeValue)).to.equal(true);
	});

	test("setBackground() changes the background drawing function and calls _updateBackground()", function() {
		const testCanvas = new ResponsiveCanvas("setBackgroundTest");
		const spy = sinon.spy(testCanvas, "_updateBackground");
		testCanvas.setBackground(() => "test");
		expect(testCanvas._displayData.backgroundFunction()).to.equal("test");
		expect(spy.calledOnce).to.equal(true);
	});

	test("setForeground() changes the foreground drawing function and calls _updateForeground()", function() {
		const testCanvas = new ResponsiveCanvas("setForegroundTest");
		const spy = sinon.spy(testCanvas, "_updateForeground");
		testCanvas.setForeground(() => "test");
		expect(testCanvas._displayData.foregroundFunction()).to.equal("test");
		expect(spy.calledOnce).to.equal(true);
	});

	test("setID() sets the ID of the ResponsiveCanvas instance, adds it to the activeCanvases object, and removes the old ID reference", function() {
		const testCanvas = new ResponsiveCanvas("setIDTest");
		testCanvas.setID("setIDTest2");
		expect(testCanvas.id).to.equal("setIDTest2");
		expect(activeCanvases.setIDTest2).to.deep.equal(testCanvas);
		expect(activeCanvases.setIDTest).to.equal(undefined);
	});

	test("setID() throws an error when the user tries to set the ID to one of an already existing ResponsiveCanvas instance", function() {
		expect(()=> new ResponsiveCanvas("setIDTest2")).to.throw();
	});

	test("setOrigin() sets the origin property correctly and caches the argument passed to it", function() {
		const testCanvas = new ResponsiveCanvas("setOriginTest");
		testCanvas.setOrigin(100);
		expect(testCanvas.properties.origin).to.deep.equal({x: 100, y: 100});
		expect(testCanvas._displayData.originArgCache).to.deep.equal([100]);
		testCanvas.setOrigin(200, 200);
		expect(testCanvas.properties.origin).to.deep.equal({x: 200, y: 200});
		expect(testCanvas._displayData.originArgCache).to.deep.equal([200, 200]);
		testCanvas._displayData.width = 500;
		testCanvas._displayData.height = 500;
		testCanvas.setOrigin("centre");
		expect(testCanvas.properties.origin).to.deep.equal({x: 250, y: 250});
		expect(testCanvas._displayData.originArgCache).to.deep.equal(["centre"]);
	});

	test("setBackgroundCSS() sets the backgroundCSS property and the background style attribute of the background canvas", function() {
		const testCanvas = new ResponsiveCanvas("setBackgroundCSSTest");
		testCanvas.setBackgroundCSS("blue");
		expect(testCanvas.properties.backgroundCSS).to.equal("blue");
		expect(testCanvas._displayData.backgroundCanvas.style.background).to.equal("blue");
	});

	test("startTime() sets timeEvolutionActive to true, sets the startTimestamp and calls requestAnimationFrame with _updateTime() as a callback", function() {
		const testCanvas = new ResponsiveCanvas("startTimeTest");
		testCanvas.startTime();
		expect(testCanvas._timeEvolutionData.timeEvolutionActive).to.equal(true);
		expect(testCanvas._timeEvolutionData.startTimestampMS).to.not.equal(0);
	});

	test("_updateTime() sets currentTimeValue in seconds, calls background and foreground update functions and calls requestAnimationFrame again", function() {
		const testCanvas = new ResponsiveCanvas("_updateTimeTest");
		const _updateBackgroundSpy = sinon.spy(testCanvas, "_updateBackground");
		const _updateForegroundSpy = sinon.spy(testCanvas, "_updateForeground");
		testCanvas._timeEvolutionData.timeEvolutionActive = true;
		testCanvas._timeEvolutionData.offsetTimestampMS = 1000;
		testCanvas._updateTime(2000);
		expect(testCanvas._timeEvolutionData.currentTimeValue).to.equal(3);
		expect(_updateBackgroundSpy.calledOnce).to.equal(true);
		expect(_updateForegroundSpy.calledOnce).to.equal(true);
	});

	test("pauseTime() sets timeEvolutionActive to false and records how long since time evolution was started", function() {
		const testCanvas = new ResponsiveCanvas("pauseTimeTest");
		testCanvas._timeEvolutionData.timeEvolutionActive = true;
		testCanvas.pauseTime();
		expect(testCanvas._timeEvolutionData.timeEvolutionActive).to.equal(false);
		expect(testCanvas._timeEvolutionData.offsetTimestampMS).to.not.equal(0);
	});

	test("stopTime() sets timeEvolutionActive to false, resets all timestamps to 0 and calls background and foreground update functions", function() {
		const testCanvas = new ResponsiveCanvas("stopTimeTest");
		const _updateBackgroundSpy = sinon.spy(testCanvas, "_updateBackground");
		const _updateForegroundSpy = sinon.spy(testCanvas, "_updateForeground");
		testCanvas._timeEvolutionData.timeEvolutionActive = true;
		testCanvas.stopTime();
		expect(testCanvas._timeEvolutionData.timeEvolutionActive).to.equal(false);
		expect(testCanvas._timeEvolutionData.startTimestampMS).to.equal(0);
		expect(testCanvas._timeEvolutionData.offsetTimestampMS).to.equal(0);
		expect(testCanvas._timeEvolutionData.currentTimeValue).to.equal(0);
		expect(_updateBackgroundSpy.calledOnce).to.equal(true);
		expect(_updateForegroundSpy.calledOnce).to.equal(true);
	});

	test("setConstant() sets the value of the specified constant on the ResponsiveCanvas instance to the value provided", function() {
		const testCanvas = new ResponsiveCanvas("setConstantTest");
		testCanvas.setConstant("a", 1);
		expect(testCanvas.constants.a).to.equal(1);
	});

	test("connectElementAttribute() accepts an element as a querySelector, and adds an event listener to the specified event for the specified attribute which sets the attribute value to the specified constant after calling the transform", function() {
		const testCanvas = new ResponsiveCanvas("connectElementAttributeTest");
		const testElement = document.createElement("input");
		const testValue = Math.floor(Math.random() * 10);
		const testTransform = x => 2*x;
		testElement.value = `${testValue}`;
		sinon.stub(document, "querySelector")
			.returns(testElement);
		testCanvas.connectElementAttribute("testElement", "input", "value", "a", testTransform);
		testElement.dispatchEvent(new Event("input"));
		expect(testCanvas.constants.a).to.equal(testTransform(testValue));
	});

	test("connectElementAttribute() accepts an element by reference, and adds an event listener to the specified event for the specified attribute which sets the attribute value to the specified constant after calling the transform", function() {
		const testCanvas = new ResponsiveCanvas("connectElementAttributeTest2");
		const testElement = document.createElement("input");
		const testValue = Math.floor(Math.random() * 10);
		const testTransform = x => x**2;
		testElement.value = `${testValue}`;
		testCanvas.connectElementAttribute(testElement, "input", "value", "a", testTransform);
		testElement.dispatchEvent(new Event("input"));
		expect(testCanvas.constants.a).to.equal(testTransform(testValue));
	});

	test("connectElementAttribute() throws an error if the specified element could not be found or was not valid", function() {
		const testCanvas = new ResponsiveCanvas("connectElementAttributeTest3");
		sinon.stub(document, "querySelector")
			.throws();
		expect(() => testCanvas.connectElementAttribute("null", "input", "value", "a")).to.throw();
		expect(() => testCanvas.connectElementAttribute(null, "input", "value", "a")).to.throw();
	});

	test("show() accepts a container element as a querySelector, sets container position to relative, sets width/height to the clientWidth/clientHeight of container, observes the container and sets the origin", function() {
		const testCanvas = new ResponsiveCanvas("showTest");
		const testElement = document.createElement("div");
		const observeSpy = sinon.spy(testCanvas._displayData.resizeObserver, "observe");
		const setOriginSpy = sinon.spy(testCanvas, "setOrigin");
		sinon.stub(document, "querySelector")
			.returns(testElement);
		testCanvas.show("testElement");
		expect(testCanvas._displayData.containerElement).to.equal(testElement);
		expect(testElement.style.position).to.equal("relative");
		expect(testElement.children.item(0)).to.equal(testCanvas._displayData.backgroundCanvas);
		expect(testElement.children.item(1)).to.equal(testCanvas._displayData.foregroundCanvas);
		expect(testCanvas._displayData.width).to.equal(0);
		expect(testCanvas._displayData.height).to.equal(0);
		expect(observeSpy.calledOnce).to.equal(true);
		expect(observeSpy.calledWith(testElement)).to.equal(true);
		expect(setOriginSpy.calledOnce).to.equal(true);
	});

	test("show() accepts a container element by reference, sets container position to relative, sets width/height to the clientWidth/clientHeight of container, observes the container and sets the origin", function() {
		const testCanvas = new ResponsiveCanvas("showTest2");
		const testElement = document.createElement("div");
		const observeSpy = sinon.spy(testCanvas._displayData.resizeObserver, "observe");
		const setOriginSpy = sinon.spy(testCanvas, "setOrigin");
		testCanvas.show(testElement);
		expect(testCanvas._displayData.containerElement).to.equal(testElement);
		expect(testElement.style.position).to.equal("relative");
		expect(testElement.children.item(0)).to.equal(testCanvas._displayData.backgroundCanvas);
		expect(testElement.children.item(1)).to.equal(testCanvas._displayData.foregroundCanvas);
		expect(testCanvas._displayData.width).to.equal(0);
		expect(testCanvas._displayData.height).to.equal(0);
		expect(observeSpy.calledOnce).to.equal(true);
		expect(observeSpy.calledWith(testElement)).to.equal(true);
		expect(setOriginSpy.calledOnce).to.equal(true);
	});

	test("show() throws and error if the specified element could not be found or was not valid", function() {
		const testCanvas = new ResponsiveCanvas("showTest3");
		sinon.stub(document, "querySelector")
			.throws();
		expect(() => testCanvas.show("null")).to.throw();
	});
});
