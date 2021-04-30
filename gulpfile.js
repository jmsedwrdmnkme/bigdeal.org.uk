'use strict';

//
// Packages
//

const gulp = require('gulp');
const del = require('del');
const svgsprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sasslint = require('gulp-sass-lint');
const ext = require('gulp-ext-replace');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const hb = require('gulp-hb');
const log = require('fancy-log');


//
// Processes
//

// Clean
function clean() {
  return del('./dist');
}

//
// JS
//

function jslint() {
  return gulp
    .src([
      './src/js/*/js',
      './gulpfile.js'
    ], { allowEmpty: true })
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
}

function jslazyloadmodules() {
  return gulp
    .src([
      './node_modules/loadjs/dist/loadjs.min.js'
    ], { allowEmpty: true })
    .pipe(ext('.hbs'))
    .pipe(gulp.dest('./src/html/partials/global/'));
}

function jscritical() {
  return gulp
    .src('./src/js/critical.js', { allowEmpty: true })
    .pipe(uglify({
      mangle: true,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: false
      }}
    ))
    .pipe(concat('js.js'))
    .pipe(ext('.hbs'))
    .pipe(gulp.dest('./src/html/partials/global/'));
}

function jsnoncritical() {
  return gulp
    .src([
      './node_modules/bootstrap/dist/js/bootstrap.bundle.js',
      './src/js/main.js'
    ], { allowEmpty: true })
    .pipe(uglify({
      mangle: true,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: false
      }}
    ))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/wp-content/themes/synthetic/js/'));
}


//
// CSS
//

function csslint() {
  return gulp
    .src('./src/scss/*.scss', { allowEmpty: true })
    .pipe(sasslint({'configFile': './.sass-lint.yml'}))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
}

function cssnoncritical() {
  return gulp
    .src('./src/scss/style.scss', { allowEmpty: true })
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/wp-content/themes/synthetic/'));
}


//
// Assets
//

function sprite() {
  return gulp
    .src('./src/sprite/**/**/*.svg', { allowEmpty: true })
    .pipe(
      svgsprite({
        shape: {
          spacing: {
            padding: 5
          }
        },
        mode: {
          symbol: true
        },
        svg: {
          xmlDeclaration: false,
          doctypeDeclaration: false,
          namespaceIDs: false,
          namespaceClassnames: false
        }
      })
    )
    .pipe(concat('sprite.hbs'))
    .pipe(gulp.dest('./src/html/partials/global/'));
}

function images() {
  return gulp
    .src('./src/img/**/**/*', { allowEmpty: true })
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest('./dist/wp-content/themes/synthetic/img/'));
}

function fonts() {
  return gulp
    .src('./src/fonts/*', { allowEmpty: true })
    .pipe(gulp.dest('./dist/wp-content/themes/synthetic/fonts/'));
}


//
// HTML
//

// HTML
function html() {
  return gulp
    .src(['./src/html/**/*.hbs', '!./src/html/partials/**/*.hbs'])
    .pipe(hb()
      .partials('./src/html/partials/**/*.hbs')
    )
    .pipe(ext('.php'))
    .pipe(gulp.dest('./dist/wp-content/themes/synthetic/'));
}


//
// Watch and build scripts
//

const watch =
  gulp.series(
    clean,
    gulp.parallel(
      sprite,
      images,
      jslint,
      csslint
    ),
    fonts,
    html,
    gulp.parallel(
      cssnoncritical,
      jscritical,
      jsnoncritical
    ),
    jslazyloadmodules,
    html,
    watchFiles
  );

const csswatch =
  gulp.series(
    csslint,
    cssnoncritical,
    html
  );

const jswatch =
  gulp.series(
    jslint,
    jscritical,
    jsnoncritical,
    html
  );

function watchFiles() {
  gulp.watch('./src/scss/**/*.scss', csswatch);
  gulp.watch('./src/js/**/*.js', jswatch);
  gulp.watch('./src/sprite/**/*.svg', sprite);
  gulp.watch('./src/html/**/*.hbs', csswatch, html);
  gulp.watch('./src/img/**/*', images);
  gulp.watch('./src/fonts/*', fonts);
}


//
// Export tasks
//

exports.default = watch;
