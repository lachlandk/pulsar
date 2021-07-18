import { suite, test, before, afterEach } from "mocha";
import { JSDOM } from "jsdom";
import { expect } from "chai";
import sinon from "sinon";

import { ResponsivePlot2D, optionsObjects } from "../../../build/pulsar/core/index.js";

suite("ResponsivePlot2D", function() {

	before(() => {
		global.window = new JSDOM().window;
		global.document = window.document;
		global.ResizeObserver = class {
			observe() {}
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	test("Default properties are set correctly when no options are specified", function() {
		const testPlot = new ResponsivePlot2D("plotDefaultTest");
		for (const property of Object.keys(testPlot.properties)) {
			if (Object.keys(optionsObjects.ResponsivePlot2D).includes(property)) {
				expect(testPlot.properties[property]).to.deep.equal(optionsObjects.ResponsivePlot2D[property]);
			}
		}
	});

	test("When 'majorTicks' option is provided the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("majorTicksTest", {
			majorTicks: [false, true]
		});
		expect(testPlot.properties.majorTicks).to.deep.equal({x: false, y: true});
		const testPlot2 = new ResponsivePlot2D("majorTicksTest2", {
			majorTicks: false
		});
		expect(testPlot2.properties.majorTicks).to.deep.equal({x: false, y: false});
	});

	test("When 'minorTicks' option is provided the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("minorTicksTest", {
			minorTicks: [true, false]
		});
		expect(testPlot.properties.minorTicks).to.deep.equal({x: true, y: false});
		const testPlot2 = new ResponsivePlot2D("minorTicksTest2", {
			minorTicks: true
		});
		expect(testPlot2.properties.minorTicks).to.deep.equal({x: true, y: true});
	});

	test("When 'majorTickSize' option is provided the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("majorTickSizeTest", {
			majorTickSize: [10, 30]
		});
		expect(testPlot.properties.majorTickSize).to.deep.equal({x: 10, y: 30});
		const testPlot2 = new ResponsivePlot2D("majorTickSizeTest2", {
			majorTickSize: 100
		});
		expect(testPlot2.properties.majorTickSize).to.deep.equal({x: 100, y: 100});
	});

	test("When 'minorTickSize' option is provided the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("minorTickSizeTest", {
			minorTickSize: [20, 10]
		});
		expect(testPlot.properties.minorTickSize).to.deep.equal({x: 20, y: 10});
		const testPlot2 = new ResponsivePlot2D("minorTickSizeTest2", {
			minorTickSize: 50
		});
		expect(testPlot2.properties.minorTickSize).to.deep.equal({x: 50, y: 50});
	});

	test("When 'majorGridlines' option is provided the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("majorGridlinesTest", {
			majorGridlines: [false, true]
		});
		expect(testPlot.properties.majorGridlines).to.deep.equal({x: false, y: true});
		const testPlot2 = new ResponsivePlot2D("majorGridlinesTest2", {
			majorGridlines: false
		});
		expect(testPlot2.properties.majorGridlines).to.deep.equal({x: false, y: false});
	});

	test("When 'minorGridlines' option is provided the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("minorGridlinesTest", {
			minorGridlines: [true, false]
		});
		expect(testPlot.properties.minorGridlines).to.deep.equal({x: true, y: false});
		const testPlot2 = new ResponsivePlot2D("minorGridlinesTest2", {
			minorGridlines: true
		});
		expect(testPlot2.properties.minorGridlines).to.deep.equal({x: true, y: true});
	});

	test("When 'majorGridSize' option is provided the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("majorGridSizeTest", {
			majorGridSize: [10, 30]
		});
		expect(testPlot.properties.majorGridSize).to.deep.equal({x: 10, y: 30});
		const testPlot2 = new ResponsivePlot2D("majorGridSizeTest2", {
			majorGridSize: 100
		});
		expect(testPlot2.properties.majorGridSize).to.deep.equal({x: 100, y: 100});
	});

	test("When 'minorGridSize' option is provided the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("minorGridSizeTest", {
			minorGridSize: [20, 10]
		});
		expect(testPlot.properties.minorGridSize).to.deep.equal({x: 20, y: 10});
		const testPlot2 = new ResponsivePlot2D("minorGridSizeTest2", {
			minorGridSize: 50
		});
		expect(testPlot2.properties.minorGridSize).to.deep.equal({x: 50, y: 50});
	});

	test("When 'gridScale' option is provided the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("gridScaleTest", {
			gridScale: [100, 200]
		});
		expect(testPlot.properties.gridScale).to.deep.equal({x: 100, y: 200});
		const testPlot2 = new ResponsivePlot2D("gridScaleTest2", {
			gridScale: 500
		});
		expect(testPlot2.properties.gridScale).to.deep.equal({x: 500, y: 500});
	});

	test("'xLims' property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("xLimsTest");
		expect(testPlot.properties.xLims).to.deep.equal([-0, 0]);
	});

	test("'yLims' property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("yLimsTest");
		expect(testPlot.properties.yLims).to.deep.equal([-0, 0]);
	});

	test("_updateLimits()", function() {
		const testPlot = new ResponsivePlot2D("_updateLimitsTest", {
			origin: [250, 250],
			gridScale: [10, 20]
		});
		testPlot._displayData.width = 500;
		testPlot._displayData.height = 500;
		testPlot._updateLimits();
		expect(testPlot.properties.xLims).to.deep.equal([-250 / 10, (500 - 250) / 10]);
		expect(testPlot.properties.yLims).to.deep.equal([-250 / 20, (500 - 250) / 20]);
	});

	test("_updatePlottingData() calls setForeground()", function() {
		const testPlot = new ResponsivePlot2D("_updatePlottingDataTest");
		const setForegroundSpy = sinon.spy(testPlot, "setForeground");
		testPlot._updatePlottingData();
		expect(setForegroundSpy.calledOnce).to.equal(true);
	});

	test("plot() with continuous function sets the data correctly and throws an error if the function returns non-numeric values", function() {
		const testPlot = new ResponsivePlot2D("plotTest");
		const _updatePlottingDataSpy = sinon.spy(testPlot, "_updatePlottingData");
		testPlot.plot("test", x => x**2);
		expect(_updatePlottingDataSpy.calledOnce).to.equal(true);
		const generator = testPlot.plotData.test.data(0, [0, 10], [0, 100], 1, [0, 0]);
		let index = -1;
		for (const point of generator) {
			expect(point).to.deep.equal([index, index**2]);
			index++;
		}
		expect(() => testPlot.plot("test2", _ => "test")).to.throw();
	});

	test("plot() with parametric function sets the data correctly and throws an error if the functions return non-numeric values", function() {
		const testPlot = new ResponsivePlot2D("plotTest2");
		const _updatePlottingDataSpy = sinon.spy(testPlot, "_updatePlottingData");
		testPlot.plot("test", [p => Math.cos(p), p => Math.sin(p)]);
		expect(_updatePlottingDataSpy.calledOnce).to.equal(true);
		const generator = testPlot.plotData.test.data(0, [-1, 1], [-1, 1], 1, [0, 10]);
		let index = 0;
		for (const point of generator) {
			expect(point).to.deep.equal([Math.cos(index), Math.sin(index)]);
			index++;
		}
		expect(() => testPlot.plot("test2", [_ => "test", _ => 0])).to.throw();
		expect(() => testPlot.plot("test2", [_ => 0, _ => "test"])).to.throw();
	});

	test("plot() with a discrete map sets the data correctly and throws an error if the array elements or the function returns non-numeric values", function() {
		const testPlot = new ResponsivePlot2D("plotTest3");
		const _updatePlottingDataSpy = sinon.spy(testPlot, "_updatePlottingData");
		testPlot.plot("test", [
			[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			x => 2*x
		]);
		expect(_updatePlottingDataSpy.calledOnce).to.equal(true);
		const generator = testPlot.plotData.test.data(0, [0, 10], [0, 20], 0, [0, 0]);
		let index = 0;
		for (const point of generator) {
			expect(point).to.deep.equal([index, index*2]);
			index++;
		}
		expect(() => testPlot.plot("test2", [[0], _ => "test"])).to.throw();
		expect(() => testPlot.plot("test2", [["test"], x => 2*x])).to.throw();
	});

	test("plot() with discrete points sets the data correctly and throws an error if the array elements return non-numeric values", function() {
		const testPlot = new ResponsivePlot2D("plotTest4");
		const _updatePlottingDataSpy = sinon.spy(testPlot, "_updatePlottingData");
		testPlot.plot("test", [
			[0, 1, 2, _ => 3],
			[x => x+3, 4, _ => 5, 6]
		]);
		expect(_updatePlottingDataSpy.calledOnce).to.equal(true);
		const generator = testPlot.plotData.test.data(0, [0, 3], [0, 6], 0, [0, 0]);
		let index = 0;
		for (const point of generator) {
			expect(point).to.deep.equal([index, index+3]);
			index++;
		}
		expect(() => testPlot.plot("test2", [[""], [0]])).to.throw();
		expect(() => testPlot.plot("test2", [[0], [""]])).to.throw();
	});

	test("plot() throws an error if an unsupported signature is passed for the data", function() {
		const testPlot = new ResponsivePlot2D("plotTest5");
		expect(() => testPlot.plot("test", "")).to.throw();
		expect(() => testPlot.plot("test", undefined)).to.throw();
		expect(() => testPlot.plot("test", [])).to.throw();
	});

	test("plot() throws an error if the trace ID passed matches an already existing one on the current plot", function() {
		const testPlot = new ResponsivePlot2D("plotTest6");
		testPlot.plot("test", x => x);
		expect(() => testPlot.plot("test", x => 2*x)).to.throw();
	});

	test("plot() sets the default properties of the data trace correctly when no options are specified", function() {
		const testPlot = new ResponsivePlot2D("plotTraceDefaultTest");
		testPlot.plot("test", x => x);
		for (const property of Object.keys(testPlot.plotData.test.properties)) {
			expect(testPlot.plotData.test.properties[property]).to.deep.equal(optionsObjects.ResponsivePlot2DTrace[property]);
		}
	});

	test("When 'traceColour' option is provided to plot() the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("traceColourTest");
		testPlot.plot("test", x => x, {
			traceColour: "red"
		});
		expect(testPlot.plotData.test.properties.traceColour).to.equal("red");
	});

	test("When 'traceStyle' option is provided to plot() the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("traceStyleTest");
		testPlot.plot("test", x => x, {
			traceStyle: "dashdot"
		});
		expect(testPlot.plotData.test.properties.traceStyle).to.equal("dashdot");
	});

	test("When 'traceWidth' option is provided to plot() the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("traceWidthTest");
		testPlot.plot("test", x => x, {
			traceWidth: 5
		});
		expect(testPlot.plotData.test.properties.traceWidth).to.equal(5);
	});

	test("When 'markerColour' option is provided to plot() the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("markerColourTest");
		testPlot.plot("test", x => x, {
			markerColour: "green"
		});
		expect(testPlot.plotData.test.properties.markerColour).to.equal("green");
	});

	test("When 'markerStyle' option is provided to plot() the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("markerStyleTest");
		testPlot.plot("test", x => x, {
			markerStyle: "circle"
		});
		expect(testPlot.plotData.test.properties.markerStyle).to.equal("circle");
	});

	test("When 'markerSize' option is provided to plot() the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("markerSizeTest");
		testPlot.plot("test", x => x, {
			markerSize: 10
		});
		expect(testPlot.plotData.test.properties.markerSize).to.equal(10);
	});

	test("When 'visibility' option is provided to plot() the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("visibilityTest");
		testPlot.plot("test", x => x, {
			visibility: false
		});
		expect(testPlot.plotData.test.properties.visibility).to.equal(false);
	});

	test("When 'parameterRange' option is provided to plot() the property is set correctly", function() {
		const testPlot = new ResponsivePlot2D("parameterRangeTest");
		testPlot.plot("test", x => x, {
			parameterRange: [0, 2*Math.PI]
		});
		expect(testPlot.plotData.test.properties.parameterRange).to.deep.equal([0, 2*Math.PI]);
	});

	test("removeData() removes a trace from plotData and calls _updatePlottingData()", function() {
		const testPlot = new ResponsivePlot2D("removeDataTest");
		testPlot.plot("test", x => x);
		const _updatePlottingDataSpy = sinon.spy(testPlot, "_updatePlottingData");
		testPlot.removeData("test");
		expect(testPlot.plotData.test).to.equal(undefined);
		expect(_updatePlottingDataSpy.calledOnce).to.equal(true);
	});

	test("setOrigin() calls _updateLimits()", function() {
		const testPlot = new ResponsivePlot2D("setOriginOverloadTest");
		const _updateLimitsSpy = sinon.spy(testPlot, "_updateLimits");
		testPlot.setOrigin("centre");
		expect(_updateLimitsSpy.calledOnce).to.equal(true);
	});

	test("setMajorTicks() sets property correctly", function() {
		const testPlot = new ResponsivePlot2D("setMajorTicksTest");
		testPlot.setMajorTicks(false);
		expect(testPlot.properties.majorTicks).to.deep.equal({x: false, y: false});
		testPlot.setMajorTicks(false, true);
		expect(testPlot.properties.majorTicks).to.deep.equal({x: false, y: true});
	});

	test("setMinorTicks() sets property correctly", function() {
		const testPlot = new ResponsivePlot2D("setMinorTicksTest");
		testPlot.setMinorTicks(true);
		expect(testPlot.properties.minorTicks).to.deep.equal({x: true, y: true});
		testPlot.setMinorTicks(true, false);
		expect(testPlot.properties.minorTicks).to.deep.equal({x: true, y: false});
	});

	test("setMajorTickSize() sets property correctly", function() {
		const testPlot = new ResponsivePlot2D("setMajorTickSizeTest");
		testPlot.setMajorTickSize(10);
		expect(testPlot.properties.majorTickSize).to.deep.equal({x: 10, y: 10});
		testPlot.setMajorTickSize(20, 30);
		expect(testPlot.properties.majorTickSize).to.deep.equal({x: 20, y: 30});
	});

	test("setMinorTickSize() sets property correctly", function() {
		const testPlot = new ResponsivePlot2D("setMinorTickSizeTest");
		testPlot.setMinorTickSize(10);
		expect(testPlot.properties.minorTickSize).to.deep.equal({x: 10, y: 10});
		testPlot.setMinorTickSize(30, 20);
		expect(testPlot.properties.minorTickSize).to.deep.equal({x: 30, y: 20});
	});

	test("setMajorGridlines() sets property correctly", function() {
		const testPlot = new ResponsivePlot2D("setMajorGridlinesTest");
		testPlot.setMajorGridlines(false);
		expect(testPlot.properties.majorGridlines).to.deep.equal({x: false, y: false});
		testPlot.setMajorGridlines(true, false);
		expect(testPlot.properties.majorGridlines).to.deep.equal({x: true, y: false});
	});

	test("setMinorGridlines() sets property correctly", function() {
		const testPlot = new ResponsivePlot2D("setMinorGridlinesTest");
		testPlot.setMinorGridlines(true);
		expect(testPlot.properties.minorGridlines).to.deep.equal({x: true, y: true});
		testPlot.setMinorGridlines(false, true);
		expect(testPlot.properties.minorGridlines).to.deep.equal({x: false, y: true});
	});

	test("setMajorGridSize() sets property correctly", function() {
		const testPlot = new ResponsivePlot2D("setMajorGridSizeTest");
		testPlot.setMajorGridSize(10);
		expect(testPlot.properties.majorGridSize).to.deep.equal({x: 10, y: 10});
		testPlot.setMajorGridSize(20, 30);
		expect(testPlot.properties.majorGridSize).to.deep.equal({x: 20, y: 30});
	});

	test("setMinorGridSize() sets property correctly", function() {
		const testPlot = new ResponsivePlot2D("setMinorGridSizeTest");
		testPlot.setMinorGridSize(10);
		expect(testPlot.properties.minorGridSize).to.deep.equal({x: 10, y: 10});
		testPlot.setMinorGridSize(30, 20);
		expect(testPlot.properties.minorGridSize).to.deep.equal({x: 30, y: 20});
	});

	test("setGridScale() sets property correctly", function() {
		const testPlot = new ResponsivePlot2D("setGridScaleTest");
		testPlot.setGridScale(25);
		expect(testPlot.properties.gridScale).to.deep.equal({x: 25, y: 25});
		testPlot.setGridScale(100, 200);
		expect(testPlot.properties.gridScale).to.deep.equal({x: 100, y: 200});
	});

	test("setXLims() sets property correctly", function() {
		const testPlot = new ResponsivePlot2D("setXLimsTest");
		testPlot.setXLims(-25, 25);
		expect(testPlot.properties.xLims).to.deep.equal([-25, 25]);
	});

	test("setXLims() throws an error if the lower limit is above the upper limit", function() {
		const testPlot = new ResponsivePlot2D("setXLimsTest2");
		expect(() => testPlot.setXLims(25, -25)).to.throw();
	});

	test("setYLims() sets property correctly", function() {
		const testPlot = new ResponsivePlot2D("setYLimsTest");
		testPlot.setYLims(-50, 50);
		expect(testPlot.properties.yLims).to.deep.equal([-50, 50]);
	});

	test("setYLims() throws an error if the lower limit is above the upper limit", function() {
		const testPlot = new ResponsivePlot2D("setYLimsTest2");
		expect(() => testPlot.setYLims(50, -50)).to.throw();
	});

	test("setTraceColour() sets property correctly on the correct trace", function() {
		const testPlot = new ResponsivePlot2D("setTraceColourTest");
		testPlot.plot("test", x => x);
		testPlot.setTraceColour("test", "red");
		expect(testPlot.plotData.test.properties.traceColour).to.equal("red");
	});

	test("setTraceStyle() sets property correctly on the correct trace", function() {
		const testPlot = new ResponsivePlot2D("setTraceStyleTest");
		testPlot.plot("test", x => x);
		testPlot.setTraceStyle("test", "dotted");
		expect(testPlot.plotData.test.properties.traceStyle).to.equal("dotted");
	});

	test("setTraceWidth() sets property correctly on the correct trace", function() {
		const testPlot = new ResponsivePlot2D("setTraceWidthTest");
		testPlot.plot("test", x => x);
		testPlot.setTraceWidth("test", 5);
		expect(testPlot.plotData.test.properties.traceWidth).to.equal(5);
	});

	test("setMarkerColour() sets property correctly on the correct trace", function() {
		const testPlot = new ResponsivePlot2D("setMarkerColourTest");
		testPlot.plot("test", x => x);
		testPlot.setMarkerColour("test", "green");
		expect(testPlot.plotData.test.properties.markerColour).to.equal("green");
	});

	test("setMarkerStyle() sets property correctly on the correct trace", function() {
		const testPlot = new ResponsivePlot2D("setMarkerStyleTest");
		testPlot.plot("test", x => x);
		testPlot.setMarkerStyle("test", "plus");
		expect(testPlot.plotData.test.properties.markerStyle).to.equal("plus");
	});

	test("setMarkerSize() sets property correctly on the correct trace", function() {
		const testPlot = new ResponsivePlot2D("setMarkerSizeTest");
		testPlot.plot("test", x => x);
		testPlot.setMarkerSize("test", 10);
		expect(testPlot.plotData.test.properties.markerSize).to.equal(10);
	});

	test("setVisibility() sets property correctly on the correct trace", function() {
		const testPlot = new ResponsivePlot2D("setVisibilityTest");
		testPlot.plot("test", x => x);
		testPlot.setVisibility("test", false);
		expect(testPlot.plotData.test.properties.visibility).to.equal(false);
	});

	test("setParameterRange() sets property correctly on the correct trace", function() {
		const testPlot = new ResponsivePlot2D("setParameterRangeTest");
		testPlot.plot("test", x => x);
		testPlot.setParameterRange("test", 0, 2*Math.PI);
		expect(testPlot.plotData.test.properties.parameterRange).to.deep.equal([0, 2*Math.PI]);
	});

	test("setParameterRange() throws an error if the lower limit is above the upper limit", function() {
		const testPlot = new ResponsivePlot2D("setParameterRangeTest2");
		expect(() => testPlot.setParameterRange("test", 2*Math.PI, 0)).to.throw();
	});
});
