angular.module("this_app")
    .controller("SignupMdCtrl", function($scope, $state, $stateParams, $timeout, $translate, $cookieStore, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants, yvDebug, yvLogin, yvAppService) {

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

        var get_token = function (onSuccess, onError) {
            yvAjax.get_credentials_token()
                .success( function( response ) {
                    if (response.access_token) {
                        onSuccess && onSuccess( response );
                    } else {
                        onError && onError( response );
                    }
                } )
                .error( function( error ) {
                    onError && onError( error );
                } );
        };
                
        var signup = function(user) {
            // first try to get token
            get_token( function(response) {
                var credentialsToken = response.access_token;
                console.log(response);
                var copyUser = angular.extend(
                    angular.copy(user),
                    {
                        user_password: sha1( user.user_password ),
                        app_uuid: yvConstants.PPMESSAGE_APP.uuid
                    }
                );
                
                yvAjax.signup(copyUser, credentialsToken)
                    .success(function(data) {
                        if (data.error_code == 0) {
                            yvAjax.login(copyUser).success(function(data) {
                                if ( data.error_code == 0 ) {
                                    yvLogin.updateActiveUserCookieKey( data.user_uuid );
                                    yvLogin.updateLoginedUserCookieKey( data.user_uuid, data.access_token );
                                }
                                yvLogin.updateLoginedUser( copyUser );
                                yvLogin.setLogined( true );
                                $state.go("app.settings.overview")
                            }).error(function(data) {
                                console.error("signup error");
                                $scope.toast_error_string("SERVICE_ERROR_TAG");
                            });
                        } else {
                            if (data.error_code == yvAjax.API_ERR.EX_USER) {
                                $scope.toast_error_string("EMAIL_USED_TAG");
                            } else {
                                $scope.toast_error_string("SERVICE_ERROR_TAG");
                            }
                        }
                    })
                    .error(function(data) {
                        console.error("create portal user error");
                    });
                
            }, function(error) {
                // get token error
                $scope.toast_error_string("SERVICE_ERROR_TAG");
            } );
        };

        var signin = function(user) {
            var password = sha1($scope.user.user_password);
            yvAjax.login({user_email: $scope.user.user_email, user_password: password})
                .success(function(data) {
                    if (data.error_code == 0) {
                        yvLogin.updateActiveUserCookieKey( data.user_uuid );
                        yvLogin.updateLoginedUserCookieKey( data.user_uuid, data.access_token );
                        yvAjax.get_user_detail_with_password(data.user_uuid)
                            .success(function(data) {
                                yvDebug.d('get_user_detail', data);
                                if (data.error_code != 0) {
                                    yvLog.w("get detail failed %s", data);
                                    return;
                                }
                                
                                yvLogin.updateLoginedUser( angular.copy( data ) );
                                yvLogin.setLogined( true );
                                
                                var _url = yvConstants.USER_STATUS[data.user_status];
                                if (data.user_status == "SERVICE") {
                                    yvLogin.updateActiveUser( data );
                                    $scope.start_ppmessage(true);
                                    return;
                                }

                                if (data.user_status == "ADMIN") {
                                    _url = yvConstants.USER_STATUS["OWNER_2"];
                                    yvAppService.getApps( function( apps ) {
                                        $state.go(_url);
                                    } );
                                    return;
                                }
                                
                                if (data.user_status == "OWNER_2") {
                                    $state.go(_url);
                                }
                                
                                return;
                            });
                    } else {
                        $scope.toast_error_string("SIGNIN_FAILED_TAG");
                    }
                })
                .error(function(data) {
                    $scope.toast_error_string("SIGNIN_FAILED_TAG");
                });

        };

        var send_email = function(user) {
            var _s = function() {
                $scope.toast_success_string("SEND_NEW_PASSWORD_SUCCESS_TAG");
            };
            var _e = function() {
                $scope.toast_error_string("SEND_NEW_PASSWORD_FAILED_TAG");
            };
            
            get_token(function(response) {
                var credentialsToken = response.access_token;
                console.log(response);
                yvAjax.send_new_password({user_email: user.user_email}, credentialsToken).success(function() {
                    _s();
                }).error(function() {
                    _e();
                });
            }, function() {
                _e();
            });
        };
        
        $scope.sign_up_form_submit = function() {
            signup($scope.user);
        };

        $scope.sign_in_form_submit = function() {
            signin($scope.user);
        };

        $scope.reset_password_form_submit = function() {
            send_email($scope.user);
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

        $scope.ui = {selected_index: 0};
        if ($stateParams.sign_what && $stateParams.sign_what == "signup") {
            $scope.ui.selected_index = 0;
        }

        if ($stateParams.sign_what && $stateParams.sign_what == "signin") {
            $scope.ui.selected_index = 1;
        }

        if ($stateParams.sign_what && $stateParams.sign_what == "reset") {
            $scope.ui.selected_index = 2;
        }
        
    }); // end login ctrl
