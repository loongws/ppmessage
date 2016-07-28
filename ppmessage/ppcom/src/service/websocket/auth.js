Service.$notifyAuth = (function() {

    var AUTH_TYPE = 'auth';

    //////// API ////////////
    return {
        get: authMessageDispatcher
    }

    function authMessageDispatcher ( $notifyService, authMsg ) {
        
        return {
            auth: auth,
            dispatch: onAuth
        }

        function auth () {
            
            var $api = Service.$api,
                $json = Service.$json,
                wsSettings = $notifyService.getWsSettings(),

                // auth params
                api_token = $api.getApiToken(),
                user_uuid = wsSettings.user_uuid,
                device_uuid = wsSettings.device_uuid,
                app_uuid = wsSettings.app_uuid,
                is_service_user = false,
                extra_data = {
                    title: document.title,
                    location: ( ( function() { // fetch `window.location`
                        var loc = {};
                        for (var i in location) {
                            if (location.hasOwnProperty(i) && (typeof location[i] == "string")) {
                                loc[i] = location[i];
                            }
                        }
                        return loc;
                    } )() )
                };

            // register webSocket
            $notifyService.write($json.stringify({
                type: AUTH_TYPE,
                api_token: api_token,
                app_uuid: app_uuid,
                user_uuid: user_uuid,
                device_uuid: device_uuid,
                extra_data: extra_data,
                is_service_user: is_service_user
            }));

        }

        function onAuth () {
            
            if ( !authMsg ) return;

            // auth success
            if ( authMsg.error_code === 0 || authMsg.code === 0 ) {
                Modal.$conversationContentGroup.tryLoadLostMessages();                
            }
        }
        
    }
    
})();
