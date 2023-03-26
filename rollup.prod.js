import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default defineConfig({
	input: "dist/pulsar/index.js",
	output: [{
		file: "dist/pulsar-web.js",
		format: "iife",
		name: "Pulsar"
		}, {
		file: "dist/pulsar-web.min.js",
		format: "iife",
		name: "Pulsar",
		plugins: [
			terser()
		]
	}],
	plugins: [
		resolve()
	]
});
