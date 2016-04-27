Service.$app = (function() {

    var POLICY = { GROUP: 'GROUP',
                   ALL: 'ALL',
                   SMART: 'SMART' },

        DEFAULT_POLICY = POLICY.ALL,

        appInfo,
        
        set = function(info) {
            appInfo = info;
        },

        get = function() {
            return appInfo;
        };
    
    return {

        POLICY: POLICY,
        
        set: set,

        policy: function() { // policy
            return ( get() && get().app_route_policy ) || DEFAULT_POLICY; 
        },

        app: get, // appInfo

        appName: function() {// appName
            return get().app_name; 
        },

        appId: function() {
            return get().app_uuid;
        }
    }
    
})();
