/**
 * Gulp File for Static projects using HBS partials.
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
      uglify          = require('gulp-uglifyes')
      gls             = require('gulp-live-server'),
      handlebars      = require('gulp-compile-handlebars');

// Server Port
const PORT = 8888;

/**
 * Error Handler
 */
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}


/**
 * Compress Images
 */
gulp.task('build-images', () => {

  return gulp.src('src/assets/images/')
    .pipe(newer('dist/assets/images/'))
    .pipe(gulp.dest('dist/assets/images/'));
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
  .pipe(gulp.dest('dist/assets/css/'))
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
  .pipe(gulp.dest('dist/assets/js/'));
});


/**
 * Handlebars Partials
 */
gulp.task('build-hbs', () => {

  return gulp.src('src/pages/*.hbs')
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: [folder.src + 'partials']
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('dist/'));
});

/**
 * Tempaltes
 */
gulp.task('build-templates', () => {

  return gulp.src('src/assets/templates/*')
    .pipe(include())
    .pipe(gulp.dest('dist/assets/templates/'));
});

/**
 * Live Server at port:
 */
gulp.task('serve', () => {
  var server = gls.static(folder.build, PORT);
  server.start();
});

/**
 * Run Tasks
 */
gulp.task('run', [
  'build-images',
  'build-css',
  'build-js',
  'build-hbs',
  'build-templates',
  'serve'
]);

/**
 * Watcher
 */
gulp.task('watch', () => {

  gulp.watch('src/assets/images/**/*', ['build-images']);
  gulp.watch('src/assets/scss/**/*', ['build-css']);
  gulp.watch('./inc/admin/admin-theme/assets/scss/**/*', ['build-admin-css']);
  gulp.watch('src/assets/js/**/*', ['build-js']);
  gulp.watch(folder.src + 'assets/templates/*', ['build-templates']);
  gulp.watch(folder.src + '**/*', ['build-hbs']);
  gulp.watch('src/assets/videos/**/*', ['build-videos']);

});

/**
 * Gulp
 */
gulp.task('default', ['run', 'watch']);
