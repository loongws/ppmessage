//
// conversation-panel manage :
//
// - conversation-list : `MODE.LIST`
// - conversation-content : `MODE.CONTENT`
// - conversation-waiting : `MODE.WAITING`
//
Ctrl.$conversationPanel = ( function() {

    var MODE = { LIST: 'LIST', CONTENT: 'CONTENT', WAITING: 'WAITING' },
        cMode = MODE.CONTENT;

    subscribeEvent();

    //////// API //////////
    return {
        MODE: MODE,
        mode: mode
    }

    ////// Implementation //

    function mode( m ) { //Query current mode
        
        if ( m === undefined ) {
            return cMode;    
        }

        cMode = m;

        switch ( cMode ) {
        case MODE.LIST:
            modeList();
            break;

        case MODE.CONTENT:
            // Strictly speaking ... We show `dropDownMenu` should decide by the conversation members should > 1
            // for simply, we always show it here, the count of conversation's members seldom not > 1
            View.$sheetHeader.showDropDownButton();
            View.$sheetHeader.showGroupButton(); // show group button
            break;

        case MODE.WAITING:
            modeList();
            View.$groupContent.hide();
            Ctrl.$conversationContent.hide();
            View.$loading.show();
            Ctrl.$sheetheader.setHeaderTitle( Service.Constants.i18n( 'WAITTING_AVALIABLE_CONVERSATION' ) );
            break;
        }
    }

    // =======helpers==========

    function modeList() {
        Service.$schedule.cancelAll(); // Cancel all sechedule tasks
        View.$sheetHeader.hideGroupButton();
        View.$sheetHeader.hideDropDownButton();
        Ctrl.$groupMembers.hide();
    }

    function subscribeEvent() {
        var $pubsub = Service.$pubsub,
            $conversationManager = Service.$conversationManager,
            WAITING_TOPIC = $conversationManager.EVENT.WAITING,
            AVALIABLE_TOPIC = $conversationManager.EVENT.AVALIABLE;
        
        $pubsub.subscribe( WAITING_TOPIC, function( topics, data ) {
            mode( MODE.WAITING );
        } );

        $pubsub.subscribe( AVALIABLE_TOPIC, function( topics, data ) {
            if ( mode() !== MODE.WAITING ) return;
            
            Ctrl.$sheetheader.setHeaderTitle();
            
            View.$groupContent.hide();
            Ctrl.$conversationContent.show(
                Service.$conversationManager.activeConversation(),
                { fadeIn: false, delay: 0 },
                function() {
                    mode( MODE.CONTENT );
                    View.$loading.hide();
                    View.$composerContainer.focus();
                } );
        } );
    }
    
} )();
