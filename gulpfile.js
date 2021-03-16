// TODO: node init
// "devDependencies": {
//   "del": "^5.1.0",
//   "gulp": "^4.0.2",
//   "gulp-inject": "^5.0.5",
//   "gulp-rename": "^2.0.0",
//   "gulp-strip-comments": "^2.5.2",
//   "gulp-uglify": "^3.0.2",
//   "uglify-es": "^3.3.9"
// }

const gulp = require("gulp");
const rename = require("gulp-rename");
const uglify = require("uglify-es");
const strip = require("gulp-strip-comments");
const inject = require("gulp-inject");
const del = require("del");
const composer = require("gulp-uglify/composer");
const minify = composer(uglify, console);
const modules = [
];

async function clean(){
	const paths = await del(["dist/node/**", "dist/web/**"])
	console.log("Deleted old files/directories:\n", paths.join("\n"));
}

function webify(){
	return gulp.src("templates/web.js")
		.pipe(inject(gulp.src(modules), {
			starttag: "/* inject:js */",
			endtag: "/* endinject */",
			transform: function(filepath, file){
				return file.contents.toString("utf-8");
			}
		}))
		.pipe(strip())
		.pipe(rename("pulsar-web.js"))
		.pipe(gulp.dest("dist/web/"))
		.pipe(minify())
		.pipe(rename({extname: ".min.js"}))
		.pipe(gulp.dest("dist/web/"));
}

exports.build = gulp.series(clean, webify);
