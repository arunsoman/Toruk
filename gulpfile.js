const eslint = require('gulp-eslint');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var proxy = require('proxy-middleware');
var url = require('url');

var zeppelinProxy = url.parse('http://localhost:8080/api/');
zeppelinProxy.route = '/zeppelin';

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
    logLevel: 'debug', // for a rainbow console
    server: {
      baseDir: "",
      directory: true,
    },
    middleware: [proxy(zeppelinProxy)]
  });
});

gulp.task('eslint', function() {
  return gulp.src([
      'src/**/*.js*'
    ])
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint({
      // Load a specific ESLint config
      configFile: '.eslintrc.json'
    }))
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError());
});
gulp.task('default', ['eslint']);