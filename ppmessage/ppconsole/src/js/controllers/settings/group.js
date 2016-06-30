angular.module("this_app")
    .controller("GroupCtrl", function($scope, $cookies, $stateParams, $state, $timeout, $translate, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants, yvDebug, yvAppPeopleService, yvLogin) {

        var list = [];

        var app_uuid = null;
        var user_uuid = null;
        
        $scope.show_edit_modal = function() {
            jQuery("#batch_edit_user").modal( { show:true } );
            $scope.edit_user_direct = getInitialEditUserModalData(); 
        };
        
        $scope.show_create_modal = function() {
            jQuery("#batch_create_user").modal( { show:true } );
            $scope.create_user_direct = getInitialCreateUserModalData(); 
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
