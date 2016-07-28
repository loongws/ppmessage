Service.$msgStateFileReceiver = (function() {

    return {
        listen: fileMessageStateChangeReceiver
    }

    function fileMessageStateChangeReceiver( messageIdentifier ) {

        var subscriber = Service.$pubsub.subscribe( 'msg/send/' + messageIdentifier, function( topics, data ) {

            var body = data.body,
                STATE = Service.$messageSender.$messageStateBroadcast.STATE;

            switch ( data.state ) {

            case STATE.BEGIN_UPLOAD:                
                body.message.file.fileUploadId = data.stateInfo.uploadTaskId;

                Ctrl.$conversationContent.appendMessage( body );
                
                View.$composerContainer.focus();
                View.$userFileMessage.onBeginUpload( body );
                break;

            case STATE.UPLOADING:
                var progress = data.stateInfo.uploadProgress;
                View.$userFileMessage.onUploading( body, progress );
                break;

            case STATE.UPLOAD_DONE:
                var fileId = data.stateInfo.fileId;
                
                body.message.file.fuuid = fileId;
                body.message.file.fileServerUrl = Service.$tools.getFileDownloadUrl(fileId, body.message.file.fileName);

                View.$userFileMessage.onUploadDone( body );
                View.$userFileMessage.onSending( body );
                break;

            case STATE.UPLOAD_FAIL:
                View.$userFileMessage.onUploadFail( body );
                break;

            case STATE.SEND_DONE:
                View.$userFileMessage.onSendDone( body );               
                Service.$pubsub.unsubscribe( subscriber );
                break;

            case STATE.SEND_FAIL:
                View.$userFileMessage.onSendFail( body );                
                Service.$pubsub.unsubscribe( subscriber );
                break;
            }
            
        } );
        
    }
    
})();
