ppmessageModule.factory("yvLogout", [
    "$rootScope",
    "yvDB",
    "yvSys",
    "yvNav",
    "yvAPI",
    "yvNoti",
    "yvBase",
function ($rootScope, yvDB, yvSys, yvNav, yvAPI, yvNoti, yvBase) {

    var scope = $rootScope.$new();

    scope.$on("event:logout", function (event) {
        _local_logout();
    });

    // If should_reset is true, next view is main-with-logo,
    // else it is noapp.login-with-user/noapp.login-no-user.
    function _local_logout(should_reset) {
        if (yvSys.has_db()) {
            yvDB.logout_user();
        }
        yvNoti.exit();
        yvBase.reset();
        yvNav.exit_app(should_reset);
    }


    function _logout() {
        yvAPI.logout();
        _local_logout(false);
    }

    return {
        logout: function () {
            _logout();
        },

        local_logout: function () {
            _local_logout(false);
        },

        logout_reset: function () {
            _local_logout(true);
        }
    };
}]);
