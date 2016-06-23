var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var fs = require('fs');
var os = require('os');
var del = require('del');
var path = require('path');
var args = require('get-gulp-args')();
var buildConfig = require("./build.config.js");

var mode = "scripts";

var watchingPaths = {
    scripts: ['../src/**/*.js'],
    css: ['../src/css/**/*.css'],
    config: ['./build.config.js']
};

gulp.task('default', [mode]);
gulp.task('css', function(done) {
    gulp.src(buildConfig.cssFiles)
        .pipe(concat('pp-lib.css'))
        .pipe(gulp.dest(buildConfig.distPath))
        .pipe(cleanCss())
        .pipe(replace('"', '\''))
        .pipe(replace('\n', ''))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(buildConfig.distPath))
        .on('end', done);
});

gulp.task('merge', ['css'], function(done) {
    var min_path = buildConfig.distPath + "/pp-lib.min.css";
    var css = fs.readFileSync(min_path, "utf8");
    gulp.src("../src/view/pp-view-element-css.js")
        .pipe(replace('{css}', css))
        .pipe(rename({ extname: '.replaced.js' }))
        .pipe(gulp.dest("../src/view"))
        .on('end', done);
});

gulp.task('dev', ['merge'], function(done) {
    gulp.src(buildConfig.scriptFiles)
        .pipe(concat('pp-library-template.js'))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(buildConfig.distPath))
        .on('end', done);
});

gulp.task('scripts', ['merge'], function(done) {
    gulp.src(buildConfig.scriptFiles)
        .pipe(concat('pp-library-template.js'))
        .pipe(gulp.dest(buildConfig.distPath))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .on('error', function(e) {
            console.log(e);
            done();        
        })
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(buildConfig.distPath))
        .on('end', done);
});

// CLEAN source code on complected
gulp.task('clean:src', [ mode ], function(done) {
    try {
        return del([
            buildConfig.distPath + '/pp-library-template.js',
            buildConfig.distPath + '/pp-lib.css',
            buildConfig.distPath + '/pp-lib.min.css'
        ], {
            force: true
        });
    } catch ( e )  {
        // ignore
    }
});

gulp.task('refresh-config', function(done) {
    var pwd = path.resolve() + "/build.config.js";
    delete require.cache[pwd];
    buildConfig = require("./build.config.js");
    done();
});

gulp.task('watch', ['default'], function() {
    gulp.watch(watchingPaths.css, ['default']);
    gulp.watch(watchingPaths.scripts, ['default']);
    gulp.watch(watchingPaths.config, ['refresh-config', 'default']);
});
