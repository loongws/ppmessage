angular.module("this_app")
    .controller("ApplicationPeopleCtrl", function($scope, $cookies, $stateParams, $state, $timeout, $translate, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants, yvDebug, yvAppPeopleService, yvLogin) {

        var list = [];

        var app_uuid = null;
        var user_uuid = null;

        $scope.selected_all = {seleted: false};
        $scope.create_user_direct = getInitialCreateUserModalData(); 
        $scope.edit_user_direct = getInitialCreateUserModalData();
        
        var _note = function(index, tag) {
            $scope.set_flash_style(index);
            $scope.set_update_string($scope.lang[tag]);
        };
        
        $scope.email_handler = function(email) {
            if (email.length <= 22){
                return email;
            }
            return email.substring(0,18) + "..";
        }
        
        $scope.show_edit_modal = function() {
            jQuery("#batch_edit_user").modal( { show:true } );
            $scope.edit_user_direct = getInitialEditUserModalData(); 
        };
        
        $scope.show_create_modal = function() {
            jQuery("#batch_create_user").modal( { show:true } );
            $scope.create_user_direct = getInitialCreateUserModalData(); 
        };

        $scope.show_edit_user_password = function(show) {
            if (show) {
                $scope.edit_user_direct.user_password_is_visible = true;
                $scope.edit_user_direct.password_input_type = "text";
            } else {
                $scope.edit_user_direct.user_password_is_visible = false;
                $scope.edit_user_direct.password_input_type = "password";
            }
        };

        $scope.show_user_password = function(show) {
            if (show) {
                $scope.create_user_direct.user_password_is_visible = true;
                $scope.create_user_direct.password_input_type = "text";
            } else {
                $scope.create_user_direct.user_password_is_visible = false;
                $scope.create_user_direct.password_input_type = "password";
            }
        };
        
        $scope.edit_service_user_form_submit = function() {
            var user_info = {
                "app_uuid": yvUser.get_team().uuid,
                "user_uuid": $scope.edit_user_direct.user_uuid,
                "user_email": $scope.edit_user_direct.email,
                "user_fullname": $scope.edit_user_direct.name
            };

            if ($scope.edit_user_direct.password && $scope.edit_user_direct.password.length > 0) {
                user_info.user_password = sha1($scope.edit_user_direct.password);
            }

            yvAjax.update_user(user_info).success(function(data) {
                if (data.error_code == 0) {
                    _note(0, "application.people.EDIT_APP_USER_SUCCESS_TAG")
                } else {
                    _note(1, "application.people.EDIT_APP_USER_FAILED_TAG")
                }
            }).error(function(data) {
                _note(1, "application.people.EDIT_APP_USER_FAILED_TAG")
            });
            
            jQuery( "#batch_edit_user" ).modal( 'hide' );
            $scope.page_app_user();
        };
        
        $scope.create_service_user_form_submit = function() {
            var user_uuid = yvUser.get_uuid();
            var app_user_info = {
                "user_status": "SERVICE",
                "is_service_user": true,
                "app_uuid": yvUser.get_team().uuid,
                "user_email": $scope.create_user_direct.email,
                "user_fullname": $scope.create_user_direct.name,
                "user_password": sha1( $scope.create_user_direct.password ),
            };

            yvAppPeopleService.createServiceUser( app_user_info, function( data ) {

                var note = "application.people.CREATE_APP_USER_SUCCESSFULLY_TAG",
                    noteIndex = 0;
                
                switch ( data.error_code ) {
                    
                case yvAjax.API_ERR.NO_ERR:
                    break;

                case yvAjax.API_ERR.EX_USER:
                    note = "application.people.ALREADY_IS_APP_USER_TAG"
                    noteIndex = 1;
                    break;

                case yvAppPeopleService.UP_TO_MAX_SERVICE_USERS_ERROR_CODE:
                    note = "application.people.QUOTA_REACH_TO_UPPER_LIMIT_TAG"
                    noteIndex = 1;                    
                    break;

                default:
                    note = "application.people.CREATE_APP_USER_FAILED_TAG";
                    noteIndex = 1;
                    break;
                }

                jQuery( "#batch_create_user" ).modal( 'hide' );
                $scope.page_app_user();
                _note( noteIndex, note );
                
            }, function( data ) {
                jQuery("#batch_create_user").modal('hide');
                $scope.page_app_user();
                _note(2, "application.people.CREATE_APP_USER_FAILED_TAG");
            } );

        };

        $scope.should_show_edit_button = function() {
            var list = [];
            angular.forEach($scope.group, function (member) {
                if(member.selected) {
                    this.push(member);
                }
            }, list);
            if (list.length == 1) {
                return true;
            }
            return false;
        };

        $scope.should_show_remove_button = function() {
            var list = [];
            angular.forEach($scope.group, function (member) {
                if(member.selected) {
                    this.push(member);
                }
            }, list);
            if (list.length > 0) {
                return true;
            }
            return false;
        };

        $scope.show_remove_modal = function() {
            $scope.to_be_removed_users = [];
            angular.forEach($scope.group, function (member) {
                if(member.selected) {
                    this.push(member);
                }
            }, $scope.to_be_removed_users);
            
            if(!$scope.to_be_removed_users.length){
                return;
            };

            jQuery("#remove_user").modal({show:true});
            return;
        };

        $scope.check_all_changed = function (v) {
            angular.forEach($scope.group, function (member) {
                if(!member.is_owner_user == 1) {
                    member.selected = v;
                }
            });
        };

        $scope.$watch(function(scope){
            var flag = true;
            angular.forEach(scope.group, function(member) {
                if(member.selected) {
                    flag = false;
                }            
            });
            return flag;
        }, function(newVal, oldVal, scope){
            var flag = true;
            angular.forEach(scope.group, function(member) {
                if(member.selected) {
                    flag = false;
                }
            });
            
            if(flag) {
                scope.selected_all.selected = false;
            }
        });

        $scope.remove_users = function(to_be_removed_users) {
            if (to_be_removed_users == null || to_be_removed_users.length == 0) {
                return;
            }
            var _uuids = [];
            angular.forEach( to_be_removed_users, function( member ) {
                this.push( member.uuid );
            }, _uuids );

            var _r = yvAjax.leave_app(_uuids, yvUser.get_team().uuid);
            _r.success(function(data) {

                if (data.error_code == 0) {
                    jQuery("#remove_user").modal('hide');
                    $scope.selected_all.selected = false;
                    $scope.page_app_user();
                    _note(0, "application.people.REMOVE_APP_USER_SUCCESSFULLY_TAG");
                } else {
                    jQuery("#remove_user").modal('hide');
                    $scope.selected_all.selected = false;
                    $scope.page_app_user();
                    _note(1, "application.people.REMOVE_APP_USER_FAILED_TAG");
                    console.error(data);
                    return;
                }
            });
            _r.error(function(data) {
                jQuery("#remove_user").modal('hide');
                $scope.selected_all.selected = false;
                $scope.page_app_user();
                _note(2, "application.people.REMOVE_APP_USER_FAILED_TAG");
                console.error(data);
                return;
            });
        };

        $scope.page_app_user = function(newPageNumber){
            var search_value = $scope.search_value || "";            
            var page_number = $scope.page_number = newPageNumber || 1;

            $scope.items_per_page = 12;

            yvAppPeopleService.getAppServiceUsersWithPagination( {

                sort: true,
                filter_keyword: $.trim( search_value ),
                start_page: ( page_number - 1 ),
                length: $scope.items_per_page
                
            }, function( response ) {
                
                $scope.group = response.users;
                $scope.total_items = response.total;
                
            }, function( e ) {
                
                $scope.group = [];
                $scope.total_items = 0;
                
            } );

            // var _request = {};
            // _request["app_uuid"] = yvUser.get_team().uuid;
            
            // _request["columns[0][name]"] = "user_fullname";
            // _request["columns[1][name]"] = "user_email";
            // _request["columns[2][name]"] = "user_uuid";
            // _request["columns[3][name]"] = "user_icon";
            // _request["columns[4][name]"] = "is_owner_user";
            
            // _request["order[0][column]"] = 0;
            // _request["order[0][dir]"] = "ASC";
            // _request["search[value]"] = $.trim(search_value);
            // _request["start"] = _request["length"] * (page_number-1);

            // console.log(_request);
            
            // var _p = yvAjax.page_app_user(_request);

            // _p.success(function(data) {
            //     $scope.group = data.data;
            //     $scope.total_items = data.recordsFiltered;
            // });

            // _p.error(function(data) {
            //     console.error(data);
            //     return;
            // });

        }

        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }
            $scope.page_app_user();
        };
        
        var _logined = function() {
            yvLogin.prepare( function( errorCode ) {
                _team();
            }, { $scope: $scope, onRefresh: _team } );
        };
        
        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.application.people) {
                var _t = "application.people." + i;
                _tag_list.push(_t);
            }
            $scope.translate = function() {};
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };
        
        var _init = function() {
            $scope.refresh_settings_menu();
            _translate();
            _logined();
        };

        ///////// Initialize ///////////

        _init();

        //////// Internal Implementation ////

        function getInitialCreateUserModalData() {
            return {
                password: null,
                user_password_is_visible: false,
                password_input_type: 'password',
            }
        }

        function getInitialEditUserModalData() {
            var _return_member = null;
            angular.forEach($scope.group, function(member) {
                if(member.selected) {
                    _return_member = member;
                }
            });

            if (_return_member != null) {
                _return_member.user_uuid = _return_member.uuid;
                _return_member.email = _return_member.user_email;
                _return_member.name = _return_member.user_fullname;
                _return_member.password = "";                
            }
            return _return_member;
        }

        yvDebug.attach( 'yvAppPeopleController', { $scope: $scope } );
        
    }); // end ctrl
