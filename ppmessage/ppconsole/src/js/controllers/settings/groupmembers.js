$yvGroupMembersCtrl.$inject = ["$scope", "$stateParams", "$timeout", "yvAjax", "yvUser", "yvLogin", "yvPagination"];
angular.module("this_app").controller("GroupMembersCtrl", $yvGroupMembersCtrl);

function $yvGroupMembersCtrl($scope, $stateParams, $timeout, yvAjax, yvUser, yvLogin, yvPagination) {
    
    $scope.members = {
        members: [],

        add: {
            members: [],
            total_items: 0,
            items_per_page: 12,
            search_value: '',
            page_number: 1,
            selected_all: {
                selected: false
            },
            add: null
        },
        
        total_items: 0,
        items_per_page: 12,
        search_value: '',
        page_number: 1,
        selected_all: {
            selected: false
        },
        
        remove: null,            
    };

    $scope.add_group_user = function() {
        if ($scope.members.add.add && $scope.members.add.add.length > 0) {
            yvAjax.add_org_group_user({
                app_uuid: yvUser.get_team().uuid,
                group_uuid: $stateParams.group_uuid,
                user_list: $scope.members.add.add
            }).success(function(response) {
                if (response.error_code == 0) {
                    $scope.toast_success_string("ADD_SUCCESSFULLY_TAG");
                    $scope.page_group_user();
                } else {
                    $scope.toast_error_string("ADD_FAILED_TAG");
                }
            }).error(function() {
                $scope.toast_error_string("ADD_FAILED_TAG");
            })
        }
        jQuery("#add_group_user").modal("hide");
    };
    
    $scope.show_add_modal = function() {
        $scope.page_no_group_user();
        jQuery("#add_group_user").modal( { show:true } );
    };
    
    $scope.should_enable_add_button = function() {        
        var list = [];
        angular.forEach($scope.members.add.members, function (member) {
            if(member.selected) {
                this.push(member.uuid);
            }
        }, list);
        
        if (list.length > 0) {
            $scope.members.add.add = angular.copy(list);
            return true;
        }
        
        return false;
    };
        
    $scope.should_show_remove_button = function() {
        var list = [];
        angular.forEach($scope.members.members, function (member) {
            if(member.selected) {
                this.push(member);
            }
        }, list);
        if (list.length > 0) {
            $scope.members.remove = angular.copy(list);
            return true;
        }
        return false;
    };

    $scope.check_all_changed = function(members, v) {
        angular.forEach(members, function (member) {
            member.selected = v;
        });
    };
    
    $scope.page_no_group_user = function(newPageNumber) {
        var search_value = $scope.members.add.search_value || "";            
        var page_number = $scope.members.add.page_number = newPageNumber || 1;

        yvAjax.get_no_group_user_list({
            app_uuid: yvUser.get_team().uuid,
            group_uuid: $stateParams.group_uuid
        }).success(function(response) {
            if (response.error_code == 0) {
                var _result = yvPagination.pagination({
                    members: response.list,
                    filter_keys: ["user_fullname", "user_email"],
                    filter_value: $.trim(search_value),
                    page_offset: (page_number - 1),
                    page_size: $scope.members.add.items_per_page                        
                });
                $timeout(function() {
                    $scope.members.add.members = _result.page;
                    $scope.members.add.total_items = _result.total;
                })
            } else {
                $scope.members.add.members = [];
                $scope.members.add.total_items = 0;
            }
        }).error(function() {
            $scope.members.add.members = [];
            $scope.members.add.total_items = 0;
        });
    }
    
    $scope.page_group_user = function(newPageNumber) {
        var search_value = $scope.members.search_value || "";            
        var page_number = $scope.members.page_number = newPageNumber || 1;

        yvAjax.get_org_group_user_list({
            app_uuid: yvUser.get_team().uuid,
            group_uuid: $stateParams.group_uuid
        }).success(function(response) {
            if (response.error_code == 0) {
                var _result = yvPagination.pagination({
                    members: response.list,
                    filter_keys: ["user_fullname", "user_email"],
                    filter_value: $.trim(search_value),
                    page_offset: (page_number - 1),
                    page_size: $scope.members.items_per_page                        
                });
                $timeout(function() {
                    $scope.members.members = _result.page;
                    $scope.members.total_items = _result.total;
                })
            } else {
                $scope.members.members = [];
                $scope.members.total_items = 0;
            }
        }).error(function() {
            $scope.members.members = [];
            $scope.members.total_items = 0;
        });
    }

    var _team = function() {
        var _own_team = yvUser.get_team();
        if (_own_team == null) {
            console.error("no team info");
            return;
        }
        $scope.page_group_user();
    };
    
    var _logined = function() {
        yvLogin.prepare( function( errorCode ) {
            _team();
        }, { $scope: $scope, onRefresh: _team } );
    };
    
    var _init = function() {
        console.log($stateParams);
        $scope.refresh_settings_menu();
        _logined();
    };

    ///////// Initialize ///////////
    _init();

}

