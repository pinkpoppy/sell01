
var gulp = require('gulp');
var stylus = require('gulp-stylus');

// var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');

gulp.task('styles', function () {
  gulp.src('/app/styl/main.styl')
      .pipe(stylus())
      .pipe(gulp.dest('build/main.css'));
});

//var watcher = gulp.watch('/app/stylus/main.styl',['default']);

