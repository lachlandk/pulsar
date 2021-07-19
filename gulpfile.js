import gulp from "gulp";
import del from "del";
import typescriptGulp from "gulp-typescript";
import typescriptRollup from "rollup-plugin-typescript2";
import { rollup } from "rollup";
import merge from "merge2";
// const strip = require("gulp-strip-comments");
// const rename = require("gulp-rename");
// const terser = require("gulp-terser");

function clean() {
	return del(["build/**"]);
}

async function buildES() {
	const result = gulp.src("src/**/*.ts")
		.pipe(typescriptGulp.createProject("tsconfig.json", {
			declaration: true
		})());
	return merge([
		result.dts.pipe(gulp.dest("build/types")),
		result.js.pipe(gulp.dest("build/pulsar"))
	]);
}

function buildIIFE() {
	return rollup({
		input: "src/pulsar.ts",
		plugins: [
			typescriptRollup({
				tsconfig: "tsconfig.json",
				tsconfigOverride: {
					compilerOptions: {
						declaration: false,
					}
				},
				check: false
			})
		]
	}).then(bundle => bundle.write({
		file: "./build/pulsar-web.js",
		format: "iife",
		name: "Pulsar"
	}));
}

export const build = gulp.series(clean, buildES, buildIIFE);

export function watch() {
	return gulp.watch("src/**/*.ts", build);
}

// export function dist() {
//
// }

// export function docs() {
//
// }
