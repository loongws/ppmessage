Service.$notifyConversation = (function() {

    var EVENT = { AVALIABLE: 'NOTIFY_CONVERSATION/AVALIABLE' },
        ERR_CODE = { NOERR: 0, WAITING: 11 };

    //////// API ////////////
    return {
        EVENT: EVENT,
        
        get: conversationMessageDispatcher
    }

    function conversationMessageDispatcher ( $notifyService, conversationMsg ) {
        
        return {
            dispatch: onConversationAvaliable
        }

        function onConversationAvaliable() {

            if ( conversationMsg.code === ERR_CODE.NOERR ) {
                Service.$pubsub.publish( EVENT.AVALIABLE, findConversationUUID( conversationMsg ) );
            }

        }

        function findConversationUUID( conversationMsg ) {
            return conversationMsg.extra && conversationMsg.extra.conversation_uuid;
        }
        
    }
    
})();
