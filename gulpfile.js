
var gulp = require('gulp');

var stylus = require('gulp-stylus');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');

gulp.task('default',['watch:all']);

gulp.task('styles', function () {
  gulp.src('app/main.styl')
      .pipe(stylus({'include css':true}))
      .pipe(gulp.dest('build/'));
});

gulp.task('scripts',function(){
  gulp.src(['app/*.js','vendor/*.js'])
      .pipe(concat('main.js'))
      // .pipe(uglify())
      // .pipe(minify())
      .pipe(gulp.dest('build/'));
});

gulp.task('watch:all',['styles','scripts'],function(){
  gulp.watch(['app/js/*.js','vendor/*.js'],function(){
    gulp.start('scripts');
  });

  gulp.watch(['app/plugin-css/*.css','app/styl/*.styl'],function(){
    gulp.start('styles');
  });
});





