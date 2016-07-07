angular.module("this_app")
    .controller("GroupCtrl", function($scope, $cookies, $stateParams, $state, $timeout, yvAjax, yvUser, yvLogin, yvPagination) {

        $scope.groups = {
            groups: [],
            total_items: 0,
            items_per_page: 12,
            search_value: '',
            page_number: 1,
            selected_all: {
                selected: false
            },

            group: {
                items_per_page: 12,
                total_items: 0,
                page_number: 1,

                search_value: '',
                
                group: null,
                users: null
            },
            
            remove: null,
            edit: null,

            create: {
                name: '',
                desc: ''
            }            
        };

        $scope.create_service_group_form_submit = function() {
            yvAjax.create_org_group({
                app_uuid: yvUser.get_team().uuid,
                group_name: $scope.groups.create.group_name,
                group_desc: $scope.groups.create.group_desc
            }).success( function(data) {
                if (data.error_code == 0) {
                    $scope.toast_success_string("CREATE_SUCCESSFULLY_TAG");
                } else {
                    $scope.toast_error_string("CREATE_FAILED_TAG");
                }
            }).error(function(data) {
                $scope.toast_error_string("CREATE_FAILED_TAG");
            });
            $scope.page_service_group();
            jQuery("#create_service_group").modal('hide');
        };

        $scope.edit_service_group_form_submit = function() {
            yvAjax.update_org_group({
                app_uuid: yvUser.get_team.uud,
                group_uuid: $scope.groups.edit.uuid,
                group_name: $scope.groups.edit.group_name,
                group_desc: $scope.groups.edit.group_desc
            }).success(function(data) {
                if (data.error_code == 0) {
                    $scope.toast_success_string("UPDATE_SUCCESSFULLY_TAG");
                } else {
                    $scope.toast_error_string("UPDATE_FAILED_TAG");
                }
            }).error(function(data) {
                $scope.toast_error_string("UPDATE_FAILED_TAG");
            });
            
            $scope.page_service_group();
            jQuery("#edit_service_group").modal('hide');
        };

        $scope.delete_groups = function() {
            var uuids = [];
            angular.forEach($scope.groups.remove, function(v, k) {
                this.push(v.uuid);
            }, uuids);
            yvAjax.remove_org_group({
                app_uuid: yvUser.get_team().uuid,
                group_uuid: uuids
            }).success(function(response) {
                if (response.error_code == 0) {
                    $scope.toast_success_string("DELETE_SUCCESSFULLY_TAG");
                } else {
                    $scope.toast_error_string("DELETE_FAILED_TAG");
                }
            }).error(function(response) {
                $scope.toast_error_string("DELETE_FAILED_TAG");
            });
        };        
        
        $scope.show_members_modal = function(group) {
            $scope.groups.group.group = angular.copy(group);
            yvAjax.get_org_group_user_list({
                app_uuid: yvUser.get_team().uuid,
                group_uuid: group.uuid
            }).success(function(data) {
                if (data.error_code != 0) {
                    console.log("can not get org group user list");
                } else {
                    $timeout(function() {
                        $scope.groups.group.users = data.list;
                    });
                }
            }).error(function(data) {
                console.log("can not get org group user list");
            });
            
            jQuery("#group_members_modal").modal({show: true});
        };
        
        $scope.show_edit_modal = function() {
            jQuery("#edit_service_group").modal( { show:true } );
        };
        
        $scope.show_create_modal = function() {
            jQuery("#create_service_group").modal( { show:true } );
            $scope.groups.create = _init_create_modal_data(); 
        };
        
        $scope.should_show_remove_button = function() {
            var list = [];
            angular.forEach($scope.groups.groups, function (member) {
                if(member.selected) {
                    this.push(member);
                }
            }, list);
            if (list.length > 0) {
                $scope.groups.remove = angular.copy(list);
                return true;
            }
            return false;
        };

        $scope.should_show_edit_button = function() {
            var list = [];
            angular.forEach($scope.groups.groups, function (member) {
                if(member.selected) {
                    this.push(member);
                }
            }, list);
            if (list.length == 1) {
                $scope.groups.edit = angular.copy(list[0]); 
                return true;
            }
            return false;
        };

        $scope.show_remove_modal = function() {
            if ($scope.groups.remove == null || $scope.groups.remove.length == 0) {
                return
            }
            jQuery("#delete_service_group").modal({show: true})
        };

        $scope.check_all_changed = function (v) {
            angular.forEach($scope.groups.groups, function (member) {
                member.selected = v;
            });
        };

        $scope.page_service_group = function(newPageNumber) {
            var search_value = $scope.groups.search_value || "";            
            var page_number = $scope.groups.page_number = newPageNumber || 1;
            
            yvAjax.get_app_org_group_list({
                app_uuid: yvUser.get_team().uuid
            }).success(function(response) {
                if (response.error_code == 0) {
                    var _result = yvPagination.pagination({
                        members: response.list,
                        filter_keys: ["group_name", "group_desc"],
                        filter_value: $.trim(search_value),
                        page_offset: (page_number - 1),
                        page_size: $scope.groups.items_per_page                        
                    });
                    $timeout(function() {
                        $scope.groups.groups = _result.page;
                        $scope.groups.total_items = _result.total;
                    })
                } else {
                    $scope.groups.groups = [];
                    $scope.groups.total_items = 0;
                }
            }).error(function() {
                $scope.groups.groups = [];
                $scope.groups.total_items = 0;
            });
        };

        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }
            $scope.page_service_group();
        };
        
        var _logined = function() {
            yvLogin.prepare( function( errorCode ) {
                _team();
            }, { $scope: $scope, onRefresh: _team } );
        };
                
        var _init = function() {
            $scope.refresh_settings_menu();
            _logined();
        };

        ///////// Initialize ///////////
        _init();

        function _init_create_modal_data() {
            return {
                group_name: '',
                group_desc: ''
            }
        }

        
    }); // end ctrl
