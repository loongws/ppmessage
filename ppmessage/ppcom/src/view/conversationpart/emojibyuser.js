View.$userEmojiMessage = ( function() {

    var prefix = 'pp-conversation-part-',
        prefixId = '#' + prefix,
        id = prefix + 'emoji-by-user',
        clsTextSelectable = 'pp-selectable';

    //////// API ////////////
    
    return {
        build: build,
        onSendFail: onSendFail,
        onSending: onSending,
        onSendFinish: onSendFinish
    }

    function build( item ) {
        return new PPConversationPartEmojiByUser( item );
    }

    function onSendFail( ppMessageJsonBody ) {
        addDescription( ppMessageJsonBody, ppMessageJsonBody.extra.errorDescription, 'red' );
    }

    function onSending( ppMessageJsonBody ) {
        addDescription( ppMessageJsonBody, Service.Constants.i18n( 'SENDING' ), undefined );
    }

    function onSendFinish( ppMessageJsonBody ) {
        removeDescription( ppMessageJsonBody );
    }

    function addDescription( ppMessageJsonBody, description, color ) {
        $( prefixId + ppMessageJsonBody.messageId )
            .find( '.extra' )
            .text( description )
            .css( { color: color } )
            .show();
    }

    function removeDescription( ppMessageJsonBody ) {
        $( prefixId + ppMessageJsonBody.messageId )
            .find( '.extra' )
            .text( '' )
            .css( { color: undefined } )
            .hide();
    }

    /**
     * @constructor
     */
    function PPConversationPartEmojiByUser(item) {
        View.PPDiv.call(this, id);

        var extra = View.conversationPartTools.buildExtra( item );

        this.add(new View.PPDiv({
            className: 'pp-emoji-container'
        })
                 .add(new View.PPDiv({
                     className: 'pp-emoji ' + clsTextSelectable
                 }).text(item.message.emoji.code))
                 .add(new View.PPDiv()
                      .add(new View.PPElement('span', {
                          className: 'extra ' + clsTextSelectable,
                          style: extra.style
                      })
                           .text( extra.text ))));
    }
    extend(PPConversationPartEmojiByUser, View.PPDiv);
    
} )();
