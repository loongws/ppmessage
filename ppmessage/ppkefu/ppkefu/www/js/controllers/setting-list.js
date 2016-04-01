ppmessageModule.controller("SettingListCtrl", [
    "$scope",
    "$state",
    "yvSys",
    "yvUser",
    "yvLink",
    "yvLogin",
    "yvLogout",
function ($scope, $state, yvSys, yvUser, yvLink, yvLogin, yvLogout) {

    $scope.uiPostfix = yvSys.in_mobile() ? "-mobile" : "";    
    
    $scope.$on("$ionicView.beforeEnter", function (event, currentView) {
        yvLogin.check_session();
    });
    

    $scope.logoutDeviceUser = function () {
        yvLogout.logout();
    };


    $scope.getDeviceUserIcon = function () {
        return yvLink.current_user_avatar();
    };

    
    $scope.getDeviceUserFullName = function () {
        return yvUser.get("fullname");
    };

    
    $scope.getSignature = function () {
        return yvUser.get("signature");
    };

    
    $scope.changeAvatar = function () {
        // will show action sheet in mobile instead
        if (yvSys.in_mobile_app()) {
            return;
        }
        
        $state.go("app.change-avatar" + $scope.uiPostfix);
        return;
    }
    

    $scope.showImageModal = function () {
        var remove = $scope.$on("$stateChangeStart", function (event) {
            event.preventDefault();
            $scope.$broadcast("event:show-image-modal");
            remove();
        });
    };
}]);
