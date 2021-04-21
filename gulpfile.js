const gulp = require("gulp");
const del = require("del");
const strip = require("gulp-strip-comments");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const terser = require("gulp-terser");
const log = require("fancy-log");
const {exec} = require("child_process");
const source = {};

async function clean() {
	const paths = await del(["dist/**"]);
	log(paths.length > 0 ? `Deleted old dist files:\n - ${paths.join("\n - ")}` : "No old dist files found to clear.");
}

async function generateSource() {
	source.sourceFiles = await new Promise(resolve => {
		const chunks = [];
		const source = gulp.src("src/*.js").pipe(strip({
			ignore: [
				/\/\*\*\s*\n([^*]*(\*[^\/])?)*\*\//g,
				/\/\*\s*\n([^*]*(\*[^\/])?)*\*\//g,
				/\/\/.*/g
			]
		}));
		source.on("data", chunk => chunks.push(chunk));
		source.on("end", () => {
			const files = [];
			for (const chunk of chunks) {
				files.push({path: chunk.path, contents: chunk.contents.toString()});
			}
			resolve(files);
		});
	});
	source.sourceString = (() => {
		const sourceContents = [];
		for (const file of source.sourceFiles) {
			const lineArray = file.contents.split("\n");
			for (let i = 0; i < lineArray.length; i++) {
				lineArray[i] = "\t" + lineArray[i];
			}
			sourceContents.push(lineArray.join("\n"));
		}
		return sourceContents.join("\n");
	})();
	source.sourceExports = (() => {
		const globals = [];
		for (const file of source.sourceFiles) {
			for (const match of file.contents.matchAll(/^(?:const|function)\s([a-zA-Z_$][\w$]*)/gm)) {
				globals.push(match[1]);
			}
		}
		const globalExports = [];
		for (const global of globals) {
			globalExports.push(`\t\t${global}: ${global}${globals.indexOf(global) === globals.length - 1 ? "" : ","}`);
		}
		return globalExports.join("\n");
	})();
}

function webify() {
	return gulp.src("templates/web.js")
		.pipe(replace("// gulp-inject library body", source.sourceString))
		.pipe(replace("// gulp-inject library exports", source.sourceExports))
		.pipe(rename("pulsar-web.js"))
		.pipe(gulp.dest("dist/"))
		.pipe(terser())
		.pipe(rename("pulsar-web.min.js"))
		.pipe(gulp.dest("dist/"));
}

async function docs() {
	const paths = await del(["docs/**"]);
	log(paths.length > 0 ? `Deleted old docs files:\n - ${paths.join("\n - ")}` : "No old docs files found to clear.");
	return new Promise((resolve, reject) => {
		exec("jsdoc -c jsdoc.json --verbose", (error, stdout) => {
			if (error) {
				log.error(error);
				reject(new Error());
			}
			if (stdout) {
				log(stdout);
				resolve();
			}
		});
	});
}

exports.build = gulp.series(clean, generateSource, webify , docs);
exports.docs = docs;
