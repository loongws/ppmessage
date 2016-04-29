ppmessageModule.directive("yvSidemenuHeader", [
    "$rootScope",
    "yvSys",
    "yvAPI",
    "yvLink",
    "yvUser",
    "yvBase",
    "yvLogin",
    "yvLogout",
    "yvConstants",
function ($rootScope, yvSys, yvAPI, yvLink, yvUser, yvBase, yvLogin, yvLogout, yvConstants) {

    function link($scope, $element, $attrs) {
        
        $scope.page = {"show_popover": false};

        $scope.status = {
            options: [
                {
                    id: "1",
                    class: "bg-ready",
                    status: yvConstants.USER_STATUS.READY
                },
                {
                    id: "2",
                    class: "bg-busy",
                    status: yvConstants.USER_STATUS.BUSY
                },
                {
                    id: "3",
                    class: "bg-rest",
                    status: yvConstants.USER_STATUS.REST
                }
            ],
            selected: {
                id: "1",
                class: "bg-ready",
                status: yvConstants.USER_STATUS.READY
            }
        };

        $scope.search = {
            searchKey: "",
            conversations: [],
            contacts: []
        };

        
        $scope.getUserIcon = function () {
            var _icon = yvUser.get("icon");
            return yvLink.get_user_icon(_icon);
        };

        
        $scope.getUserFullname = function () {
            return yvUser.get("fullname");
        };

        
        $scope.getCurrentAppName = function () {
            return yvUser.get("app").app_name;
        };
        
        
        $scope.showPopover = function () {
            $scope.page.show_popover = !$scope.page_show_popover;
        };


        $scope.logout = function () {
            yvLogout.logout();
        };

        
        $scope.clickItem = function () {
            $scope.clearSearchKey();
        };

        
        $scope.onStatusChange = function () {
            console.log($scope.status.selected);
            var status = $scope.status.selected.status;
            yvAPI.set_user_status(status, function (res) {
                console.log(res);
            });
        };

        
        $scope.selectStatus = function () {       
            var elem = angular.element("#user-status");
            if (document.createEvent) {
                var e = document.createEvent("MouseEvents");
                e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                elem[0].dispatchEvent(e);
            } else if (element.fireEvent) {
                elem[0].fireEvent("onmousedown");
            }
        };

        
        $scope.startSearch = function () {
            var my_uuid = yvUser.get("uuid");
            var reg = new RegExp($scope.search.searchKey);
            $scope.search.conversations.length = 0;
            $scope.search.contacts.length = 0;
            if (!$scope.search.searchKey) {
                return;
            }
            angular.forEach(yvBase.get_list("conversation"), function (conv) {
                if (reg.test(conv.name)) {
                    $scope.search.conversations.push(conv);
                    return;
                }
                if (conv.type == yvConstants.CONVERSATION_TYPE.P2S) {
                    var user_name = yvBase.get("object", conv.user_uuid, "fullname");
                    if (reg.test(user_name)) {
                        $scope.search.conversations.push(conv);                        
                    }
                } 
            });
            angular.forEach(yvBase.get_list("contact"), function (contact) {
                if (reg.test(contact.fullname) && contact.uuid !== my_uuid) {
                    $scope.search.contacts.push(contact);
                } 
            });
        };

        
        $scope.clearSearchKey = function () {
            $scope.search.searchKey = "";
        };
    }
    
    return {
        restrict: "E",
        replace: true,
        scope: true,
        link: link,
        templateUrl: "templates/directives/sidemenu-header.html"
    };
    
}]);
