var gulp = require('gulp'),
    gutil = require('gulp-util'),
    del = require('del'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sequence = require('run-sequence'),
    mapleify = require('maplescript/plugins/browserify'),
    panini = require('panini'),
    rename = require('gulp-rename'),
    reload = browserSync.reload;

/**
 * Cleaning dist/ folder
 */
gulp.task('clean', function(cb) {
  del(['css/**', 'js/**']).then(function () {
    cb();
  });
})

/**
 * Running livereload server
 */
.task('server', function() {
  browserSync.init({
    server: {
     baseDir: './'
    }
  });
})

/**
 * sass compilation
 */
.task('sass', function() {
  return gulp.src('scss/app.scss')
  .pipe(sass())
  .pipe(concat('app.css'))
  .pipe(gulp.dest('assets/css'));
})

/**
 * js compilation
 */
.task('js', function() {
  return browserify({entries: ['maple/app.maple'], extensions: ['.maple']})
  .transform(mapleify)
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('assets/js'));
})

/**
 * minified js compilation
 */
.task('js:min', function() {
  return browserify({entries: ['maple/app.maple'], extensions: ['.maple']})
  .transform(mapleify)
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(uglify().on('error', function (e) { console.log(e) }))
  .pipe(gulp.dest('assets/js'));
})

/**
 * Compile documentation pages.
 */
.task('docs', function () {
  return gulp.src('markdown/**/*.md')
  .pipe(panini({
    root: 'markdown/',
    layouts: 'layouts/',
    helpers: 'helpers/'
  }))
  .pipe(rename(function (path) {
    // path.dirname += ('/' + path.basename);
    path.dirname = './';
    path.basename = 'index';
    path.extname = '.html';
  }))
  .pipe(gulp.dest('./'));
})

/**
 * watch files and recompile
 */
.task('watch', function () {
  return gulp.watch(
    [
      'maple/**/*.maple',
      'scss/**/*.scss',
      'markdown/**/*.md',
      'layouts/**/*.html'
    ],
    function () {
      return sequence('sass', 'js', 'docs', browserSync.reload);
    }
  );
})

/**
 * Compile resources but don't worry about serving.
 */
.task('build', function (done) {
  return sequence('clean', ['sass', 'js', 'docs'], done);
})

/**
 * compile resources and run a server
 */
.task('serve', function(done) {
  return sequence('clean', ['sass', 'js', 'docs'], 'server', 'watch', done);
});
