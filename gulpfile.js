import gulp from "gulp";
import del from "del";
import typescript from "gulp-typescript";
import merge from "merge2";
// const strip = require("gulp-strip-comments");
// const rename = require("gulp-rename");
// const terser = require("gulp-terser");

export async function build() {
	await del(["build/**"]);
	const project = typescript.createProject("tsconfig.json");
	const result = gulp.src("src/**/*.ts")
		.pipe(project());
	return merge([
		result.dts.pipe(gulp.dest("build/types")),
		result.js.pipe(gulp.dest("build"))
	]);
}

export function watch() {
	return gulp.watch("src/*.ts", build);
}

// export function dist() {
//
// }

// export function docs() {
//
// }
