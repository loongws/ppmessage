ppmessageModule.controller("MainWithLogoCtrl", [
    "$scope",
    "yvSys",
    "yvNav",
    "yvLog",
    "yvMain",
    "yvUser",
    "yvFile",
    "yvPush",
    "yvLogin",
    "yvUpdater",
    "yvConstants",
function ($scope, yvSys, yvNav, yvLog, yvMain, yvUser, yvFile, yvPush, yvLogin, yvUpdater, yvConstants) {

    function nav_login(user) {
        yvNav.clear(function () {
            if (!user) {
                return yvNav.login_no_user();
            }
            if (user.is_online && yvSys.has_db()) {
                return yvLogin.login_with_session(user);
            }
            yvNav.login_with_user(user);
        });
    }

    function init_db() {
        yvMain.init_yvdb(function (user) {
            yvUpdater.check_update();
            if (yvSys.in_ios_app()) {
                yvPush.register_push(null, null, function () {
                    nav_login(user);
                });
                return;
            }
            if (yvSys.in_android_app()) {
                if (yvUser.get("android_notification_type") === yvConstants.NOTIFICATION_TYPE.GCM) {
                    yvPush.register_push(function () {
                        yvMain.update_android_notification_type(yvConstants.NOTIFICATION_TYPE.GCM);
                    }, function () {
                        yvLog.log("gcm push failed, downgrade to mqtt ");
                        yvMain.update_android_notification_type(yvConstants.NOTIFICATION_TYPE.MQTT);
                    }, function () {
                        nav_login(user);
                    });
                    return;
                }

                nav_login(user);
                return;
            }
            
            nav_login(user);
        });
    }

    function init() {
        if (yvSys.in_mobile_app()) {
            yvFile.init();
        }
        init_db();
    }

    init();
}]);
