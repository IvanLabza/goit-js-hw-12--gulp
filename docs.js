const gulp = require("gulp");
const gulpFileInclude = require("gulp-file-include");
const scss = require("gulp-sass")(require("sass"));
const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const htmlClean = require("gulp-htmlclean");
const fileSystem = require("fs");
const autoprefixer = require("gulp-autoprefixer");
const cssMin = require("gulp-csso");
const minImg = require("gulp-imagemin");
const webpHtml = require("gulp-webp-html");
const webpCss = require("gulp-webp-css");
const cssMap = require("gulp-sourcemaps");
const error = require("gulp-notify");
const plumber = require("gulp-plumber");
const webpack = require("webpack-stream");
const pages = require("gh-pages");
const change = require("gulp-changed");
const media = require("gulp-group-css-media-queries");
const webp = require("gulp-webp");

gulp.task("scssDocs", () => {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(change("./doc/css/"))
    .pipe(cssMap.init())
    .pipe(scss())
    .pipe(webpCss())
    .pipe(media())
    .pipe(scss())
    .pipe(cssMin())
    .pipe(cssMap.write())
    .pipe(gulp.dest("./docs/css"));
});

gulp.task("htmlDocs", () => {
  return gulp
    .src("./src/*.html")
    .pipe(change("./docs/"))
    .pipe(
      plumber({
        errorHandler: error({
          title: "html",
          message: "Error <%= error.massage %>",
          sound: false,
        }),
      })
    )
    .pipe(
      gulpFileInclude({
        prefix: "!",
        basepath: "@file",
      })
    )
    .pipe(webpHtml())
    .pipe(htmlClean())
    .pipe(gulp.dest("./docs/"));
});

gulp.task("imgDocs", () => {
  return gulp
    .src("./src/img/**/**")
    .pipe(change("./docs/img/"))
    .pipe(webp())
    .pipe(gulp.dest("./docs/img/"))
    .pipe(minImg({ verbose: true }))
    .pipe(gulp.dest("./docs/img/"));
});

gulp.task("jsDocs", () => {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(change("./docs/js"))
    .pipe(webpack(require("./webpack.config")))
    .pipe(gulp.dest("./docs/js"));
});
