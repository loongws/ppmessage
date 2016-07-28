View.$userFileMessage = ( function() {

    var fileSelectorPrefix = '#pp-conversation-part-file-by-user-o2-';

    //////// API ////////////

    return {
        build: build,
        onBeginUpload: onBeginUpload,
        onUploading: onUploading,
        onUploadDone: onUploadDone,
        onUploadFail: onUploadFail,
        onSendDone: onSendDone,
        onSending: onSending,
        onSendFail: onSendFail
    }

    function build( item ) {
        return new PPConversationPartFileByUser( item );
    }

    function onBeginUpload( ppMessageJsonBody ) {
        $( fileSelectorPrefix + ppMessageJsonBody.messageId ).css({ 'opacity': 0.6 });
    }

    function onUploading( ppMessageJsonBody, progress ) {
        if ( progress < 0 ) return;
        if ( progress <= 100 ) {
            $( '#pp-uploading-bar-state-' + ppMessageJsonBody.message.file.fileUploadId ).css( 'width', progress + "%" );
        }
    }

    function onUploadDone( ppMessageJsonBody ) {
        hideUploadBar( ppMessageJsonBody );
    }

    function onUploadFail( ppMessageJsonBody ) {
        hideUploadBar( ppMessageJsonBody );
    }

    function onSendDone( ppMessageJsonBody ) {
        $('#pp-conversation-part-file-by-user-o2-' + ppMessageJsonBody.messageId).css({
            'opacity': 1.0
        });
        if (ppMessageJsonBody.message.file.fileServerUrl) {
            $('#pp-conversation-part-file-by-user-a-' + ppMessageJsonBody.messageId)
                .attr('href', ppMessageJsonBody.message.file.fileServerUrl);   
        }

        removeDescription( ppMessageJsonBody );
    }

    function onSending( ppMessageJsonBody ) {
        addDescription( ppMessageJsonBody, Service.Constants.i18n( 'SENDING' ), undefined );
    }

    function onSendFail( ppMessageJsonBody ) {
        addDescription( ppMessageJsonBody, ppMessageJsonBody.extra.errorDescription, 'red' );
    }

    function hideUploadBar( ppMessageJsonBody ) {
        $('#pp-uploading-bar-outer-' + ppMessageJsonBody.message.file.fileUploadId).hide();
    }

    function addDescription( ppMessageJsonBody, description, color ) {
        $('#pp-conversation-part-file-by-user-timestamp-' + ppMessageJsonBody.messageId)
            .text( description ).css({
                'color': color,
                'display': 'block'
            });
    }

    function removeDescription( ppMessageJsonBody ) {
        $('#pp-conversation-part-file-by-user-timestamp-' + ppMessageJsonBody.messageId)
            .text( '' ).css({
                'color': undefined,
                'display': 'none'
            });
    }

    /**
     * @constructor
     */
    function PPConversationPartFileByUser(item) {
        View.PPDiv.call(this, {
            id: 'pp-conversation-part-file-by-user-' + item.messageId ,
            'class': 'pp-conversation-part-file-by-user'
        });

        var $tools = Service.$tools,
            error = Service.$tools.isMessageSendError( item ),
            extra = View.conversationPartTools.buildExtra( item ),
            showUploadingBar = $tools.isUploading(item),
            isIE = Service.$device.isIE();
        
        this.add(new View.PPDiv({
            id: 'pp-conversation-part-file-by-user-o-' + item.messageId,
            'class': 'pp-conversation-part-file-by-user-o'
        })
                 .add(new View.PPDiv({
                     id: 'pp-conversation-part-file-by-user-o2-' + item.messageId,
                     'class': 'pp-conversation-part-file-by-user-o2',
                     style: error ? 'opacity: 0.6' : ''
                 })
                      .add(new View.PPDiv({
                          id: 'pp-conversation-part-file-by-user-upload-icon',
                          style: 'background-image:url(' + Configuration.assets_path + 'img/icon-upload-white.png)'
                      }))
                      .add(new View.PPDiv({
                          'class': 'pp-conversation-part-file-by-user-link-container',
                          style: isIE ? 'margin-left: 0px;' : null // <- fix IE bug
                      })
                           .add(new View.PPElement('a', {
                               id: 'pp-conversation-part-file-by-user-a-' + item.messageId,
                               'class': 'pp-font',
                               title: item.message.file.fileName,
                               style: error ? 'cursor:default' : 'cursor:pointer',
                               href: item.message.file.fileServerUrl ? item.message.file.fileServerUrl : undefined
                           }).text(item.message.file.fileName
                                   // 'LongTextLongTextLongTextLongTextLongText'
                                  ))))
                 .add(new View.PPDiv({
                     id: 'pp-conversation-part-file-by-user-timestamp-' + item.messageId,
                     'class': 'pp-conversation-part-file-by-user-timestamp pp-selectable pp-font',
                     style: extra.style
                 })
                      .text( extra.text ))
                 .add(new View.PPDiv({
                     'class': 'pp-fixme'
                 })
                      .add(new View.PPUploadingBar(item).show(showUploadingBar))));
    }
    extend(PPConversationPartFileByUser, View.PPDiv);
    
} )();
