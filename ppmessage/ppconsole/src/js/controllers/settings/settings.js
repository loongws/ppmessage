$yvSettingsCtrl.$inject = ["$scope", "$state"];

angular.module("this_app").controller("SettingsCtrl", $yvSettingsCtrl);

function $yvSettingsCtrl($scope, $state) {
    
    var _state_to_id = function(_state) {
        if (_state == "app.settings.groupmembers") {
            return "app.settings.group";
        }
        return _state;
    };
    
    $scope.refresh_settings_menu = function() {
        var _j = angular.element(".menu-item");

        for (var i = 0; i < _j.length; i++) {
            angular.element(_j[i]).removeClass("selected");
        }

        var _id = _state_to_id($state.current.name);
        
        _j = document.getElementById(_id);
        if (_j && _j.className && _j.className.indexOf("selected") < 0) {
            _j.className += " selected";
        }            
        return;
    };
    
}
