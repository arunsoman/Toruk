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
