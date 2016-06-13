module.exports = {

    halfBuildPath: "../app/build",

    buildCssPath: "../../resource/assets/ppkefu/assets/css",
    buildJsPath: "../../resource/assets/ppkefu/assets/js",
    buildFontPath: "../../resource/assets/ppkefu/assets/fonts",
    
    html: ["../app/html/**/*.html"],
    css: ["../app/css/*.css"],
    scss: ["../app/scss/*.scss"],
    js: [

        // Module
        "../app/js/head.js",
        "../app/js/module.js",
        "../app/js/starter.js",
        "../app/js/routers.js",
        "../app/js/i18n.js",
        "../app/js/app.js",

        // Service
        "../app/js/services/constants.js",
        "../app/js/services/util.js",
        "../app/js/services/log.js",
        "../app/js/services/ssl.js",
        "../app/js/services/file.js",
        "../app/js/services/alert.js",
        "../app/js/services/api.js",
        "../app/js/services/type.js",
        "../app/js/services/sqldb.js",
        "../app/js/services/notification.js",
        "../app/js/services/push.js",
        "../app/js/services/user.js",
        "../app/js/services/send.js",
        "../app/js/services/message.js",
        "../app/js/services/peer.js",
        "../app/js/services/sys.js",
        "../app/js/services/mime.js",
        "../app/js/services/uploader.js",
        "../app/js/services/login.js",
        "../app/js/services/logout.js",
        "../app/js/services/nav.js",
        "../app/js/services/link.js",
        "../app/js/services/localization.js",
        "../app/js/services/filechooser.js",
        "../app/js/services/delegate.js",
        "../app/js/services/updater.js",
        "../app/js/services/object.js",
        "../app/js/services/contact.js",
        "../app/js/services/conversation.js",
        "../app/js/services/base.js",
        "../app/js/services/main.js",
        "../app/js/services/test.js",
        "../app/js/services/monitor.js",
        "../app/js/services/menu.js",

        // DIRECTIVE: CHAT-MESSAGE
        "../app/js/directives/message.js",
        "../app/js/directives/text-message.js",
        "../app/js/directives/txt-message.js",
        "../app/js/directives/file-message.js",
        "../app/js/directives/image-message.js",
        "../app/js/directives/audio-message.js",
        "../app/js/directives/double-click.js",
        "../app/js/directives/click.js",

        // DIRECTIVE: CHAT-TOOL OLD STYLE
        "../app/js/directives/chat-tool.js",
        "../app/js/directives/adding-button.js",
        "../app/js/directives/big-mic-button.js",
        "../app/js/directives/recording-status.js",
        "../app/js/directives/dynamic-height.js",

        // DIRECTIVE: CHAT-TOOL NEW STYLE-->
        "../app/js/directives/new-chat-tool.js",

        // DIRECTIVE: HIDE-TABS
        "../app/js/directives/hide-tabs.js",

        // DIRECTIVE: IMAGE-CROP
        "../app/js/directives/crop-image.js",
        "../app/js/directives/change-avatar.js",

        // DIRECTIVE: MODAL
        "../app/js/directives/image-modal.js",
        "../app/js/directives/text-modal.js",
        "../app/js/directives/file-chooser-modal.js",
        "../app/js/directives/search-modal.js",
        "../app/js/directives/conversation-member.js",
        "../app/js/directives/add-member-modal.js",
        // "../app/js/directives/select-group-user-modal.js",
        "../app/js/directives/add-member-by-contact.js",
        "../app/js/directives/add-member-by-group.js",

        // DIRECTIVE: POPOVER
        "../app/js/directives/sidemenu-header.js",
        "../app/js/directives/conversation.js",
        "../app/js/directives/contact.js",

        "../app/js/directives/rightclick.js",
        "../app/js/directives/contextmenu-in-list.js",


        // DIRECTIVE: USERINFOSETTINGS
        "../app/js/directives/user-info-modal.js",

        // CONTROLLER: NOAPP
        "../app/js/controllers/noapp.js",
        "../app/js/controllers/main-with-logo.js",
        "../app/js/controllers/auto-login.js",
        "../app/js/controllers/login-error.js",
        "../app/js/controllers/login-no-user.js",
        "../app/js/controllers/login-with-user.js",
        "../app/js/controllers/add-server.js",
        "../app/js/controllers/switch-server.js",

        // CONTROLLER: APP
        "../app/js/controllers/app.js",

        // CONTROLLER: APP.CONVERSATIONS
        "../app/js/controllers/conversation-list.js",
        "../app/js/controllers/conversation.js",
        "../app/js/controllers/message.js",

        // CONTROLLER: APP.CONTACTS
        "../app/js/controllers/contact-list.js",
        "../app/js/controllers/contact.js",

        // CONTROLLER: APP.SETTINGS
        "../app/js/controllers/setting-list.js",
        "../app/js/controllers/switch-language.js",
        "../app/js/controllers/switch-app.js",
        "../app/js/controllers/about.js",

        "../app/js/controllers/change-avatar.js",
        "../app/js/controllers/change-fullname.js",
        "../app/js/controllers/change-signature.js",
        "../app/js/controllers/push-notification.js",
    ],

    libJs: [
        "../app/lib/jscd.js",
        "../app/lib/sha1.js",
        "../app/lib/sha1file.js",
        "../app/lib/base64.js",
        "../app/lib/base64binary.js",
        "../app/lib/moment-with-zh-cn-locale.js",

        // "../bower/bower_components/base64/base64.js",

        // use Jcrop's jquery v1.9.0
        "../bower/bower_components/Jcrop/js/jquery.min.js",
        "../bower/bower_components/Jcrop/js/Jcrop.js",

        // use ionic's angular v1.4.3
        "../bower/bower_components/ionic/js/ionic.bundle.js",
        "../bower/bower_components/angular-cookies/angular-cookies.js",
        "../bower/bower_components/angular-translate/angular-translate.js",
        "../bower/bower_components/angular-block-ui/dist/angular-block-ui.js",
        "../bower/bower_components/angular-file-upload/angular-file-upload.js",
        "../bower/bower_components/angular-base64/angular-base64.js"
    ],

    libCss: [
        "../app/css/*.css",
        "../bower/bower_components/Jcrop/css/Jcrop.css",
        "../bower/bower_components/angular-block-ui/dist/angular-block-ui.css"
    ]
};
