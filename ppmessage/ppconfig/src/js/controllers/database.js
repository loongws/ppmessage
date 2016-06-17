function InitializeDatabaseController($scope, $mdDialog) {
    $scope.database_types = ["SQLITE", "MYSQL", "PSQL"];

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}

