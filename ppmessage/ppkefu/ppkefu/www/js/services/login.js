ppmessageModule.factory("yvLogin", [
    "$state",    
    "$timeout",
    "$ionicLoading",
    "yvSys",
    "yvAPI",
    "yvNav",
    "yvLog",
    "yvNoti",
    "yvUser",
    "yvMain",
    "yvLink",
    "yvPush",
    "yvAlert",
    "yvLogout",
    "yvConstants",
function ($state, $timeout, $ionicLoading, yvSys, yvAPI, yvNav, yvLog, yvNoti, yvUser, yvMain, yvLink, yvPush, yvAlert, yvLogout, yvConstants) {

    var session = null;
    
    function LoginSession() {
        // user info for manual-login
        this.user_email = null;
        this.user_password = null;
        this.access_token = null;

        // make sure init one time
        if (typeof this.device_token !== "string") {
            // device info
            LoginSession.prototype.device_uuid = yvSys.get_device_uuid();
            LoginSession.prototype.device_token = null;           // iOS only
            LoginSession.prototype.ios_app_development = true;  // iOS only
            LoginSession.prototype.device_model = yvSys.get_device_model();
            LoginSession.prototype.device_version = yvSys.get_device_version();
            LoginSession.prototype.device_platform = yvSys.get_device_platform();
            LoginSession.prototype.device_fullname = yvSys.get_device_fullname();
            
            LoginSession.prototype.login = function () {
                var self = this;
                yvAPI.token(self, function (response) {
                    yvAPI.login(self, function (response) {
                        self._login_success(response);
                    }, function () {
                        self._login_error("app.GLOBAL.ERR_NET");
                    }, function () {
                        self._login_error("app.GLOBAL.ERR_LOGIN");
                    });
                }, function () {
                    self._login_error("app.GLOBAL.ERR_NET");
                }, function () {
                    self._login_error("app.GLOBAL.ERR_USERPASS");
                });
            };

            LoginSession.prototype._login_error = function (error) {
                _stop_loading();
                yvAlert.tip(error);
            };
            
            LoginSession.prototype._login_success = function (data) {
                data.access_token = this.access_token;
                yvMain.add_login_user(data, _enter_app);
            };
        }
    };


    function _stop_loading() {
        $ionicLoading.hide();
    }

    
    function _start_loading() {
        $ionicLoading.show({
            delay: 100,
            duration: 150000,
            template: "<ion-spinner></ion-spinner>"
        });
    }

    
    function _api_error(res) {
        _stop_loading();
        yvNav.login_with_user();
        yvAlert.tip("app.GLOBAL.ERR_NET");
        console.error("api error, session invalid ?", res);
    }

    
    function _enter_app(offline) {
        yvNoti.init();
        yvMain.reload(offline, function () {
            $timeout(function () {
                yvNav.go_conversation_list();
                _stop_loading();
            });
        });
    }
    
    function _login_with_session(user) {
        if (!session) {
            session = new LoginSession();
        }
        session.user_email = user.email;
        session.access_token = user.access_token;
        session.device_uuid = user.device_uuid;

        // test api is actuall get_user_info with max timeout 10s.
        // if api failed because of token, then login with user.
        // if api failed because of network, enter app without network.
        // if api success, enter app with network.
        yvAPI.test_api(function (data) {
            if (data.mobile_device_uuid !== yvUser.get("device_uuid")) {
                // The user has logined in another device, we shall log lout now.
                yvLogout.local_logout();
            } else {
                yvUser.update_user_from_api(data);
                _enter_app();
            }
        }, function () {
            _enter_app(true);
        }, function () {
            yvNav.login_with_user();
        });
    }

    
    function _login(user) {
        var server = yvAPI.get_server();
        
        if (!session) {
            session = new LoginSession();
        }
        
        _start_loading();
        
        if (!user.user_email || !user.user_password) {
            session._login_error("app.GLOBAL.ERR_NO_ENOUGH_INFO");            
            return;
        }
   
        session.user_email = user.user_email;
        session.user_password = user.user_password;
        
        if (!server || server.id === -1) {
            session._login_error("app.GLOBAL.ERR_NO_SERVER");
            return;
        }

        if (yvSys.in_mobile_app()) {
            // 'is_development' decide which APNS push service mode this device will apply,
            // true for development mode, false for produciton mode.
            var token = yvPush.get_token();
            session.device_token = token;
            if (yvSys.in_ios_app()) {
                session.ios_app_development = !!ppmessage.developerMode;
            }
            if (yvSys.in_android_app() && yvUser.get("android_notification_type") === yvConstants.NOTIFICATION_TYPE.MQTT) {
                session.device_token = null;
            }
            session.login();
            return;
        }

        session.device_uuid = yvSys.get_device_uuid(session.user_email);
        console.log("session device_uuid is %s", session.device_uuid);
        
        session.login();
        return;
    }

    
    function _check_session() {
        session || yvLogout.logout_reset();
    }
    
    return {
        login: function (user) {
            return _login(user);
        },

        login_with_session: function (user) {
            return _login_with_session(user);
        },
        
        after_login: function () {
            return _after_login();
        },
        
        enter_app: function (offline) {
            return _enter_app(offline);
        },
        
        check_session: function () {
            return _check_session();
        },

        current_session: function () {
            return session;
        }
    };
}]);
