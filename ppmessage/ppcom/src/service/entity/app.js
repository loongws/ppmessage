Service.$app = (function() {

    var appInfo,
        
        set = function(info) {
            appInfo = info;
        },

        get = function() {
            return appInfo;
        };
    
    return {
        
        set: set,

        app: get, // appInfo

        appName: function() {// appName
            return get().app_name; 
        },

        appId: function() {
            return get().app_uuid || get().uuid;
        }
    }
    
})();
