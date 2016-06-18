var os = require("os");
var fs = require("fs");
var path = require('path');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var args = require("get-gulp-args")();
var replace = require('gulp-replace');
var cleanCss = require('gulp-clean-css');
var ngAnnotate = require('gulp-ng-annotate');
var ngCache = require("gulp-angular-templatecache");

var min_js = true;

var buildConfig = require("./build.config.js");

var watching_paths = {
    scripts: [
        '../src/js/*.js',
        '../src/js/**/*.js',
        '../src/js/**/**/*.js'
    ],
    css: [
        '../src/css/*.css'
    ],
    html: [
        '../src/html/*.html'
    ],
    config: ['./build.config.js']
};

gulp.task('default', ['css', 'css-lib', 'js', 'js-lib', 'font', 'ngcache']);

gulp.task('css', function(done) {
    gulp.src(buildConfig.cssFiles)
        .pipe(concat('ppconfig.css'))
        .pipe(gulp.dest(buildConfig.buildPath))
        .pipe(cleanCss())
        .on('error', function(e) {
            console.log(e);        
            done();
        })
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(buildConfig.buildPath))
        .on('end', done);
});

gulp.task('css-lib', function(done) {
    gulp.src(buildConfig.cssLibFiles)
        .pipe(concat('lib.css'))
        .pipe(gulp.dest(buildConfig.buildPath))
        .pipe(cleanCss())
        .on('error', function(e) {
            console.log(e);        
            done();
        })
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(buildConfig.buildPath))
        .on('end', done);
});

gulp.task('js', function(done) {
    gulp.src(buildConfig.scriptFiles)
        .pipe(concat('ppconfig.js'))
        .pipe(gulp.dest(buildConfig.buildPath))
        .pipe(gulpif(min_js, ngAnnotate()))
        .pipe(gulpif(min_js, uglify()))
        .on('error', function(e) {
            console.log(e);
            done();        
        })
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(buildConfig.buildPath))
        .on('end', done);
});

gulp.task('js-lib', function(done) {
    gulp.src(buildConfig.scriptLibFiles)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(buildConfig.buildPath))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(buildConfig.buildPath))
        .on('end', done);
});

gulp.task('font', function(done) {
    gulp.src(buildConfig.fontFiles)
        .pipe(gulp.dest(buildConfig.buildPath))
        .on("end", done);
});

gulp.task('icon', function(done) {
    gulp.src(buildConfig.icon).pipe(gulp.dest(buildConfig.iconPath)).on("end", done);
});

gulp.task("ngcache", function(done) {
    gulp.src(buildConfig.html)
        .pipe(ngCache("templates.js", {
            root: "templates",
            module: "this_app"
        }))
        .pipe(gulp.dest(buildConfig.buildPath))
        .pipe(uglify())
        .on("error", function(e) {
            console.log(e);
            done();
        })
        .pipe(rename({"extname": ".min.js"}))
        .pipe(gulp.dest(buildConfig.buildPath))
        .on("end", done);
});

gulp.task('refresh-config', function(done) {
    var pwd = path.resolve() + "/build.config.js";
    delete require.cache[pwd];
    buildConfig = require("./build.config.js");
    done();
});

gulp.task('watch', ['default'], function() {
    gulp.watch(watching_paths.css, ['watch-css']);
    gulp.watch(watching_paths.scripts, ['default']);
    gulp.watch(watching_paths.config, ['refresh-config', 'default']);
    gulp.watch(watching_paths.html, ['default']);
});
