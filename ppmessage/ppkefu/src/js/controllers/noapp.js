ppmessageModule.controller("NoAppCtrl", [
    "$scope",
    "yvSys",
    "yvConstants",
function ($scope, yvSys, yvConstants) {
    $scope.showServerButton = function () {
        return ppmessage.developer_mode && yvSys.has_db();
    };

}]);
