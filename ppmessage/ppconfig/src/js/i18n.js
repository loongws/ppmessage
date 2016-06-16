/*
 *  dingguijin@gmail.com
 *  Copyright (c) 2010-2016
 */

angular.module("this_app.i18n", ["pascalprecht.translate"])
    .constant("yvTransTags", {
        en: {
            COPYRIGHT_PPMESSAGE: "PPMessage.",
        },

        cn: {
            COPYRIGHT_PPMESSAGE: "PPMessage.",
        },
    })

    .config(function($translateProvider, yvTransTags) {

        $translateProvider.translations("en", yvTransTags.en);
        $translateProvider.translations("zh-CN", yvTransTags.cn);

        $translateProvider.registerAvailableLanguageKeys(["en", "zh-CN"], {
            "en": "en",
            "en-US": "en",
            "en-UK": "en",
            "zh-CN": "zh-CN"
        });

        $translateProvider.determinePreferredLanguage(function() {
            return window.navigator.userLanguage || window.navigator.language;
            //return "zh-CN"
        });

        $translateProvider.fallbackLanguage("en", "zh-CN");

    });
