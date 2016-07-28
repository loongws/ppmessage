View.conversationPartTools = ( function() {

    ////////// API //////////
    
    return {
        buildExtra: buildExtra
    }

    ///////// Inner Impl ////////

    function buildExtra( item ) {
        var color = '#c9cbcf',
            text = item.extra.description,
            show = false;
        
        if ( Service.$tools.isMessageSendError( item ) ) {
            color = 'red';
            text = item.extra.errorDescription;
        } else if ( item.messageState === 'SENDING' ) {
            text = Service.Constants.i18n( 'SENDING' );
        }

        show = text && text.length > 0 && !Service.$tools.isUploading( item );

        return {
            style: 'color:' + color + "; display:" + ( show ? 'block' : 'none' ),
            text: text,
            show: show
        };
    }
    
} )();
