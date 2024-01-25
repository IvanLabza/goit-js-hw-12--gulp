const gulp = require("gulp");

const gulpFileInclude = require("gulp-file-include");

const scss = require("gulp-sass")(require("sass"));

const server = require("gulp-server-livereload");

const clean = require("gulp-clean");

const fileSystem = require("fs");

const minImg = require("gulp-imagemin");

const cssMap = require("gulp-sourcemaps");

const error = require("gulp-notify");

const plumber = require("gulp-plumber");

const webpack = require("webpack-stream");

const pages = require("gh-pages");

const babel = require("gulp-babel");

const change = require("gulp-changed");

const media = require("gulp-group-css-media-queries");
const changed = require("gulp-changed");

const config = require("./webpack.config");

gulp.task("scssDev", () => {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(change("./doc/css/"))

    .pipe(cssMap.init())
    .pipe(scss())
    .pipe(gulp.dest("./doc/css"));
});

gulp.task("htmlDev", () => {
  return gulp
    .src("./src/*.html", "!.//src/component/*.html")
    .pipe(change("./doc/", { hasChanged: change.compareContents }))
    .pipe(
      plumber({
        errorHandler: error({
          generatedMessage: true,
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
    .pipe(gulp.dest("./doc/"));
});

gulp.task("imgDev", () => {
  return gulp
    .src("./src/img/**/**")
    .pipe(change("./doc/img/"))
    .pipe(minImg({ verbose: true }))
    .pipe(gulp.dest("./doc/img/"));
});

gulp.task("jsDev", () => {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(change("./doc/js"))
    .pipe(
      plumber({
        errorHandler: error({
          generatedMessage: true,
          title: "js",
          message: "Error <%= error.massage %>",
          sound: false,
        }),
      })
    )
    .pipe(webpack(config))
    .pipe(gulp.dest("./doc/js"));
});

gulp.task("serveDev", () => {
  return gulp.src("./doc/").pipe(
    server({
      livereload: true,
      open: true,
    })
  );
});

gulp.task("cleanDev", (done) => {
  if (fileSystem.existsSync("./doc/", { read: false })) {
    return gulp.src("./doc/").pipe(clean());
  }
  done();
});

gulp.task("watchDev", () => {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("scssDev"));
  gulp.watch("./src/**/*.html", gulp.parallel("htmlDev"));
  gulp.watch("./src/img/**/*", gulp.parallel("imgDev"));
  gulp.watch("./src/**/*.js", gulp.parallel("jsDev"));
});
