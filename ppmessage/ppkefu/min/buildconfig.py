build_config = {

    "buildHtmlFile": "../../resource/html/ppkefu-index.html",
    "buildHtmlTemplateFile": "../../resource/html/ppkefu-index.html.template",
    
    "buildHeadFile": "../src/js/head.js",
    
    "buildCssPath": "../../resource/assets/ppkefu/assets/css",
    "buildJsPath": "../../resource/assets/ppkefu/assets/js",
    "buildFontPath": "../../resource/assets/ppkefu/assets/fonts",
    
    "htmlPath": "../src/html",
    "scssPath": "../src/scss",
    
    "scss": [
        "../src/scss/ionic.ppmessage.scss",
        "../src/scss/_variables.scss",
        "../src/scss/_action_sheet.scss",
        "../src/scss/_add_member_modal.scss",
        "../src/scss/_addpage.scss",
        "../src/scss/_animate.scss",
        "../src/scss/_base.scss",
        "../src/scss/_bigmic.scss",
        "../src/scss/_change_avatar.scss",
        "../src/scss/_change_signature.scss",
        "../src/scss/_chat.scss",
        "../src/scss/_chattool.scss",
        "../src/scss/_chattool_new.scss",
        "../src/scss/_contact_item.scss",
        "../src/scss/_contact_list.scss",
        "../src/scss/_content.scss",
        "../src/scss/_conversation_item.scss",
        "../src/scss/_conversation_list.scss",
        "../src/scss/_conversation_member.scss",
        "../src/scss/_image_modal.scss",
        "../src/scss/_mixins.scss",
        "../src/scss/_popover.scss",
        "../src/scss/_profile.scss",
        "../src/scss/_search_modal.scss",
        "../src/scss/_setting_list.scss",
        "../src/scss/_sidemenu.scss",
        "../src/scss/_sidemenu_header.scss",
        "../src/scss/_text_modal.scss",
        "../src/scss/_userdetail.scss"
    ],

    "js": [
        
        "../src/js/head.js",
        "../src/js/module.js",
        "../src/js/routers.js",
        "../src/js/i18n.js",
        "../src/js/app.js",

        "../src/js/services/constants.js",
        "../src/js/services/util.js",
        "../src/js/services/log.js",
        "../src/js/services/ssl.js",
        "../src/js/services/file.js",
        "../src/js/services/alert.js",
        "../src/js/services/api.js",
        "../src/js/services/type.js",
        "../src/js/services/sqldb.js",
        "../src/js/services/notification.js",
        "../src/js/services/push.js",
        "../src/js/services/user.js",
        "../src/js/services/send.js",
        "../src/js/services/message.js",
        "../src/js/services/sys.js",
        "../src/js/services/mime.js",
        "../src/js/services/uploader.js",
        "../src/js/services/login.js",
        "../src/js/services/logout.js",
        "../src/js/services/nav.js",
        "../src/js/services/link.js",
        "../src/js/services/localization.js",
        "../src/js/services/filechooser.js",
        "../src/js/services/delegate.js",
        "../src/js/services/updater.js",
        "../src/js/services/object.js",
        "../src/js/services/contact.js",
        "../src/js/services/conversation.js",
        "../src/js/services/base.js",
        "../src/js/services/main.js",
        "../src/js/services/test.js",
        "../src/js/services/monitor.js",
        "../src/js/services/menu.js",

        "../src/js/directives/message.js",
        "../src/js/directives/text-message.js",
        "../src/js/directives/txt-message.js",
        "../src/js/directives/file-message.js",
        "../src/js/directives/image-message.js",
        "../src/js/directives/audio-message.js",
        "../src/js/directives/double-click.js",
        "../src/js/directives/click.js",

        "../src/js/directives/chat-tool.js",
        "../src/js/directives/adding-button.js",
        "../src/js/directives/big-mic-button.js",
        "../src/js/directives/recording-status.js",
        "../src/js/directives/dynamic-height.js",

        "../src/js/directives/new-chat-tool.js",

        "../src/js/directives/hide-tabs.js",

        "../src/js/directives/crop-image.js",
        "../src/js/directives/change-avatar.js",

        "../src/js/directives/image-modal.js",
        "../src/js/directives/text-modal.js",
        "../src/js/directives/file-chooser-modal.js",
        "../src/js/directives/search-modal.js",
        "../src/js/directives/conversation-member.js",
        "../src/js/directives/add-member-modal.js",
        "../src/js/directives/add-member-by-contact.js",
        "../src/js/directives/add-member-by-group.js",

        "../src/js/directives/sidemenu-header.js",
        "../src/js/directives/conversation.js",
        "../src/js/directives/contact.js",

        "../src/js/directives/rightclick.js",
        "../src/js/directives/contextmenu-in-list.js",


        "../src/js/directives/user-info-modal.js",

        "../src/js/controllers/noapp.js",
        "../src/js/controllers/main-with-logo.js",
        "../src/js/controllers/auto-login.js",
        "../src/js/controllers/login-error.js",
        "../src/js/controllers/login-no-user.js",
        "../src/js/controllers/login-with-user.js",
        "../src/js/controllers/add-server.js",
        "../src/js/controllers/switch-server.js",

        "../src/js/controllers/app.js",

        "../src/js/controllers/conversation-list.js",
        "../src/js/controllers/conversation.js",
        "../src/js/controllers/message.js",

        "../src/js/controllers/contact-list.js",
        "../src/js/controllers/contact.js",

        "../src/js/controllers/setting-list.js",
        "../src/js/controllers/switch-language.js",
        "../src/js/controllers/switch-app.js",
        "../src/js/controllers/about.js",

        "../src/js/controllers/change-avatar.js",
        "../src/js/controllers/change-fullname.js",
        "../src/js/controllers/change-signature.js",
        "../src/js/controllers/push-notification.js",
    ],

    "libJs": [
        "../src/lib/jscd.js",
        "../src/lib/sha1.js",
        "../src/lib/sha1file.js",
        "../src/lib/base64.js",
        "../src/lib/base64binary.js",
        "../src/lib/moment-with-zh-cn-locale.js",

        "../../resource/share/bower_components/jquery/dist/jquery.js",
        "../../resource/share/bower_components/Jcrop/js/Jcrop.js",

        "../../resource/share/bower_components/ionic/js/ionic.bundle.js",
        "../../resource/share/bower_components/angular-cookies/angular-cookies.js",
        "../../resource/share/bower_components/angular-translate/angular-translate.js",
        "../../resource/share/bower_components/angular-block-ui/dist/angular-block-ui.js",
        "../../resource/share/bower_components/angular-file-upload/dist/angular-file-upload.js",
        "../../resource/share/bower_components/angular-base64/angular-base64.js"
    ],

    "libCss": [
        "../src/css/hide-tabs.css",
        "../src/css/user-info-settings.css",
        "../../resource/share/bower_components/Jcrop/css/Jcrop.css",
        "../../resource/share/bower_components/angular-block-ui/dist/angular-block-ui.css"
    ]
};
