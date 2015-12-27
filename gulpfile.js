
var gulp = require('gulp');

var stylus = require('gulp-stylus');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');

gulp.task('default',['watch:all']);

gulp.task('styles', function () {
  gulp.src(['app/main.styl'])
      .pipe(stylus({'include css':true}))
      .pipe(gulp.dest('build/'));
});

gulp.task('scripts',function(){
  gulp.src(['vendor/jquery-2.1.4.min.js',
            'vendor/core.js',
            'vendor/clipher-core.js',
            'vendor/enc-base64.js',
            'vendor/aes.js',
            'vendor/unslider.js',
            'vendor/jquery.cxselect.min.js',//vendor directory load end
            'app/js/*.js'])
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





