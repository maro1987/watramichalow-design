var gulp = require('gulp'),
  gutil = require('gulp-util'),
  browserify = require('gulp-browserify'),
  compass = require('gulp-compass'),
  connect = require('gulp-connect'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  scsslint = require('gulp-scss-lint'),
  path = require('path');

var env,
  sassSources,
  outputDir,
  sassStyle;

env = 'development';

if (env === 'development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

sassSources = [
  'components/sass/style.scss'
];

gulp.task('scss-lint', function () {
   gulp.src(['components/sass/*.scss', 'components/sass/*/*.scss'])
    .pipe(scsslint())
    .pipe(connect.reload());
});

gulp.task('compass', function () {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      css: outputDir + 'css',
      image: outputDir + 'images',
      style: sassStyle,
      require: ['susy', 'breakpoint']
    }).on('error', gutil.log))
    .pipe(connect.reload());
});

gulp.task('html', function () {
  gulp.src('builds/development/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['components/sass/*.scss', 'components/sass/*/*.scss', 'components/sass/**/*.scss'], ['scss-lint', 'compass']);
  gulp.watch('builds/development/*.html', ['html']);
});

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('default', ['watch', 'html', 'scss-lint', 'compass', 'connect']);