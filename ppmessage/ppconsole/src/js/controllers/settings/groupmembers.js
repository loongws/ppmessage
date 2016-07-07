angular.module("this_app")
    .controller("GroupMembersCtrl", function($scope, $stateParams, $timeout, yvAjax, yvUser, yvLogin) {

        $scope.members = {
            members: [],
            total_items: 0,
            items_per_page: 12,
            search_value: '',
            page_number: 1,
            selected_all: {
                selected: false
            },
            
            remove: null,            
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

        $scope.show_remove_modal = function() {
            if ($scope.members.remove == null || $scope.members.remove.length == 0) {
                return
            }            
            return;
        };

        $scope.check_all_changed = function (v) {
            angular.forEach($scope.members.members, function (member) {
                member.selected = v;
            });
        };

        $scope.page_service_user = function(newPageNumber) {
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
            $scope.page_service_user();
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

        
    }); // end ctrl
