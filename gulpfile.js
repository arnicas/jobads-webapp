'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var babelify = require('babelify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');

// Paths and filenames
var path = {
    HTML: 'src/*.html',
    SCSS: 'src/sass/style.scss',
    IMAGES: 'src/images/**/*',
    VENDORS: 'src/vendors/**/*',
    MINIFIED_OUT: 'build.min.js',
    MINIFIED_CSS_OUT: 'style.min.js',
    OUT: 'build.js',
    DEST: 'public',
    DEST_BUILD: 'public/src',
    DEST_SRC: 'public/src',
    DEST_VENDORS: 'public/vendors',
    DEST_IMAGES: 'public/images',
    ENTRY_POINT: './src/js/app.js'
};

// Copy assets
gulp.task('copy', function(){
    gulp.src(path.HTML)
        .pipe(gulp.dest(path.DEST));
    gulp.src(path.VENDORS)
        .pipe(gulp.dest(path.DEST_VENDORS));
    gulp.src(path.IMAGES)
        .pipe(gulp.dest(path.DEST_IMAGES));
});

// Build css style
gulp.task('sass', function () {
  return gulp.src(path.SCSS)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.DEST_SRC));
});

// Watch for any change
gulp.task('watch', function() {
    gulp.watch(path.HTML, ['copy']);
    gulp.watch(path.SCSS, ['sass']);
    gulp.watch(path.VENDORS, ['copy']);
    var watcher  = watchify(browserify({
        entries: [path.ENTRY_POINT],
        transform: [babelify, reactify],
        debug: true,
        cache: {}, packageCache: {}, fullPaths: true
    }));
    return watcher.on('update', function () {
        watcher.bundle()
            .on('error', function (err) {
                console.log(err.toString());
                this.emit("end");
            })
            .pipe(source(path.OUT))
            .pipe(gulp.dest(path.DEST_SRC))
        console.log('Updated');
    })
        .bundle()
        .pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST_SRC));
});

// Build the React App
gulp.task('build', function(){
    gulp.src(path.SCSS)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename(path.MINIFIED_CSS_OUT))
        .pipe(gulp.dest(path.DEST_BUILD));
    browserify({
        entries: [path.ENTRY_POINT],
        transform: [babelify, reactify],
        debug: false
    })
        .bundle()
        .pipe(source(path.MINIFIED_OUT))
        .pipe(streamify(uglify(path.MINIFIED_OUT)))
        .pipe(gulp.dest(path.DEST_BUILD));
});

// Include the build script in HTML main page 
gulp.task('replaceHTML', function(){
    gulp.src(path.HTML)
        .pipe(htmlreplace({
            'css': {
                src : 'src/' + path.MINIFIED_CSS_OUT,
                tpl: '<link type="text/css" rel="stylesheet" href="%s"  media="all"/>'
            },
            'js': 'src/' + path.MINIFIED_OUT
        }))
        .pipe(gulp.dest(path.DEST));
});

// Production : replace HTML and build the app
gulp.task('production', ['replaceHTML', 'build']);

// Default : watch
gulp.task('default', ['watch']);