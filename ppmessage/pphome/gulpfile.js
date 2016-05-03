var fs = require('fs');
var os = require('os');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var args = require('get-gulp-args')();

var _get_bootstrap_data = function() {
    var data = fs.readFileSync("../bootstrap/data.py", "utf8");
    data = data.slice(data.search("BOOTSTRAP_DATA"));
    data = eval(data);
    return data;
};

var bootstrap_data = _get_bootstrap_data();
var app_uuid = bootstrap_data.team.app_uuid;

gulp.task('default', ["js"]);

gulp.task('js', function(done) {
    gulp.src(["static/ppmessage/js/basic.template.js"])
        .pipe(replace('{app_uuid}', app_uuid))
        .pipe(rename('basic.js'))
        .pipe(gulp.dest("static/ppmessage/js"))
        .on('end', done);
});

