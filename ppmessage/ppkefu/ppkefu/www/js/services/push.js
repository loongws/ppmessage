ppmessageModule.factory("yvPush", [

function () {
    var push = null;
    var push_token = null;
    
    function _register_push(success, error, final_cb) {
        if (device.isVirtual) {
            _success && _success("YOU-GOT-A-FAKE-IOS-TOKEN-IN-EMULATOR");
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
            success && success(data.registrationId);
            final_cb && final_cb(); 
        });
        
        push.on("notification", function (data) {
            console.log(data);
        });
        
        push.on("error", function (err) {
            error && error(err);
            final_cb && final_cb(); 
        });
    }

    function _unregister_push(success, error) {
        if (push && push.unregister) {
            push.unregister(function () {
                success && success();
            }, function (err) {
                error && error();
            });
        }
    }
    
    return {
        register_push: function (success, error, final_cb) {
            _register_push(success, error, final_cb);
        },
        
        unregister_push: function (success, error) {
            _unregister_push(success, error);
        },

        get_token: function () {
            return push_token;
        }
    };
    
}]);
