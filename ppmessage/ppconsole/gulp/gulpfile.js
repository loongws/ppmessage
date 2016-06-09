var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var path = require('path');
var args = require("get-gulp-args")();
var replace = require('gulp-replace');
var os = require("os");
var fs = require("fs");

var buildConfig = require("./build.config.js");

var watching_paths = {
    scripts: [
        '../../resource/assets/ppconsole/static/js/*.js',
        '../../resource/assets/ppconsole/static/js/**/*.js',
        '../../resource/assets/ppconsole/static/js/**/**/*.js'
    ],
    css: [
        '../../resource/assets/ppconsole/static/css/*.css'
    ],
    html: [
        '../../resource/assets/ppconsole/static/html/*.html'
    ],
    config: ['./build.config.js']
};

var _get_bootstrap_data = function() {
    var data = fs.readFileSync("../../bootstrap/data.py", "utf8");
    data = data.slice(data.search("BOOTSTRAP_DATA"));
    data = eval(data);
    return data;
};

var bootstrap_data = _get_bootstrap_data();
var min_js = false;
if (bootstrap_data.js.min == "yes") {
    min_js = true;
}

gulp.task('default', ['user']);
gulp.task('user', ['user-css', 'user-scripts']);

gulp.task('user-css', function(done) {
    gulp.src(buildConfig.cssFiles.user)
        .pipe(concat('ppconsole.css'))
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

gulp.task('user-scripts', function(done) {
    gulp.src(buildConfig.scriptFiles.user)
        .pipe(concat('ppconsole.js'))
        .pipe(replace('{ppconsole_api_uuid}', bootstrap_data.PPCONSOLE.api_uuid))
        .pipe(replace('{ppconsole_api_key}', bootstrap_data.PPCONSOLE.api_key))
        .pipe(replace('{ppconsole_api_secret}', bootstrap_data.PPCONSOLE.api_secret))
        .pipe(replace('{ppmessage_app_uuid}', bootstrap_data.team.app_uuid))
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
