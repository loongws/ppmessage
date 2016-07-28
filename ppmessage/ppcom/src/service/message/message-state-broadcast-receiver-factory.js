Service.$msgStateReceiverFactory = ( function() {

    return {
        get: get
    }

    function get( ppMessageType ) {

        switch ( ppMessageType ) {

        case Service.PPMessage.TYPE.TEXT:
            return Service.$msgStateTextReceiver;

        case Service.PPMessage.TYPE.EMOJI:
            return Service.$msgStateEmojiReceiver;

        case Service.PPMessage.TYPE.FILE:
            return Service.$msgStateFileReceiver;

        case Service.PPMessage.TYPE.IMAGE:
            return Service.$msgStateImageReceiver;

        default:
            
            return {
                listen: function () {}
            }
            
        }
        
    }
    
} )();
