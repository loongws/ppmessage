View.$userTextMessage = ( function() {

    var Div = View.PPDiv,
        prefix = 'pp-conversation-part-',
        prefixId = '#' + prefix;

    //////// API ///////////
    
    return {
        build: build,
        onSendFail: onSendFail,
        onSending: onSending,
        onSendDone: onSendDone
    }

    function build( item ) {
        return new PPConversationPartTextByUser( item );
    }

    function onSending( ppMessageJsonBody ) {
        addDescription( ppMessageJsonBody, Service.Constants.i18n( 'SENDING' ), undefined );
    }

    function onSendDone( ppMessageJsonBody ) {
        removeDescription( ppMessageJsonBody );
    }

    function onSendFail( ppMessageJsonBody ) {
        addDescription( ppMessageJsonBody, ppMessageJsonBody.extra.errorDescription, 'red' );
    }

    function addDescription( ppMessageJsonBody, description, color ) {
        $( prefixId + ppMessageJsonBody.messageId )
            .find( '.extra' )
            .text( description )
            .css({ 'color': color })
            .show();
    }

    function removeDescription( ppMessageJsonBody ) {
        $( prefixId + ppMessageJsonBody.messageId )
            .find( '.extra' )
            .text( '' )
            .css({ 'color': undefined })
            .hide();
    }

    /**
     * @constructor
     */
    function PPConversationPartTextByUser( item ) {
        Div.call(this, 'pp-conversation-part-text-by-user');

        var html = View.$textUrlChecker.match(item.message.text.body).trustAsHtml(),
            extra = View.conversationPartTools.buildExtra( item );
        
        this.add(new Div('pp-conversation-part-text-by-user-outer')
                 .add(new Div( 'pp-wrapper' )
                      .add(new Div('pp-conversation-part-text-by-user-body-outer')
                           .add(new Div({
                               id: 'pp-conversation-part-text-by-user-body',
                               'class': 'pp-conversation-part-text-by-user-body pp-font pp-text-link-user pp-selectable'
                           })
                                .html(html)))
                      .add(new Div('pp-conversation-part-text-by-user-triangle')))
                 .add(new Div('pp-conversation-part-text-by-user-timestamp-outer')
                      .add(new View.Span({
                          'class': 'extra pp-selectable',
                          style: extra.style
                      }).text( extra.text ))));
        
    }
    extend(PPConversationPartTextByUser, Div);
    
} )();
