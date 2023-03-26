import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";

export default defineConfig({
	input: "build/pulsar/index.js",
	output: {
		file: "build/pulsar-web.js",
		format: "iife",
		name: "Pulsar"
	},
	plugins: [
		resolve()
	]
});
