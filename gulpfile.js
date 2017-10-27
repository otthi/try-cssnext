var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var del = require('del');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var cache = require('gulp-cached');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');

var browsers = [
  '> 1% in JP'
];

gulp.task('cssCompile', function() {
  var plugins = [
    require('stylelint'),
    require('autoprefixer',
      {browsers: browsers}
    ),
    require('postcss-reporter'),
    require('postcss-import'),
    require('postcss-custom-media'),
    require('postcss-custom-properties'),
    require('postcss-mixins'),
    require('postcss-nested'),
    require('stylefmt'),
    require('css-mqpacker'),
    require('cssnano')(
      {autoprefixer: false}
    )
  ]
  return gulp.src([
      './src/**/*.css',
      '!./src/**/_*.css'
    ])
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(postcss(plugins))
    .pipe(rename(function (path) {
      path.basename += ".min";
    }))
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

gulp.task('format', function(callback) {
  runSequence(
    'cssFormat',
    callback
  );
})

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
