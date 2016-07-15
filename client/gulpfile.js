var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var webpack = require('gulp-webpack');
var browserSync = require('browser-sync').create();
var webpackConfig = require('./webpack.config.js');

gulp.task('font-awesome', function() {
  return gulp.src('node_modules/font-awesome/**')
    .pipe(gulp.dest('asset/vendor/font-awesome'));
});

gulp.task('gfonts', function() {
  return gulp.src('node_modules/gfonts/**')
    .pipe(gulp.dest('asset/vendor/gfonts'));
});

gulp.task('vendor', ['font-awesome', 'gfonts']);

gulp.task('sass', function() {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('asset/css'));
});

gulp.task('sass:watch', function() {
  return gulp.watch('sass/*.scss', ['sass']);
});

gulp.task('minify-css', function() {
  return gulp.src([
      'node_modules/react-datepicker/dist/react-datepicker.css',
      'asset/css/mitbbs.css'
    ])
    .pipe(concat('index.css'))
    .pipe(minifyCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('asset/css'));
});

gulp.task('webpack:watch', function() {
  gulp.src('src/entry.jsx')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('asset/js'));
});

gulp.task('minify-js', function() {
  return gulp.src('asset/js/bundle.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('asset/js'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
    port: 3010,
    notify: false
  });
});

gulp.task('browser:watch', ['browserSync'], function() {
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('asset/css/**/*.css', browserSync.reload);
  gulp.watch('asset/js/**/*.js', browserSync.reload);
});

gulp.task('dev', ['browser:watch', 'webpack:watch', 'sass:watch']);

gulp.task('prod', ['minify-js', 'minify-css']);
