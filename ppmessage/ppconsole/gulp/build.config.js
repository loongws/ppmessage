module.exports = {
    html: ["../src/html/**/*.html"],

    buildPath: "../../resource/assets/ppconsole/static/dist/",

    scriptFiles: [
        "../src/js/version.js",
        "../src/js/global.js",

        "../src/js/constants.js",
        "../src/js/i18n.js",
        "../src/js/route.js",

        "../src/js/thisapp.js",

        "../src/js/services/rest.js",
        "../src/js/services/ajax.js",
        "../src/js/services/user.js",
        "../src/js/services/mime.js",
        "../src/js/services/util.js",
        "../src/js/services/doc.js",
        "../src/js/services/type.js",
        "../src/js/services/log.js",
        "../src/js/services/debug.js",
        "../src/js/services/login.js",

        "../src/js/services/application/grouping.js",
        "../src/js/services/application/people.js",
        "../src/js/services/application/callback.js",

        "../src/js/services/app.js",
        "../src/js/services/logineduser.js",

        "../src/js/controllers/logout.js",
        "../src/js/controllers/signin.js",
        "../src/js/controllers/app.js",
        
        "../src/js/controllers/settings/settings.js",
        "../src/js/controllers/settings/teamprofile.js",
        "../src/js/controllers/settings/integrate.js",
        "../src/js/controllers/settings/account.js",
        "../src/js/controllers/settings/profile.js",
        "../src/js/controllers/settings/people.js",
        "../src/js/controllers/settings/welcome.js",
        "../src/js/controllers/settings/messageroute.js",
        "../src/js/controllers/settings/grouping.js",

        "../src/js/controllers/statistics/overview.js",
        "../src/js/controllers/statistics/historymessage.js",

        "../src/js/directives/focusme.js",
        "../src/js/directives/uniform.js",
        "../src/js/directives/slimscroll.js",
        "../src/js/directives/datatable.js",
        "../src/js/directives/daterange.js",
        "../src/js/directives/href.js",

        "../src/js/directives/clipboard.js",
        "../src/js/directives/colorpicker.js",

        "../src/js/directives/historymessage/message.js",
        "../src/js/directives/historymessage/textMessage.js",
        "../src/js/directives/historymessage/txtMessage.js",
        "../src/js/directives/historymessage/imageMessage.js",
        "../src/js/directives/historymessage/fileMessage.js",

        "../src/js/bootstrap.js"
    ],

    scriptLibFiles: [
        "../../resource/share/bower_components/js-sha1/build/sha1.min.js",
        "../../resource/share/bower_components/jquery/dist/jquery.min.js",
        "../../resource/share/bower_components/bootstrap/dist/js/bootstrap.min.js",
        "../../resource/share/bower_components/moment/min/moment-with-locales.min.js",
        "../../resource/share/bower_components/tinycolor/tinycolor.js",
        "../../resource/share/bower_components/bootstrap-colorpickersliders/dist/bootstrap.colorpickersliders.min.js",
        "../../resource/share/bower_components/bootstrap-daterangepicker/daterangepicker.js",
        "../../resource/share/bower_components/Chart.js/Chart.js",
        "../../resource/share/bower_components/moment-range/dist/moment-range.min.js",
        
        "../../resource/share/bower_components/angular/angular.min.js",
        
        "../../resource/share/bower_components/angular-aria/angular-aria.js",
        "../../resource/share/bower_components/angular-animate/angular-animate.js",
        "../../resource/share/bower_components/angular-messages/angular-messages.min.js",
        
        "../../resource/share/bower_components/angular-cookies/angular-cookies.min.js",
        "../../resource/share/bower_components/angular-file-upload/dist/angular-file-upload.min.js",
        "../../resource/share/bower_components/angular-block-ui/dist/angular-block-ui.min.js",
        "../../resource/share/bower_components/angular-utils-pagination/dirPagination.js",
        "../../resource/share/bower_components/angular-translate/angular-translate.min.js",
        "../../resource/share/bower_components/angular-ui-router/release/angular-ui-router.min.js",
        "../../resource/share/bower_components/angular-base64/angular-base64.min.js",
        "../../resource/share/bower_components/angular-tooltips/dist/angular-tooltips.min.js",
        "../../resource/share/bower_components/angular-toastr/dist/angular-toastr.tpls.js",
        "../../resource/share/bower_components/angular-material/angular-material.min.js",
        
    ],
    
    cssFiles: [
        "../src/css/header.css",
        "../src/css/main.css",
        "../src/css/login.css",
        "../src/css/settings.css",
        "../src/css/404.css",
    ],

    cssLibFiles: [
        "../../resource/share/bower_components/material-design-icons/iconfont/material-icons.css",
        "../../resource/share/bower_components/bootstrap/dist/css/bootstrap.min.css",
        "../../resource/share/bower_components/bootstrap-colorpickersliders/dist/bootstrap.colorpickersliders.min.css",
        "../../resource/share/bower_components/bootstrap-daterangepicker/daterangepicker.css",
        "../../resource/share/bower_components/angular-tooltips/dist/angular-tooltips.min.css",
        "../../resource/share/bower_components/angular-toastr/dist/angular-toastr.min.css",
        "../../resource/share/bower_components/angular-material/angular-material.min.css"
    ],

    fontFiles: [
        "../../resource/share/bower_components/material-design-icons/iconfont/codepoints",
        "../../resource/share/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.eot",
        "../../resource/share/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.ttf",
        "../../resource/share/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.ijmap",
        "../../resource/share/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff",
        "../../resource/share/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.svg",
        "../../resource/share/bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff2"
    ],
};
