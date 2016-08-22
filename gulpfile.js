var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var vulcanize = require('gulp-vulcanize');
var proxy = require('proxy-middleware');
var url = require('url');

var proxyOptions = url.parse('http://localhost:8080');
proxyOptions.route = '/zeppelin';
proxyOptions.xfwd = true;
proxyOptions.headers = {'X-Forwarded-Host': 'localhost:3000', 'X-Forwarded-Prefix': 'api'};

var CONSTS = {
  // Set Zeppelin URL here
}

// Vulcanize
gulp.task('vulcanize', function () {
    return gulp.src('src/zeppelin-viewer.html')
      .pipe(vulcanize({
        stripComments: true,
        inlineCss: true,
        inlineScripts: true
      }))
      .pipe(gulp.dest('dist'));
});

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
        baseDir: '',
        directory: true,
        middleware: [proxy(proxyOptions)]
      }
  });
  gulp.watch('src/\*\*/\*.*').on('change', browserSync.reload);
});

gulp.task('lint', function () {
    return gulp.src([
'src/*'

                     ])
        // eslint() attaches the lint output to the eslint property 
        // of the file object so it can be used by other modules. 
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failOnError last. 
        .pipe(eslint.failOnError());
});
gulp.task('default', ['lint']);
