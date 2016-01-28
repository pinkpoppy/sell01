
var gulp = require('gulp');

var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');
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
    gulp.start('venderjs-nocache');
  });

  gulp.watch(['app/js/app.js'],function(){
    gulp.start('appjs');
    gulp.start('appjs-nocache');
  });

  gulp.watch(['app/js/privatejs/*.js'],function(){
    gulp.start('privateScripts');
    gulp.start('privateScripts-nocache');
  });

  gulp.watch(['app/plugin-css/*.css','app/styl/*.styl'],function(){
    gulp.start('styles');
    gulp.start('styles-nocache');
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
  gulp.src(['vendor/core.js',
            'vendor/clipher-core.js',
            'vendor/enc-base64.js',
            'vendor/aes.js',
            'vendor/unslider.js',
            'vendor/pingpp.js',
            'vendor/jquery.cxselect.min.js'])
      .pipe(concat('vendor.js'))
      // .pipe(uglify())
      //.pipe(minify())
      .pipe(gulp.dest('build/'));
});

gulp.task('appjs',function(){
  gulp.src(['app/js/app.js',
            'app/js/utilities.js'])
    .pipe(jsmin())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('build/'));

  gulp.src(['app/js/app.js',
            'app/js/utilities.js'])
    .pipe(gulp.dest('build/'));

});

gulp.task('privateScripts',function(){

  gulp.src(['app/js/privatejs/*.js'])
    //.pipe(uglify())
    //.pipe(minify())
    .pipe(jsmin())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('build/privatejs/'));

  gulp.src(['app/js/privatejs/*.js'])
    //.pipe(uglify())
    //.pipe(minify())
    .pipe(gulp.dest('build/privatejs/'));
});



//Build-no-cache-version
gulp.task('styles-nocache', function () {
  gulp.src(['app/main.styl'])
      .pipe(sourcemaps.init())
      .pipe(stylus({'include css':true}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build-nocache'));

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

  gulp.src(['vendor/core.js',
            'vendor/clipher-core.js',
            'vendor/enc-base64.js',
            'vendor/aes.js',
            'vendor/unslider.js',
            'vendor/pingpp.js',
            'vendor/jquery.cxselect.min.js'])
      .pipe(concat('vendor.js'))
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

  gulp.src(['app/js/app.js',
            'app/js/utilities.js'])
    .pipe(gulp.dest('build-nocache/'))
});

gulp.task('privateScripts-nocache',function(){
  gulp.src(['app/js/privatejs/*.js'])
    //.pipe(uglify())
    //.pipe(minify())
    .pipe(jsmin())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('build-nocache/privatejs/'));

  gulp.src(['app/js/privatejs/*.js'])
    //.pipe(uglify())
    //.pipe(minify())
    .pipe(gulp.dest('build-nocache/privatejs/'))
});




