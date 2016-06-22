angular.module("this_app")
    .controller("SignInCtrl", function($scope, $state, $stateParams, $timeout, $translate, $cookieStore, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants, yvDebug, yvLogin, yvAppService) {

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
                                
                                if (data.user_status == "OWNER_2") {
                                    $state.go(_url);
                                }

                                yvDebug.d("do not know how to handle user_status: %s", data.user_status);
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
        
        $scope.sign_in_form_submit = function() {
            signin($scope.user);
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
        
    }); // end login ctrl
