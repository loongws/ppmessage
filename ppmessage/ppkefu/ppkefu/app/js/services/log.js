ppmessageModule.factory("yvLog", [

function () {
    var log = {};
    var methods = ["log", "warn", "error", "green", "yellow", "red"];

    function colorfulLog(style, args) {
        args = ["%c%s", style].concat(args);
        console.log.apply(console, args);              
    }
    
    if (ppmessage.developer_mode) {
        log = {
            log: function () {
                var args = Array.prototype.slice.call(arguments);
                console.log.apply(console, args);              
            },
            warn: function () {
                var args = Array.prototype.slice.call(arguments);
                console.warn.apply(console, args);              
            },
            error: function () {
                var args = Array.prototype.slice.call(arguments);
                console.error.apply(console, args);                
            },
            green: function () {
                var args = Array.prototype.slice.call(arguments);
                colorfulLog("color: green", args);
            },
            yellow: function () {
                var args = Array.prototype.slice.call(arguments);
                colorfulLog("background-color: yellow", args);
            },
            red: function () {
                var args = Array.prototype.slice.call(arguments);
                colorfulLog("color: red", args);
            }
        };
    } else {
        angular.forEach(methods, function (method) {
            log[method] = angular.noop;
        });
    }
    
    return log;
}]);
