
var gulp = require('gulp');

var stylus = require('gulp-stylus');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var minifyCSS = require('gulp-minify-css');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');


gulp.task('default',['watch:all']);

//Build
gulp.task('watch:all',['styles',
                      'venderjs',
                      'appjs',
                      'privateScripts',
                      'styles-nocache',
                      'venderjs-nocache',
                      'appjs-nocache',
                      'privateScripts-nocache'],function(){

  gulp.watch(['vendor/*.js'],function(){
    gulp.start('venderjs');
  });

  gulp.watch(['app/js/app.js'],function(){
    gulp.start('appjs');
  });

  gulp.watch(['app/js/privatejs/*.js'],function(){
    gulp.start('privateScripts')
  });

  gulp.watch(['app/plugin-css/*.css','app/styl/*.styl'],function(){
    gulp.start('styles');
  });
});

gulp.task('styles', function () {
  gulp.src(['app/main.styl'])
      .pipe(stylus({'include css':true}))
      .pipe(minifyCSS({keepSpecialComments:1}))
      .pipe(gulp.dest('build/'));
});

gulp.task('venderjs',function(){
  gulp.src(['vendor/core.js',
            'vendor/clipher-core.js',
            'vendor/enc-base64.js',
            'vendor/aes.js',
            'vendor/unslider.js',
            'vendor/pingpp.js',
            'vendor/jquery.cxselect.min.js'])
      .pipe(concat('vendor.js'))
      .pipe(jsmin())
      .pipe(rename({suffix:'.min'}))
      // .pipe(uglify())
      //.pipe(minify())
      .pipe(gulp.dest('build/'));
});

gulp.task('appjs',function(){
  gulp.src(['app/js/app.js',
            'app/js/utilities.js'])
    .pipe(jsmin())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('build/'))

});

gulp.task('privateScripts',function(){
  gulp.src(['app/js/privatejs/*.js'])
    //.pipe(uglify())
    //.pipe(minify())
    .pipe(jsmin())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('build/privatejs/'))
});



//Build-no-cache-version
gulp.task('styles-nocache', function () {
  gulp.src(['app/main.styl'])
      .pipe(stylus({'include css':true}))
      .pipe(minifyCSS({keepSpecialComments:1}))
      .pipe(gulp.dest('build-nocache/'));
});

gulp.task('venderjs-nocache',function(){
  gulp.src(['vendor/core.js',
            'vendor/clipher-core.js',
            'vendor/enc-base64.js',
            'vendor/aes.js',
            'vendor/unslider.js',
            'vendor/pingpp.js',
            'vendor/jquery.cxselect.min.js'])
      .pipe(concat('vendor.js'))
      .pipe(jsmin())
      .pipe(rename({suffix:'.min'}))
      // .pipe(uglify())
      //.pipe(minify())
      .pipe(gulp.dest('build-nocache/'));
});

gulp.task('appjs-nocache',function(){
  gulp.src(['app/js/app.js',
            'app/js/utilities.js'])
    .pipe(jsmin())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('build-nocache/'))
});

gulp.task('privateScripts-nocache',function(){
  gulp.src(['app/js/privatejs/*.js'])
    //.pipe(uglify())
    //.pipe(minify())
    .pipe(jsmin())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('build-nocache/privatejs/'))
});




