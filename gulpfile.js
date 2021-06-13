const gulp = require("gulp");
const del = require("del");
const strip = require("gulp-strip-comments");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const terser = require("gulp-terser");
const log = require("fancy-log");
const { exec } = require("child_process");

async function build() {
	const paths = await del(["build/web/**"]);
	log(paths.length > 0 ? `Deleted old build files:\n - ${paths.join("\n - ")}` : "No old build files found to clear.");
	const sourceFiles = await new Promise(resolve => {
		const chunks = [];
		const source = gulp.src("src/*.js").pipe(strip({
			ignore: /\/\*\*\s*\n([^*]|(\*(?!\/)))*\*\//g
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
	const sourceString = (() => {
		const sourceContents = [];
		for (const file of sourceFiles) {
			const lineArray = file.contents.split("\n");
			for (let i = 0; i < lineArray.length; i++) {
				lineArray[i] = "\t" + lineArray[i];
			}
			sourceContents.push(lineArray.join("\n"));
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
			globalExports.push(`\t\t${global}: ${global}${globals.indexOf(global) === globals.length - 1 ? "" : ","}`);
		}
		return globalExports.join("\n");
	})();
	return gulp.src("templates/web.js")
		.pipe(replace("// gulp-inject library body", sourceString))
		.pipe(replace("// gulp-inject library exports", sourceExports))
		.pipe(rename("pulsar-web.js"))
		.pipe(gulp.dest("build/web/"));
}

async function dist() {
	const paths = await del(["dist/web/**"]);
	log(paths.length > 0 ? `Deleted old dist files:\n - ${paths.join("\n - ")}` : "No old dist files found to clear.");
	return gulp.src("build/web/pulsar-web.js")
		.pipe(strip({
			safe: true
		}))
		.pipe(gulp.dest("dist/web/"))
		.pipe(terser())
		.pipe(rename("pulsar-web.min.js"))
		.pipe(gulp.dest("dist/web/"));
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

exports.build = build;
exports.dist = dist;
exports.docs = gulp.series(build, docs);
