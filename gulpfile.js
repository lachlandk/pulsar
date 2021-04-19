const gulp = require("gulp");
const del = require("del");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const strip = require("gulp-strip-comments");
const terser = require("gulp-terser");

async function clean() {
	const paths = await del(["dist/web/**"]);
	console.log(`Deleted old files:\n - ${paths.join("\n - ")}`);
}

async function webify() {
	const sourceFiles = await new Promise(resolve => {
			const chunks = [];
			const source = gulp.src("src/*.js");
			source.on("data", chunk => chunks.push(chunk));
			source.on("end", () => {
				const files = [];
				for (const chunk of chunks) {
					files.push({path: chunk.path, contents: chunk.contents.toString()});
				}
				resolve(files);
			});
	});
	const sourceString = (() => {
		const sourceContents = [];
		for (const file of sourceFiles) {
			sourceContents.push(file.contents);
		}
		return sourceContents.join("\n");
	})();
	const sourceExports = (() => {
		const globals = [];
		for (const file of sourceFiles) {
			for (const match of file.contents.matchAll(/^(?:const|function)\s([a-zA-Z_$][\w$]*)/gm)) {
				globals.push(match[1]);
			}
		}
		const globalExports = [];
		for (const global of globals) {
			globalExports.push(`${globals.indexOf(global) === 0 ? "" : "\t\t"}${global}: ${global}${globals.indexOf(global) === globals.length - 1 ? "" : ","}`);
		}
		return globalExports.join("\n");
	})();
	return gulp.src("templates/web.js")
		.pipe(replace("// gulp-inject library body", sourceString))
		.pipe(replace("// gulp-inject library exports", sourceExports))
		.pipe(strip())
		.pipe(rename("pulsar-web.js"))
		.pipe(gulp.dest("dist/web/"))
		.pipe(terser())
		.pipe(rename({extname: ".min.js"}))
		.pipe(gulp.dest("dist/web/"));
}

exports.build = gulp.series(clean, webify);
