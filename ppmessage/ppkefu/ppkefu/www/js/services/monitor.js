ppmessageModule.factory("yvMonitor", [
    "yvBase",
    "yvMain",
    "yvTest",
function (yvBase, yvMain, yvTest) {
    var monitor = {
        "yvBase": yvBase,
        "yvMain": yvMain,
        "yvTest": yvTest
    };
    
    return monitor;
}]);
