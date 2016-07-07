angular.module("this_app")
    .controller("GroupCtrl", function($scope, $cookies, $stateParams, $state, $timeout, $translate, $mdDialog, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants, yvDebug, yvAppServiceGroupService, yvLogin) {

        $scope.groups = {
            groups: [
                {
                    user_count: 100,
                    group_name: "1111",
                    group_desc: "11111"
                },

                {
                    user_count: 100,
                    group_name: "1111",
                    group_desc: "11111"
                },

                {
                    user_count: 100,
                    group_name: "1111",
                    group_desc: "11111"
                },

                {
                    user_count: 100,
                    group_name: "1111",
                    group_desc: "11111"
                },
                {
                    user_count: 100,
                    group_name: "1111",
                    group_desc: "11111"
                },
                {
                    user_count: 100,
                    group_name: "1111",
                    group_desc: "11111"
                },
                {
                    user_count: 100,
                    group_name: "1111",
                    group_desc: "11111"
                },
                {
                    user_count: 100,
                    group_name: "1111",
                    group_desc: "11111"
                },
                {
                    user_count: 100,
                    group_name: "1111",
                    group_desc: "11111"
                },
                {
                    user_count: 100,
                    group_name: "1111",
                    group_desc: "11111"
                },
                {
                    user_count: 100,
                    group_name: "1111",
                    group_desc: "11111"
                },
                {
                    user_count: 100,
                    group_name: "1111",
                    group_desc: "11111"
                },
                
            ],
            total_items: 100,
            items_per_page: 12,
            search_value: '',
            page_number: 1,
            selected_all: {
                selected: false
            },

            remove: null,
            
            edit: null,

            create: {
                name: '',
                desc: ''
            }
            
        };

        $scope.create_service_group_form_submit = function() {
            
        };

        $scope.edit_service_group_form_submit = function() {
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
            
            $scope.showConfirm = function(ev) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete this group?')
                    .textContent('All of the banks have agreed to forgive you your debts.')
                    .ariaLabel('Confirm Delete Group')
                    .targetEvent(ev)
                    .ok('Yes delete group!')
                    .cancel('No cancel delete');
                $mdDialog.show(confirm).then(function() {
                    //$scope.status = 'You decided to get rid of your debt.';
                    //yvAjax.remove_org_group()
                }, function() {
                    //$scope.status = 'You decided to keep your debt.';
                });
            };
            return;
        };

        $scope.check_all_changed = function (v) {
            angular.forEach($scope.groups.groups, function (member) {
                member.selected = v;
            });
        };

        $scope.page_service_group = function(newPageNumber){
            var search_value = $scope.groups.search_value || "";            
            var page_number = $scope.groups.page_number = newPageNumber || 1;

            yvAppServiceGroupService.getAppServiceGroupsWithPagination( {

                sort: true,
                filter_keyword: $.trim( search_value ),
                start_page: ( page_number - 1 ),
                length: $scope.groups.items_per_page
                
            }, function( response ) {
                
                $scope.groups.groups = response.groups;
                $scope.groups.total_items = response.total;
                
            }, function( e ) {
                
                $scope.groups.groups = [];
                $scope.groups.total_items = 0;
                
            } );
        }

        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }
            //$scope.page_service_group();
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
