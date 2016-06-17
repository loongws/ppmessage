angular.module("this_app")
    .controller("ConfigCtrl", function($scope, $state, $stateParams, $timeout, $translate, yvAjax) {

        var CONFIG_STATUS = {
            NONE: 0,
            DATABASE: 1,
            FIRST: 2,
            IOS: 3,
            ANDROID: 4
        };

        var _config_status = CONFIG_STATUS.NONE;
        
        $scope.user = {
            user_status: "OWNER_2",
            is_service_user: false,
            user_fullname: "",
            user_email: "",
            user_password: "",
            app_name: "",

            user_password_is_visible: false,
            password_input_type: "password",
        };
                
        var signup = function(user) {

            // first try to get token
            var copyUser = angular.extend(angular.copy(user), {
                user_password: sha1( user.user_password ),
                app_uuid: yvConstants.PPMESSAGE_APP.uuid
            });
                
            yvAjax.signup(copyUser, credentialsToken)
                .success(function(data) {
                    if (data.error_code == 0) {
                    } else {
                    }
                })
                .error(function(data) {
                    console.error("create portal user error");
                });
        };
        
        $scope.sign_up_form_submit = function() {
            signup($scope.user);
        };

        $scope.show_user_password = function(show) {
            if (show) {
                $scope.user.user_password_is_visible = true;
                $scope.user.password_input_type = "text";
            } else {
                $scope.user.user_password_is_visible = false;
                $scope.user.password_input_type = "password";
            }
        };

        $scope.get_database_status = function() {
            if (_config_status == CONFIG_STATUS.NONE) {
                return "N/A";
            }
            return "OK";
        };

        $scope.get_first_status = function() {
            if (_config_status >= CONFIG_STATUS.FIRSTUSER) {
                return "OK";
            }
            return "N/A";
        };

        $scope.get_apns_status = function() {
            if (_config_status >= CONFIG_STATUS.IOS) {
                return "OK";
            }
            return "N/A";
        };

        $scope.get_android_push_status = function() {
            if (_config_status == CONFIG_STATUS.ANDROID) {
                return "OK";
            }
            return "N/A";
        };

        $scope.should_disable_initialize_database = function() {
            if (_config_status == CONFIG_STATUS.NONE) {
                return false;
            }
            return true;
        };
        
        $scope.should_disable_create_first = function() {
            if (_config_status == CONFIG_STATUS.DATABASE) {
                return false;
            }
            return true;
        };
        
        $scope.should_disable_config_apns = function() {
            if (_config_status == CONFIG_STATUS.FIRSTUSER) {
                return false;
            }
            return true;
        };
        
        $scope.should_disable_config_android_push = function() {
            if (_config_status == CONFIG_STATUS.IOS) {
                return false;
            }
            return true;
        };
        
        
    }); // end login ctrl
