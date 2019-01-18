/**
 * Gulp file for common Wp builds
 */

const gulp            = require('gulp'),
      autoprefixer    = require('gulp-autoprefixer'),
      babelify        = require('babelify'),
      browserify      = require('browserify'),
      buffer          = require('vinyl-buffer'),
      newer           = require('gulp-newer'),
      rename          = require('gulp-rename'),
      sass            = require('gulp-sass'),
      source          = require('vinyl-source-stream'),
      sourcemaps      = require('gulp-sourcemaps'),
      uglify          = require('gulp-uglifyes');



function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}


/**
 * Compress Images
 */
gulp.task('build-images', () => {

  return gulp.src('src/assets/images/')
    .pipe(newer('./assets/images/'))
    .pipe(gulp.dest('./assets/images/'));
});


/**
 * Build Videos
 */
gulp.task('build-videos', () => {

  return gulp.src('src/assets/videos/**/*')
    .pipe(newer('./assets/videos/'))
    .pipe(gulp.dest('./assets/videos/'));
});

/**
 * SVG to PHP for partial includes
 */
gulp.task('svg2php', () => {

  return gulp.src('src/assets/images/**/*svg')
    .pipe(rename({ extname: '.php' }))
    .pipe(gulp.dest('./assets/images/'));
});

/**
 * Build CSS/SCSS
 */
gulp.task('build-css', () => {

  return gulp.src('src/assets/scss/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'compressed',
    imagePath: 'assets/images/',
    precision: 3,
    errLogToConsole: true,
    autoprefixer: {add: true},
  }))
  .on('error', handleError)
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./assets/css/'))
});


/**
 * Admin Theme SCSS Tasks
 */
gulp.task('build-admin-css', () => {
  return gulp.src('src/inc/admin/admin-theme/assets/scss/*')
  .pipe(sass({
    outputStyle: 'compressed',
    //imagePath: 'assets/images/',
    precision: 3,
    errLogToConsole: true,
    autoprefixer: {add: true},
  }))
  .on('error', handleError)
  .pipe(sourcemaps.init())
  .pipe(autoprefixer())
  .pipe(rename({ suffix: '.min' }))
  //.pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./inc/admin/admin-theme/assets/css/'))
});


/**
 * JavaScript
 */
gulp.task('build-js', () => {

  var bundler = browserify('src/assets/js/app.js').transform('babelify', {presets: ['env']})

  return bundler.bundle()
  .on('error', handleError)
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init())
  .pipe(uglify({
    mangle: false,
    compress: false,
    output: {
      beautify: true
    }
  }))
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./assets/js/'));
});


/**
 * Run Tasks
 */
gulp.task('run', [
  'build-images',
  'build-videos',
  'build-css',
  'build-js',
  'svg2php',
  'build-admin-css'
]);

/**
 * Watcher
 */
gulp.task('watch', () => {

  gulp.watch('src/assets/images/**/*', ['build-images']);
  gulp.watch('src/assets/scss/**/*', ['build-css']);
  gulp.watch('./inc/admin/admin-theme/assets/scss/**/*', ['build-admin-css']);
  gulp.watch('src/assets/js/**/*', ['build-js']);
  gulp.watch('src/assets/images/**/*', ['svg2php']);
  gulp.watch('src/assets/videos/**/*', ['build-videos']);

});

/**
 * Gulp
 */
gulp.task('default', ['run', 'watch']);
