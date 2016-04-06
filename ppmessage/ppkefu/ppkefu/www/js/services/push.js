ppmessageModule.factory("yvPush", [
    "yvAPI",
    "yvSys",
    "yvLog",
    "yvUser",
    "yvConstants",
function (yvAPI, yvSys, yvLog, yvUser, yvConstants) {
    var push = null;
    var push_token = null;
    
    function _register_push(success, error, final_cb) {
        if (!yvSys.in_mobile_app()) {
            final_cb && final_cb();
            return;
        }

        if (device.isVirtual) {
            push_token = "YOU-GOT-A-FAKE-IOS-TOKEN-IN-EMULATOR";
            success && success(push_token);
            final_cb && final_cb();
            return;
        }
        push = PushNotification.init({
            "ios": {
                "sound": true,
                "badge": true,
                "alert": true,
            },
            "android": {
                "senderID": ppmessage.sender_id,
            },
            "windows": {}
        });

        push.on("registration", function (data) {
            push_token = data.registrationId;
            success && success(push_token);
            final_cb && final_cb(); 
        });
        
        push.on("notification", function (data) {
            yvLog.log("notification arrive", data);
        });
        
        push.on("error", function (err) {
            error && error(err);
            final_cb && final_cb(); 
        });
    }

    function _unregister_push(success, error, final_cb) {
        if (push && push.unregister) {
            push.unregister(function () {
                success && success();
                final_cb && final_cb();
            }, function (err) {
                yvLog.error("unregister push error", error);
                error && error();
                final_cb && final_cb();
            });
        } else {
            success && success();
            final_cb && final_cb();
        }
    }

    function _connect_mqtt(success, error) {
        var url = "tcp://" + yvAPI.get_server().host + ":1883";
        var options = {
            timeout: 5, //optional
            keepAliveInterval: 20 * 60, //optional
            userName: yvUser.get("uuid"), //user_uuid
            password: yvUser.get("access_token"), //session_uuid
            notificationTitle: "ppmessage" //optional
        };

        mqttPlugin.connect(url, yvUser.get("device_uuid"), options, function () {
            yvLog.log("%cmqtt connection is established.", "color: green");
            success && success();
        }, function (err) {
            yvLog.error('---->connect mqtt failed:', err);
            error && error();
        });

        mqttPlugin.setOnMessageArrivedCallback(function (message) {
            yvLog.log("%creceive mqtt message. %s", "color: green", message);
        });
    }

    function _disconnect_mqtt(success) {
        mqttPlugin.disconnect(function () {
            yvLog.log('------->disconnect mqtt successful.');
            success && success();
        });
    }

    function _retry() {
        console.log("----------retry");
        if (yvSys.in_ios_app()) {
            _register_push();
            return;
        }
        if (yvSys.in_android_app()) {
            if (yvUser.get("android_notification_type") === yvConstants.NOTIFICATION_TYPE.MQTT) {
                _connect_mqtt();
                return;
            }
            _register_push();
        }
    }
    
    return {
        register_push: function (success, error, final_cb) {
            _register_push(success, error, final_cb);
        },
        
        unregister_push: function (success, error, final_cb) {
            _unregister_push(success, error, final_cb);
        },

        get_token: function () {
            return push_token;
        },

        connect_mqtt: function (success, error) {
            _connect_mqtt(success, error);
        },

        disconnect_mqtt: function (success) {
            _disconnect_mqtt(success);
        },

        retry: function () {
            _retry();
        },
    };
    
}]);
