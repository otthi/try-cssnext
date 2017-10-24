var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var del = require('del');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var cache = require('gulp-cached');
var csso = require('gulp-csso');
var watch = require('gulp-watch');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqPacker = require('css-mqpacker');
var customProperties = require('postcss-custom-properties');
var mixin = require('postcss-mixins');
var nested = require('postcss-nested');

var browsers = [
  '> 1% in JP'
];

gulp.task('cssCompile', function() {
  var plugins = [
    // doiuse({browsers: browsers}),
    autoprefixer({browsers: browsers}),
    mqPacker,
    customProperties,
    mixin,
    nested
  ]
  return gulp.src('./src/**/*.css')
    .pipe(plumber())
    .pipe(postcss(plugins))
    // .pipe(csso())
    .pipe(gulp.dest('.'));
});
gulp.task('cssClean', del.bind(null, './*.css'));

gulp.task('build:css', function(callback) {
  runSequence(
    'cssClean',
    'cssCompile',
    callback
  );
});

gulp.task('watch', function() {
  watch(['./src/**/*.css'], function(event) {
    gulp.start('build:css');
  });
});

gulp.task('default', function(callback) {
  return runSequence(
    'watch',
    callback
  );
});
