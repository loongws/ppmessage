Service.$msgStateTextReceiver = ( function() {

    return {
        listen: textMessageStateChangeReceiver
    }

    function textMessageStateChangeReceiver ( messageIdentifier ) {
        
        var subscriber = Service.$pubsub.subscribe( 'msg/send/' + messageIdentifier, function( topics, data ) {

            var body = data.body,
                STATE = Service.$messageSender.$messageStateBroadcast.STATE;

            switch ( data.state ) {

            case STATE.BUILD_DONE:
                Ctrl.$conversationContent.appendMessage( body );
                View.$userTextMessage.onSending( body );
                break;

            case STATE.UPLOAD_DONE:
                body.message.text.fuuid = data.stateInfo.fileId;
                break;

            case STATE.SEND_DONE:
                View.$userTextMessage.onSendDone( body );
                Service.$pubsub.unsubscribe( subscriber );
                break;

            case STATE.SEND_FAIL:
                View.$userTextMessage.onSendFail( body );
                Service.$pubsub.unsubscribe( subscriber );
                break;
            }
            
        } );
        
    }
    
} )();
