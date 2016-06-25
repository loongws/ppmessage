angular.module("this_app")
    .controller("SettingsPushCtrl", function($scope, $cookies, $state, $timeout, $translate, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants, yvLogin, yvDebug ) {
        
        $scope.push = {
            enable_apns_push: false,
            enable_gcm_push: false,
            enable_mqtt_push: false,
            apns_combination_pem_file: null,
            apns_combination_pem_data: null,
            apns_combination_pem_password: null,
            gcm_api_key: null,
        };

        $scope.submit_push = function() {
            var _data = angular.copy($scope.push);
            delete _data.apns_combination_pem_file;
            _data.app_uuid = yvUser.get_team().uuid;
            yvAjax.update_app_info(_data).success(function() {
                $scope.toast_success_string("UPDATE_PUSH_CONFIG_SUCCESS_TAG");
            }).error(function() {
                $scope.toast_error_string("UPDATE_PUSH_CONFIG_FAILED_TAG");
            });
        };

        $scope.read_pem = function($file) {
            var reader = new FileReader();
            
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    $scope.push.apns_combination_pem_data = e.target.result;
                };
            })($file);

            // Read in the image file as a data URL.
            reader.readAsDataURL($file);
        };

        var _logined = function() {
            yvLogin.prepare( function( errorCode ) {
                switch( errorCode ) {
                    
                case yvLogin.ERROR_CODE.OK:
                    $scope.push.enable_apns_push = yvUser.get_team().enable_apns_push;
                    $scope.push.enable_gcm_push = yvUser.get_team().enable_gcm_push;
                    $scope.push.enable_mqtt_push = yvUser.get_team().enable_mqtt_push;
                    $scope.push.apns_combination_pem_data = yvUser.get_team().apns_combination_pem_data;
                    $scope.push.apns_combination_pem_password = yvUser.get_team().apns_combination_pem_password;
                    $scope.push.gcm_api_key = yvUser.get_team().gcm_api_key;
                    break;
                    
                case yvLogin.ERROR_CODE.STATUS_ILLEGAL:
                    // do something ...
                    break;
                    
                }
            });
        };
        
        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.settings.push) {
                var _t = "settings.push." + i;
                _tag_list.push(_t);
            }
            $scope.translate = function() {
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };
        
        var _init = function() {
            $scope.refresh_settings_menu();
            _translate();
            _logined();
        };
        
        _init();
        
    }); // end ctrl
