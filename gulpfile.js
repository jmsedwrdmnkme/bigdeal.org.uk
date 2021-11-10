import { createRequire } from "module";
const require = createRequire(import.meta.url);

import gulp from 'gulp';
import del from 'del';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass( dartSass );
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import svgsprite from 'gulp-svg-sprite';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';
import hb from 'gulp-hb';
import ext from 'gulp-ext-replace'

export const clean = () => del([ 'dist/' ]);

export function scripts() {
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.bundle.js', 'src/js/main.js'], { sourcemaps: true })
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/wp-content/themes/synthetic/js/'));
}

export function styles() {
  return gulp.src('src/scss/style.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/wp-content/themes/synthetic/'));
}

//
// Assets
//

export function sprite() {
  return gulp.src('src/sprite/**/**/*.svg')
    .pipe(svgsprite({
      shape: { spacing: { padding: 5 } },
      mode: { symbol: true },
      svg: { xmlDeclaration: false, doctypeDeclaration: false, namespaceIDs: false, namespaceClassnames: false }
    }))
    .pipe(concat('sprite.hbs'))
    .pipe(gulp.dest('./src/html/partials/global/'));
}

export function images() {
  return gulp.src('src/img/**/**/*')
    .pipe(imagemin([
      gifsicle({interlaced: true}),
      mozjpeg({quality: 75, progressive: true}),
      optipng({optimizationLevel: 5}),
      svgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: true
          },
          {
            name: 'cleanupIDs',
            active: true
          },
          {
            name: 'collapseGroups',
            active: true
          }
        ]
      })
    ]))
    .pipe(gulp.dest('./dist/wp-content/themes/synthetic/img/'));
}

export function fonts() {
  return gulp.src('./src/fonts/*', { allowEmpty: true })
    .pipe(gulp.dest('./dist/wp-content/themes/synthetic/fonts/'));
}

export function htaccess() {
  return gulp.src('./src/htaccess/.htaccess', { allowEmpty: true })
    .pipe(gulp.dest('./dist/'));
}

export function html() {
  return gulp.src(['src/html/**/**/*.hbs', '!src/html/partials/**/*.hbs'])
    .pipe(hb().partials('src/html/partials/**/*.hbs'))
    .pipe(ext('.php'))
    .pipe(gulp.dest('./dist/wp-content/themes/synthetic/'));
}

function watchFiles() {
  gulp.watch('src/js/**/*.js', scripts);
  gulp.watch('src/sprite/**/*.svg', sprite);
  gulp.watch('src/scss/**/*', styles);
  gulp.watch('src/html/**/**/*.hbs', html);
  gulp.watch('src/htaccess/*', htaccess);
  gulp.watch('src/img/**/*', images);
  gulp.watch('src/fonts/**/*', fonts);
}

const build = gulp.series(clean, gulp.parallel(htaccess, sprite, images, styles, fonts, scripts), html, watchFiles);

export default build;
