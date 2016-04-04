Service.$user = (function() {

    // web_site user
    var user_uuid = null;

    return {
        
        // Get website user info
        getUser: function() {
            if ( !user_uuid ) return null;
            return getUser( user_uuid );
        },
        
        // Set website user
        setUser: function(userInfo) {
            user_uuid = userInfo.user_uuid;
            Service.$users.setUser(user_uuid, Service.$users.createUser(userInfo));
        },
        
        // Clear user
        clear: function() {
            user_uuid = null;
        },

        // quick get current user's id
        quickId: function() {
            return user_uuid;
        }
    }

    //////// Implentation /////////

    function getUser ( userId ) {
        if ( !userId ) return;
        return Service.$users.getUser( userId );
    }

    function getUserInfo ( userId ) {
        if ( !userId ) return;
        var user = getUser( userId ),
            userInfo = user && user.getInfo();
        return userInfo;
    }

    function isOnline ( userId ) {
        var userInfo = getUserInfo( userId );
        if ( userInfo ) {
            return userInfo.is_online;
        }
        return false;
    }
    
}());
