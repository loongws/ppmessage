Service.$msgStateEmojiReceiver = ( function() {

    return {
        listen: emojiMessageStateChangeReceiver
    }

    function emojiMessageStateChangeReceiver( messageIdentifier ) {

        var subscriber = Service.$pubsub.subscribe( 'msg/send/' + messageIdentifier, function( topics, data ) {

            var body = data.body,
                STATE = Service.$messageSender.$messageStateBroadcast.STATE;

            switch ( data.state ) {

            case STATE.BUILD_DONE:
                Ctrl.$conversationContent.appendMessage( body );
                View.$userEmojiMessage.onSending( body );
                View.$composerContainer.focus();
                break;

            case STATE.SEND_DONE:
                View.$userEmojiMessage.onSendFinish( body );
                Service.$pubsub.unsubscribe( subscriber );
                break;

            case STATE.SEND_FAIL:
                View.$userEmojiMessage.onSendFail( body );
                Service.$pubsub.unsubscribe( subscriber );
                break;
            }
            
        } );
        
    }
    
} )();
