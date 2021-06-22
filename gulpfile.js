const gulp = require("gulp");
const del = require("del");
const strip = require("gulp-strip-comments");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const gulpIf = require("gulp-if");
const lazypipe = require("lazypipe");
const terser = require("gulp-terser");
const log = require("fancy-log");
const { exec } = require("child_process");

async function create_build(sourceStringArray, template, filename) {
	const paths = await del([`build/${template}**`]);
	log(paths.length > 0 ? `Deleted old build files:\n - ${paths.join("\n - ")}` : "No old build files found to clear.");
	const sourceFiles = await new Promise(resolve => {
		const chunks = [];
		const source = gulp.src(sourceStringArray).pipe(strip({
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
	return gulp.src(`templates/${template}.js`)
		.pipe(replace("// gulp-inject library body", sourceString))
		.pipe(replace("// gulp-inject library exports", sourceExports))
		.pipe(rename(filename))
		.pipe(gulp.dest(`build/${template}`));
}

async function create_dist(folder, doMinify) {
	const minify = lazypipe()
		.pipe(terser)
		.pipe(rename,{
			extname: ".min.js"
		});
	return gulp.src(`build/${folder}/*.js`)
		.pipe(strip({
			safe: true
		}))
		.pipe(gulp.dest(`dist/`))
		.pipe(gulpIf(doMinify, minify()))
		.pipe(gulp.dest(`dist/`));
}

function build_web() {
	return create_build(["src/*.js", "src/web/*.js"], "web", "pulsar-web.js");
}

function build_node() {
	return create_build(["src/*.js", "src/node/*.js"], "node", "pulsar.js");
}

function dist_web() {
	return create_dist("web", true);

}

function dist_node() {
	return create_dist("node", false);
}

function build() {
	if (process.argv[3] === "--web") {
		return build_web();
	} else if (process.argv[3] === "--node") {
		return build_node();
	}
}

function dist() {
	if (process.argv[3] === "--web") {
		return dist_web();
	} else if (process.argv[3] === "--node") {
		return dist_node();
	}
}

async function docs() {
	// TODO: update for node/web versions
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
exports.docs = gulp.series(docs);
