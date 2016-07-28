Service.$msgStateImageReceiver = (function() {

    return {
        listen: imageMessageStateChangeReceiver
    }

    function imageMessageStateChangeReceiver( messageIdentifier ) {

        var subscriber = Service.$pubsub.subscribe( 'msg/send/' + messageIdentifier, function( topics, data ) {

            var body = data.body,
                STATE = Service.$messageSender.$messageStateBroadcast.STATE;

            switch ( data.state ) {

            case STATE.BEGIN_UPLOAD:
                
                body.message.image.fileUploadId = data.stateInfo.uploadTaskId;

                Ctrl.$conversationContent.appendMessage( body );
                
                View.$composerContainer.focus();
                
                View.$userImageMessage.onBeginUpload( body );
                
                break;

            case STATE.UPLOADING:
                var progress = data.stateInfo.uploadProgress;
                View.$userImageMessage.onUploading( body, progress );
                break;

            case STATE.UPLOAD_DONE:
                var fileId = data.stateInfo.fileId;
                
                body.message.image.fuuid = fileId;
                body.message.image.fileServerUrl = Service.$tools.getFileDownloadUrl(fileId);

                View.$userImageMessage.onUploadDone( body );
                View.$userImageMessage.onSending( body );
                break;

            case STATE.UPLOAD_FAIL:
                View.$userImageMessage.onUploadFail( body );
                break;

            case STATE.SEND_DONE:
                View.$userImageMessage.onSendDone( body );
                Service.$pubsub.unsubscribe( subscriber );
                break;

            case STATE.SEND_FAIL:
                View.$userImageMessage.onSendFail( body );
                Service.$pubsub.unsubscribe( subscriber );
                break;
            }
            
        } );
        
    }
    
})();
