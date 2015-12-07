
var gulp = require('gulp');
var stylus = require('gulp-stylus');

// var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');

// gulp.task('styles', function () {
//   gulp.src('test.styl')
//       .pipe(stylus())
//       .pipe(gulp.dest('build/'));
// });

gulp.task('styles', function () {
  gulp.src('app/styl/main.styl')
      .pipe(stylus())
      .pipe(gulp.dest('build/'));
});


// gulp.task('watch:styles',function(){
// 	gulp.watch('**/*.styl',['styles']);
// });


