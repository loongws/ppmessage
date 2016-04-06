ppmessageModule.controller("PushNotificationCtrl", [
    "$scope",
    "$ionicLoading",
    "yvSys",
    "yvAPI",
    "yvUser",
    "yvMain",
    "yvPush",
    "yvAlert",
    "yvConstants",
function ($scope, $ionicLoading, yvSys, yvAPI, yvUser, yvMain, yvPush, yvAlert, yvConstants) {
    var user = yvUser.get();
    
    var item_badge = _item("show_badge");
    var item_mute_noti = _item("mute_notification");
    var item_distributor = _item("is_distributor_user");
    var item_silence_noti = _item("silence_notification");
    var item_mute_other = _item("mute_other_mobile_device");

    $scope.notification = {
        type: yvUser.get("android_notification_type"),
        new_type: yvUser.get("android_notification_type")
    };
    
    $scope.showNotification = yvSys.in_android_app();

    _init();
    
    function _init() {
        if (user.show_badge !== null) {
            return _init_settings();        
        }
        
        yvAPI.get_user_info(user.uuid, function (response) {
            user.show_badge = !!response.user_show_badge;
            user.is_distributor_user = !!reponse.is_distributor_user;
            user.mute_notification = !!response.user_mute_notification;
            user.silence_notification = !!response.user_silence_notification;
            user.mute_other_mobile_device = !!response.user_mute_other_mobile_device;
            _init_settings();
        });
    }

    
    function _init_settings() {
        // if (yvSys.in_android_app()) {
        //     $scope.settings = [item_distributor];
        //     return;
        // }

        if (yvSys.in_mobile_app()) {
            $scope.settings = [item_badge, item_mute_noti, item_silence_noti, item_distributor];
            return;
        }

        $scope.settings = [item_mute_other, item_distributor];
    }


    function _item(key) {
        return {
            key: key,
            value: user[key],
            on_change: _on_change,
            title: "app.GLOBAL." + key.toUpperCase(),
            note: "app.GLOBAL." + key.toUpperCase() + "_NOTE",
        }
    }
    

    function _on_change() {
        var key = this.key;
        var value = !!this.value;

        if (key === "mute_notification" && value == true) {
            item_silence_noti.value && (item_silence_noti.value = false);
            _update_user(item_silence_noti.key, false);
        }
        
        if (key === "silence_notification" && value == true) {
            item_mute_noti.value && (item_mute_noti.value = false);
            _update_user(item_mute_noti.key, false);
        }

        _update_user(key, value);
    }

    
    function _update_user(key, value) {
        var data = {};
                
        if (key === "is_distributor_user") {
            data[key] = value;
        } else {
            data["user_" + key] = value;
        }
        
        yvAPI.update_user(data, function () {
            yvMain.update_noti_settings(key, value);
        });
    }


    function _error() {
        $ionicLoading.hide();        
        yvAlert.tip('app.GLOBAL.NOTIFICATION_CHANGE_FAIL');
        $scope.notification.new_type = $scope.notification.type;
    }
    
    function _success() {
        $ionicLoading.hide();        
        yvAlert.tip('app.GLOBAL.NOTIFICATION_CHANGE_SUCCESS');
        $scope.notification.type = $scope.notification.new_type;
        yvMain.update_android_notification_type($scope.notification.type);
        if ($scope.notification.type === yvConstants.NOTIFICATION_TYPE.GCM) {
            yvPush.unregister_push();
        } else {
            yvPush.disconnect_mqtt();
        }
    }
    
    function _setUpGCM() {
        $ionicLoading.show();
        yvPush.register_push(function (token) {
            var data = {
                "device_android_gcmpush": true,          
                "device_android_gcmtoken": token
            };
            yvAPI.update_device_info(data, _success, _error, _error);
        }, _error);
    }
    
    
    function _setUpMQTT() {
        $ionicLoading.show();
        yvPush.connect_mqtt(function () {
            var data = {
                "device_android_gcmpush": false,          
            };
            yvAPI.update_device_info(data, _success, _error, _error);
        }, _error);
    }
        
    $scope.chooseNotification = function () {
        var GCM = yvConstants.NOTIFICATION_TYPE.GCM;
        var MQTT = yvConstants.NOTIFICATION_TYPE.MQTT;

        switch ($scope.notification.new_type) {
        case GCM:
            if ($scope.notification.type !== GCM) { _setUpGCM(); }
            break;
        case MQTT:
            if ($scope.notification.type !== MQTT) { _setUpMQTT(); }
            break;
        default:
            // something wrong ?
        }
    };
    
}]);
