angular.module("this_app")
    .controller("ApplicationProfileCtrl", function($scope, $stateParams, $state, $translate, $timeout, yvTransTags, yvAjax, yvUtil, yvUser, yvDebug, yvConstants, yvLogin) {

        var team_name = "";
        
        $scope.can_delete = false;
        $scope.team_info = {};

        var _reset_team_info = function() {
            $scope.team_info = {
                app_uuid: null,
                app_name: null,
                ppcom: {
                    api_uuid: null,
                    api_key: null,
                    api_secret: null,
                },
                ppconsole_thirdparty: {
                    api_uuid: null,
                    api_key: null,
                    api_secret: null,
                },
                ppkefu_thirdparty: {
                    api_uuid: null,
                    api_key: null,
                    api_secret: null,
                },
            };
        };
        
        
        var modify_check = function() {
            if(team_name == $scope.team_info.app_name) {
                $scope.toast_error_string("NOTHING_CHANGED_TAG");
                return false;
            };
            
            if(!yvUtil.regexp_check($scope.team_info.app_name)) {
                $scope.toast_error_string("NOT_REGULAR_WORDS_TAG");
                $scope.team_info.app_name = team_name;
                return false;
            };
            if(String($scope.team_info.app_name).length>63) {
                $scope.toast_error_string("OUT_OF_LENGTH_TAG");
                $scope.team_info.app_name = team_name;
                return false;
            };
            return true;
        }
            
        $scope.modify = function() {
            console.log("$scope.team_info is",$scope.team_info);
            if(!modify_check()) {
                return;
            };
            var update = {
                "app_uuid": yvUser.get_team().uuid,
                "app_name": $scope.team_info.app_name,
            };
            yvAjax.update_app_info(update)
                .success(function(data) {
                    console.log("update team info back",data);
                    if(data.error_code == 0) {
                        $scope.team_info.app_name = data.app_name;
                        team_name = data.app_name;
                        yvUser && yvUser.get_team() && ( yvUser.get_team().app_name = team_name );
                        $scope.toast_success_string("UPDATE_SUCCESSFULLY_TAG");
                    } else if(data.error_code == -1) {
                        $socpe.toast_error_string("LACK_PARAMS_TAG");
                    } else if(data.error_code == 1) {
                        $scope.toast_error_string("TEAM_NOT_EXISTED_TAG");
                    } else {
                        $scope.toast_error_string("UPDATE_FAILED_TAG");
                    }
                })
                .error(function(data) {
                    console.log("error data is",data);
                    $scope.toast_error_string("UPDATE_FAILED_TAG");
                });
        };

        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }

            var app_uuid = _own_team.uuid;
            $scope.team_info.app_uuid = app_uuid;
            $scope.team_info.app_name = _own_team.app_name;
            var _get = yvAjax.get_api_info({app_uuid: app_uuid, user_uuid: yvUser.get_uuid()});
            _get.success(function(data) {
                $scope.team_info.ppcom = data.ppcom;
                $scope.team_info.ppconsole_thirdparty = data.ppconsole_thirdparty;
                $scope.team_info.ppkefu_thirdparty = data.ppkefu_thirdparty;
            });
        };
        
        var _logined = function() {
            yvLogin.prepare( function( errorCode ) {
                _team();
            }, {
                $scope: $scope,
                onRefresh: function() {
                    _team();
                }
            } );
        };
        
        var _init = function() {
            _reset_team_info();
            $scope.refresh_settings_menu();
            _logined();
        };

        _init();

        yvDebug.attach( 'yvBasicInfo', { yvUser: yvUser } );
    });

