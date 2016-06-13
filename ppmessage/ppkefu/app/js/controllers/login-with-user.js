ppmessageModule.controller("LoginWithUserCtrl", [
    "$scope",
    "$state",
    "$timeout",
    "$stateParams",
    "yvNav",
    "yvMain",
    "yvLink",
    "yvLogin",
    "yvConstants",
function ($scope, $state, $timeout, $stateParams, yvNav, yvMain, yvLink, yvLogin, yvConstants) {

    $scope.statusOptions = [
        {
            origin: "app.GLOBAL.READY",
            status: yvConstants.USER_STATUS.READY,
        },
        {
            origin: "app.GLOBAL.BUSY",
            status: yvConstants.USER_STATUS.BUSY,
        },
        {
            origin: "app.GLOBAL.REST",
            status: yvConstants.USER_STATUS.REST,
        }
    ];

    $scope.user = {
        user_password: "",
        icon: $stateParams.icon,
        user_email: $stateParams.email || "",
        fullname: $stateParams.fullname || "",
        user_status: yvConstants.USER_STATUS.READY        
    };
    
    if (!$scope.user.user_email) {
        yvNav.login_no_user();        
    }
    
    $scope.$on("$ionicView.enter", function () {
        yvNav.clear();
        yvMain.set_server();
    });
    
    $scope.nouser = function () {
        yvNav.login_no_user();        
    };


    $scope.disableLogin = function () {
        if ($scope.user.user_password) {
            return false;
        }
        return true;
    };
    
    $scope.getDeviceUserIcon = function () {
        return yvLink.get_user_icon($scope.user.icon);
    };

    $scope.deviceUserLogin = function () {
        var _user = {
            user_email: $scope.user.user_email,
            user_status: $scope.user.user_status,
            user_password: hex_sha1($scope.user.user_password)
        };
        yvLogin.login(_user);
    };

}]);
