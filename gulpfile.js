const gulp = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const imageResize = require("gulp-image-resize");
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
const IMAGE_PATHS = [
    "assets/images/**/*.{jpg,svg}"
];

gulp.task("default", ["watch"]);

gulp.task("build", ["build:css", "build:js"]);

gulp.task("build:css", cb => {
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

gulp.task("build:js", cb => {
    pump([
        gulp.src(JS_PATHS),
        sourcemaps.init({largeFile: true}),
        uglify(),
        concat("finder.min.js"),
        sourcemaps.write("./"),
        gulp.dest("assets/dist/")
    ], cb);
});

gulp.task("compress:images", cb => {
    pump([
        gulp.src(IMAGE_PATHS),
        imagemin([
            // TODO: Improve configurations to minimize even more
            imagemin.jpegtran({progressive: true}),
            imagemin.svgo({
                plugins: [
                    {cleanupIDs: false},
                    {minifyStyles: true},
                    {removeComments: true},
                    {removeViewBox: true}
                ]
            })
        ],
        {verbose: true}),
        gulp.dest("assets/images/")
    ], cb);
});

gulp.task("compress:schools", cb => {
    pump([
        gulp.src("assets/images/school/*.jpg"),
        imageResize({
            format: "jpg",
            imageMagick: true,
            width: 500
        }),
        gulp.dest("assets/images/school/")
    ], cb);
});

gulp.task("watch", ["watch:css", "watch:js"]);

gulp.task("watch:css", () => gulp.watch(SASS_PATHS, ["build:css"]));

gulp.task("watch:js", () => gulp.watch(JS_PATHS, ["build:js"]));

gulp.task("watch:images", () => gulp.watch(IMAGE_PATHS, ["compress:images", "compress:schools"]));