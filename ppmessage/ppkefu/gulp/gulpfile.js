var os = require("os");
var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var scss = require("gulp-sass");
var gutil = require("gulp-util");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var replace = require("gulp-replace");
var cleanCss = require("gulp-clean-css");
var templateCache = require("gulp-angular-templatecache");
var buildConfig = require("./build.config.js");

gulp.task("scss", generate_scss);
gulp.task("lib-css", generate_lib_css);
gulp.task("js", generate_js);
gulp.task("lib-js", generate_lib_js);
gulp.task("copy-jcrop-gif", copy_jcrop_gif);
gulp.task("copy-ionic-fonts", copy_ionic_fonts);
gulp.task("template-cache", generate_template_cache);

gulp.task("default", [
    "scss",
    "lib-css",
    "lib-js",
    "copy-jcrop-gif",
    "copy-ionic-fonts",
    "js",
    "template-cache"
]);

gulp.task("watch", ["default"], function() {
    gulp.watch(buildConfig.scss, ["scss"]);
    gulp.watch(buildConfig.css, ["lib-css"]);
    gulp.watch(buildConfig.js, ["js"]);
    gulp.watch(buildConfig.html, ["template-cache"]);
});

function generate_template_cache(done) {
    var src = buildConfig.html;
    var dest =  buildConfig.buildJsPath;

    gulp.src(src)
        .pipe(templateCache("templates.js", {
            root: "templates",
            module: "ppmessage"
        }))
        .pipe(gulp.dest(buildConfig.halfBuildPath))
        .pipe(uglify())
        .on("error", function(e) {
            console.log(e);
            done();
        })
        .pipe(rename({"extname": ".min.js"}))
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function generate_js(done) {
    var src = buildConfig.js;
    var dest = buildConfig.buildJsPath;

    gulp.src(src)
        .pipe(concat("ppkefu-template.js"))
        .pipe(gulp.dest(buildConfig.halfBuildPath))
        .pipe(uglify())
        .on("error", function(e) {
            console.log(e);
            done();
        })
        .pipe(rename({"extname": ".min.js"}))
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function generate_scss(done) {
    var src = "../src/scss/ionic.ppmessage.scss";
    var dest = buildConfig.buildCssPath;

    gulp.src(src)
        .pipe(scss({
            includePaths: [
                "../../resource/share/bower_components/ionic/scss"
            ]}
        ))
        .pipe(gulp.dest(buildConfig.halfBuildPath))
        .pipe(cleanCss({ keepSpecialComments: 0 }))
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function generate_lib_js(done) {
    var src = buildConfig.libJs;
    var dest = buildConfig.buildJsPath;

    gulp.src(src)
        .pipe(concat("lib.js"))
        .pipe(gulp.dest(buildConfig.halfBuildPath))
        .on("error", function(e) {
            console.log(e);
            done();
        })
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function generate_lib_css(done) {
    var src = buildConfig.libCss;
    var dest = buildConfig.buildCssPath;

    gulp.src(src)
        .pipe(concat("lib.css"))
        .pipe(gulp.dest(buildConfig.halfBuildPath))
        .pipe(cleanCss({ keepSpecialComments: 0 }))
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function copy_ionic_fonts(done) {
    var src = "../../resource/share/bower_components/ionic/fonts/*";
    var dest = buildConfig.buildFontPath;

    gulp.src(src)
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function copy_jcrop_gif(done) {
    var src =  "../../resource/share/bower_components/Jcrop/css/Jcrop.gif";
    var dest =  buildConfig.buildCssPath;

    gulp.src(src)
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function get_ppkefu_version() {
    var data = fs.readFileSync("package.json", "utf-8");
    var package = JSON.parse(data);
    return package.version;
}

function colorfulText(text) {
    if (typeof text == "string" && text.length == 0) {
        return gutil.colors.red("Not specified, resolve this issue and run gulp again.");
    }
    return gutil.colors.green(text);
}

function generate_head_js() {
    var src = "../src/js/head.template.js";
    var dst = "../src/js/head.js"
    var ver = get_ppkefu_version()
    
    gulp.src(src)
        .pipe(replace("{{version}}", ver))
        .pipe(gulp.dest(dst))
        .on("end", done);
}
