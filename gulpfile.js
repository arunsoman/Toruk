var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var vulcanize = require('gulp-vulcanize');

var CONSTS = {
  // Set Zeppelin URL here
  zeppelinUrl: 'http://localhost:8080'
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
        directory: true
      },
  });
  gulp.watch('src/\*\*/\*.*').on('change', browserSync.reload);
});
