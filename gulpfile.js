const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const  csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify-es");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore  = require("gulp-svgstore");
const del = require("del");
//

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
  .pipe(imagemin([
    imagemin.mozjpeg({progressive: true}),
    //imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"))
}

exports.images = images;

//webP

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"))
}
exports.createWebp = createWebp;

//sprite
const sprite = () => {
  return gulp.src("source/img/**/*.svg")
  .pipe(svgstore())
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"))
}
exports.sprite = sprite;

// html
const html = () => {
  return gulp.src("source/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.src("build"))
}
exports.html = html;
// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// scripts
const scripts = () => {
  return gulp.src("source/js/script.js")
  //.pipe(uglify())
  .pipe(rename("scripts.min.js"))
  .pipe(gulp.dest("build/js"))
  .pipe(sync.stream());
}
exports.scripts = scripts;
// copy
const copy = () => {
  return gulp.src([
    "source/fonts/*.{.woff2,woff}",
    "source/img/**/*.{jpg,png,svg}"
  ],
  {
    base: "source"
  })
  .pipe(gulp.dest("build"))
}
exports.copy = copy;

//del
const clean = () => {
  return del("build");
}
exports.clean = clean;
// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

//build
const build = gulp.series(
  clean, styles,
  gulp.parallel (
    html,
    sprite,
    images,
    createWebp,
    copy
  )
)
exports.build = build;
// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);
