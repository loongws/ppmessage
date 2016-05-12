ppmessageModule.controller("LoginNoUserCtrl", [
    "$scope",
    "$state",
    "$timeout",
    "yvNav",
    "yvMain",
    "yvLogin",
    "yvConstants",
function ($scope, $state, $timeout, yvNav, yvMain, yvLogin, yvConstants) {

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
        user_email: "",
        user_password: "",
        user_status: yvConstants.USER_STATUS.READY
    };

    $scope.$on("$ionicView.enter", function () {
        yvNav.clear();
        yvMain.set_server();
    });
    
    $scope.disableLogin = function () {
        if ($scope.user.user_email && $scope.user.user_password) {
            return false;
        }
        return true;
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
