const gulp          = require("gulp");
const sass          = require("gulp-sass");
const sourcemaps    = require("gulp-sourcemaps");
const autoprefixer  = require("gulp-autoprefixer");
const c             = require("ansi-colors");
const notifier      = require("node-notifier");
const rename        = require("gulp-rename");
const wait          = require("gulp-wait");
const csso          = require("gulp-csso");
const browserSync   = require("browser-sync").create();
const include       = require('gulp-include');

const webpack               = require("webpack");
const webpackDevMiddleware  = require('webpack-dev-middleware');
const webpackHotMiddleware  = require('webpack-hot-middleware');
const webpackConfig         = require('./webpack.config')(true);
const bundler               = webpack(webpackConfig);

//tryb developerski
let developmentMode         = false;

const showError = function(err) {
    //console.log(err.toString());

    notifier.notify({
        title: "Error in sass",
        message: err.messageFormatted
    });

    console.log(c.red("==============================="));
    console.log(c.red(err.messageFormatted));
    console.log(c.red("==============================="));
};

const server = function (cb) {
    const config = {
        server: {
            baseDir: "./dist"
        },
        open:true,
        notify:false
    };

    if (developmentMode) {
        config.server.middleware = [
            webpackDevMiddleware(bundler, {
                publicPath: webpackConfig.output.publicPath,
                stats: { colors: true }
            }),
            webpackHotMiddleware(bundler)
        ]
    }

    browserSync.init(config);
    cb();
};

const css = function() {
    return gulp.src("src/scss/style.scss")
        .pipe(wait(500))
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle : "expanded"
            }).on("error", showError)
        )
        .pipe(autoprefixer())
        .pipe(rename({
            suffix: ".min",
            basename: "style"
        }))
        // .pipe(csso())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
};

const js = function(cb) { //https://github.com/webpack/docs/wiki/usage-with-gulp#normal-compilation
    return webpack(require("./webpack.config.js")(), function(err, stats) {
        if (err) throw err;
        console.log(stats.toString());
        browserSync.reload();
        cb();
    })
};

const html = function(cb) {
    return gulp.src('src/html/*.html')
        .pipe(include())
        .pipe(gulp.dest('dist'))
};

const htmlReload = function(cb) {
    browserSync.reload();
    cb();
};

const watch = function() {
    gulp.watch("src/scss/**/*.scss", {usePolling : true}, gulp.series(css));
    gulp.watch("src/html/**/*.html", {usePolling : true}, gulp.series(html, htmlReload));
    gulp.watch("src/js/**/*.js", {usePolling : true}, gulp.series(js));
};

const startText = function(cb) {
    console.log(c.yellow(`
        ───▄▀▀▀▄▄▄▄▄▄▄▀▀▀▄───
        ───█▒▒░░░░░░░░░▒▒█───
        ────█░░█░░░░░█░░█────
        ─▄▄──█░░░▀█▀░░░█──▄▄─
        █░░█─▀▄░░░░░░░▄▀─█░░█
    `));
    console.log(c.blue('Start :)'));
    cb();
};

const develop = function() {
    developmentMode = true;
    return gulp.series(startText, css, html, server, watch)();
};

exports.develop = develop;
exports.default = gulp.series(startText, js, css, html, server, watch);
exports.css = css;
exports.watch = watch;