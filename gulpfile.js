const gulp          = require('gulp');
const browserSync   = require('browser-sync').create();
const pug           = require('gulp-pug');
const sass          = require('gulp-sass');
const spritesmith   = require('gulp.spritesmith');
const rimraf        = require('rimraf');
const rename        = require('gulp-rename');
const autoprefixer  = require('gulp-autoprefixer');
const sourcemaps    = require('gulp-sourcemaps');
const uglify        = require('gulp-uglify');
const concat        = require('gulp-concat');




/* -------- Server  -------- */
gulp.task('server', function() {
    'use strict';
  browserSync.init({
    server: {
      port: 9000,
      baseDir: "build"
    }
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

/* ------------ Pug compile ------------- */
gulp.task('templates:compile', function buildHTML() {
  return gulp.src('source/template/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});

/* ------------ Styles compile ------------- */

gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer ({
        browsers: ['last 2 versions'], 
        cascade: true
    }))
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('build/css'));
});

/* ------------ JS ------------- */
gulp.task('js', function(){
    return gulp.src([
        'source/js/initSlider.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});

/* ------------ Delete ------------- */
gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
});

/* ------------ Copy fonts ------------- */
gulp.task('copy:fonts', function() {
  return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

/* ------------ Copy images ------------- */
gulp.task('copy:images', function() {
  return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

/* ------------ Copy ------------- */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/* ------------ Watchers ------------- */
gulp.task('watch', function() {
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
    gulp.watch('source/style/**/*.js', gulp.series('js'));    
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile', 'js', 'copy'),
  gulp.parallel('watch', 'server')
  )
);
