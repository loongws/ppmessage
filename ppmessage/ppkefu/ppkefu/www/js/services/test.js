ppmessageModule.factory("yvTest", [
    "yvAPI",
    "yvSys",
    "yvUser",
    "yvLog",
function (yvAPI, yvSys, yvUser, yvLog) {
    
    function test_api_validate_online_device() {
        yvAPI.validate_online_device(function(res) {
            yvLog.green("success", res);
        }, function (err) {
            yvLog.red("error", err);
        }, function (res) {
            yvLog.yellow("api error", res)
        });
    }
    
    

    return {
        api_validate_online_device: function () {
            test_api_validate_online_device();
        }
    };
    
}]);
