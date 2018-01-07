const gulp = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const pump = require("pump");

// Change to module with ES6 support
const composer = require("gulp-uglify/composer");
const uglify = composer(require("uglify-es"), console);

const SASS_PATHS = [
    "assets/sass/**/*.scss"
];
const JS_PATHS = [
    "node_modules/fuse.js/dist/fuse.js",
    "node_modules/geolib/dist/geolib.js",
    "node_modules/jquery/dist/jquery.js",
    "assets/js/**/*.js"
];

gulp.task("default", ["watch"]);

gulp.task("build", ["build-css", "build-js"]);

gulp.task("build-css", cb => {
    pump([
        gulp.src(SASS_PATHS),
        sourcemaps.init({largeFile: true}),
        sass(),
        autoPrefixer(),
        cleanCSS({
            compatibility: "ie8",
            rebase: false
        }),
        concat("finder.min.css"),
        sourcemaps.write("./"),
        gulp.dest("assets/dist/")
    ], cb);
});

gulp.task("build-js", cb => {
    pump([
        gulp.src(JS_PATHS),
        sourcemaps.init({largeFile: true}),
        uglify(),
        concat("finder.min.js"),
        sourcemaps.write("./"),
        gulp.dest("assets/dist/")
    ], cb);
});

gulp.task("watch", ["watch-css", "watch-js"]);

gulp.task("watch-css", () => gulp.watch(SASS_PATHS, ["build-css"]));

gulp.task("watch-js", () => gulp.watch(JS_PATHS, ["build-js"]));