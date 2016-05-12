var ppmessageModule = angular.module("ppmessage", [
    "ionic",
    "base64",
    "blockUI",
    "ngCookies",
    "ngSanitize",
    "angularFileUpload",
    "pascalprecht.translate",
]);

ppmessageModule.config([
    "$sceProvider",
    "blockUIConfig",
    "$ionicConfigProvider",
function ($sceProvider, blockUIConfig, $ionicConfigProvider) {
    $sceProvider.enabled(false);

    blockUIConfig.autoBlock = false;
    blockUIConfig.autoInjectBodyBlock = true;

    $ionicConfigProvider.views.maxCache(10);
    $ionicConfigProvider.views.swipeBackEnabled(false);

    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.tabs.style("standard");

    $ionicConfigProvider.backButton.text("");

    if (window.cordova && ionic.Platform.isAndroid()) {
        ionic.Platform.fullScreen(true, false);
        $ionicConfigProvider.scrolling.jsScrolling(false);
    }
}]).run([
    "$state",
    "$timeout",
    "$rootScope",
    "$ionicPlatform",
    "yvSys",
    "yvMenu",
    "yvLocal",
    "yvMonitor",
function ($state, $timeout, $rootScope, $ionicPlatform, yvSys, yvMenu, yvLocal, yvMonitor) {

    yvLocal.localize();
    yvMenu.init();
    
    if (ppmessage.developer_mode) {
        ppmessage.monitor = yvMonitor;
    }

    if (yvSys.in_pc_browser()) {
        window.onresize = function () {
            $timeout(function () {
                $rootScope.getAppBodyStyle();
            });
        };
        
        window.onbeforeunload = function (event) {
            if (ppmessage.disableOnbeforeunload) {
                ppmessage.disableOnbeforeunload = false;
                return;
            }
            if (!ppmessage.developer_mode && $state.includes("app.*")) {
                event.returnValue = yvLocal.translate("app.GLOBAL.ON_BEFORE_UNLOAD_WARNING");
            }
        };
    }

    $rootScope.getAppBodyStyle = function () {
        return yvSys.get_app_body_style();
    };

    $rootScope.getDeviceClass = function () {
        if (yvSys.in_mobile_browser()) {
            return "in-mobile-browser";
        }
        if (yvSys.in_pc_browser()) {
            return "in-pc-browser";
        }
        if (yvSys.in_electron()) {
            return "in-electron";
        }
        if (yvSys.in_mobile_app()) {
            return "in-mobile-app";
        }
    };

    $ionicPlatform.ready(function () {
        if (!window.cordova) return;

        if (ionic.Platform.isAndroid()) {            
            yvSys.hide_statusbar();
            angular.element(document).click(function () {
                yvSys.hide_statusbar();
            });
            // keyboardshow listener doesn't work somehow.
            // window.addEventListener('native.keyboardshow', yvSys.hide_statusbar, false);
            window.addEventListener('native.keyboardhide', yvSys.hide_statusbar, false);
            window.onresize = yvSys.hide_statusbar;
        }
        
        if (window.cordova && cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.cordova && cordova.getAppVersion) {
            yvSys.set_bundle_info();
        }

        if (window.cordova && navigator.connection) {
            document.addEventListener("online", yvSys.device_online, false);
            document.addEventListener("offline", yvSys.device_offline, false);
        }
    });

}]).constant("$ionicLoadingConfig", {
    // delay: 100,
    // duration: 5000,
    noBackdrop: true,
    hideOnStateChange: true,
    template: "<ion-spinner></ion-spinner>"
});
