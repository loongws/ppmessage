var os = require("os");
var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var scss = require("gulp-sass");
var gutil = require("gulp-util");
var xmlParser = require("xml2json");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var replace = require("gulp-replace");
var cleanCss = require("gulp-clean-css");
var templateCache = require("gulp-angular-templatecache");
var buildConfig = require("./config/build.config.js");

function get_ppkefu_version () {
    var xml = fs.readFileSync("./config.xml", "utf-8");
    var json = xmlParser.toJson(xml);
    var object = JSON.parse(json);
    return object.widget.version;
}

function get_bootstrap_data () {
    var data = fs.readFileSync("../../bootstrap/data.py", "utf8");
    data = data.slice(data.search("BOOTSTRAP_DATA"));
    data = eval(data);
    return data;
}

function create_app_config(target, bootstrap_data) {
    var protocol = "http://";
    if (bootstrap_data.nginx.ssl == "on") {
        protocol = "https://";
    }
    var app_config = {
        "developer_mode": true,
        "api_key": bootstrap_data.PPKEFU.api_key,
        "sender_id": bootstrap_data.gcm.sender_id,
        "server": {
            "port": bootstrap_data.nginx.listen,
            "protocol": protocol,
            "name": bootstrap_data.server.name,
            "host": bootstrap_data.server.name
        }
    };
    var json = JSON.stringify(app_config, null, 4);
    fs.writeFile(target, json + "\n", function (err) {
        if (err) console.error(err);
    });
    return app_config;
}

function load_app_config() {
    var target = "./app.config.json";
    var bootstrap_data = get_bootstrap_data();

    try {
        fs.accessSync(target, fs.F_OK);
    } catch (err) {
        if (err.code == "ENOENT") {
            return create_app_config(target, bootstrap_data);
        }
        throw err;
    }

    var data = fs.readFileSync(target, "utf-8");
    var app_config = JSON.parse(data);
    if (bootstrap_data.PPKEFU.api_key !== app_config.api_key) {
        console.log(gutil.colors.yellow("app_config.api_key is not equal to bootstrap_data.PPKEFU.api_key"));
    }
    return app_config;
}

function colorfulText(text) {
    if (typeof text == "string" && text.length == 0) {
        return gutil.colors.red("Not specified, resolve this issue and run gulp again.");
    }
    return gutil.colors.green(text);
}

var paths = {
    sass: ["./www/scss/*.scss"],
    css: ["./www/css/*.css"],
    scripts: [
        "./www/js/*.js",
        "./www/js/**/*.js"
    ],
    config: ["./build.config.js"],
};

var app_config_path = "config/app.config.json";
var bootstrap_data_path = "../../bootstrap/data.py";
var version = get_ppkefu_version();
var appConfig = load_app_config();

console.log("------------- app config --------------");
console.log("server name      \t", colorfulText(appConfig.server.name));
console.log("server protocol  \t", colorfulText(appConfig.server.protocol));
console.log("server host      \t", colorfulText(appConfig.server.host));
console.log("server port      \t", colorfulText(appConfig.server.port));
console.log("developer mode   \t", colorfulText(appConfig.developer_mode));
console.log("overwrite mode   \t", colorfulText(appConfig.overwrite));
console.log("app version      \t", colorfulText(version));
console.log("api key          \t", colorfulText(appConfig.api_key));
console.log("gcm sender id    \t", colorfulText(appConfig.sender_id));
console.log("------------- app config --------------");

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

function generate_template_cache (done) {
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

function generate_js (done) {
    var src = buildConfig.js;
    var dest = buildConfig.buildJsPath;

    generate_head_js(function() {
        gulp.src(src)
            .pipe(concat("ppmessage.js"))
            .pipe(gulp.dest(buildConfig.halfBuildPath))
            .pipe(uglify())
            .on("error", function(e) {
                console.log(e);
                done();
            })
            .pipe(rename({"extname": ".min.js"}))
            .pipe(gulp.dest(dest))
            .on("end", done);
    });
}

function generate_scss (done) {
    var src = "app/scss/ionic.ppmessage.scss";
    var dest = buildConfig.buildCssPath;

    gulp.src(src)
        .pipe(scss())
        .pipe(gulp.dest(buildConfig.halfBuildPath))
        .pipe(cleanCss({ keepSpecialComments: 0 }))
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function generate_lib_js (done) {
    var src = buildConfig.libJs;
    var dest = buildConfig.buildJsPath;

    gulp.src(src)
        .pipe(concat("lib.js"))
        .pipe(gulp.dest(buildConfig.halfBuildPath))
        .pipe(uglify())
        .on("error", function(e) {
            console.log(e);
            done();
        })
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function generate_lib_css (done) {
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

function copy_ionic_fonts (done) {
    var src = "bower_components/ionic/fonts/*";
    var dest = buildConfig.buildFontPath;

    gulp.src(src)
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function copy_jcrop_gif (done) {
    var src =  "bower_components/Jcrop/css/Jcrop.gif";
    var dest =  buildConfig.buildCssPath;

    gulp.src(src)
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function get_ppkefu_version () {
    var data = fs.readFileSync("package.json", "utf-8");
    var package = JSON.parse(data);
    return package.version;
}

function get_bootstrap_data () {
    var data = null;
    try {
        data = fs.readFileSync(bootstrap_data_path, "utf8");
    } catch (err) {
        if (err.code == "ENOENT") {
            return null;
        }
        throw err;
    }
    data = data.slice(data.search("BOOTSTRAP_DATA"));
    return eval(data);
}

function get_app_config() {
    var config =  null;
    try {
        config = fs.readFileSync(app_config_path, "utf-8");
    } catch (err) {
        if (err.code === "ENOENT") {
            return null;
        }
        throw err;
    }
    return JSON.parse(config);
}

function create_app_config(bootstrap_data) {
    var app_config = {
        "overwrite": true,
        "developer_mode": true,
        "api_key": bootstrap_data.PPKEFU.api_key,
        "sender_id": bootstrap_data.gcm.sender_id,
        "server": {
            "port": bootstrap_data.nginx.listen,
            "protocol": (bootstrap_data.nginx.ssl === "on") ? "https://": "http://",
            "name": bootstrap_data.nginx.server_name[0] || bootstrap_data.server.name,
            "host": bootstrap_data.server.name
        }
    };
    var json = JSON.stringify(app_config, null, 4);
    fs.writeFile(app_config_path, json + "\n", function (err) {
        if (err) {
            throw err;
        }
    });
    return app_config;
}

function load_app_config() {
    var app_config = get_app_config();
    var bootstrap_data = get_bootstrap_data();
    if (app_config ===  null || app_config.overwrite !== false) {
        if (bootstrap_data === null) {
            throw gutil.colors.red("Please bootstrap PPMessage before run gulp task");
        }
        return create_app_config(bootstrap_data);
    }
    return app_config;
}

function colorfulText(text) {
    if (typeof text == "string" && text.length == 0) {
        return gutil.colors.red("Not specified, resolve this issue and run gulp again.");
    }
    return gutil.colors.green(text);
}

function generate_head_js (callback) {
    var head_path = "app/js/head.js";
    var config_string = JSON.stringify(appConfig);
    var config = JSON.parse(config_string);

    delete config.overwrite;
    config.version = version;
    config.disableOnbeforeunload = false;

    var data = "window.ppmessage = " + JSON.stringify(config, null, 4) + ";\n";
    fs.writeFile(head_path, data, function (err) {
        if (err) { throw err; }
        callback && callback();
    });
}
