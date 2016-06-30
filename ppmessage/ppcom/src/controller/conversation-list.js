Ctrl.$conversationList = ( function() {

    //////// API /////////
    return {
        show: show,
        showItem: showItem,        
        hide: hide
    }

    /////// Implementation ///
    function show() {
        Ctrl.$conversationPanel.mode( Ctrl.$conversationPanel.MODE.LIST );

        View.$loading.show();
        Service.$conversationManager.asyncGetList( function( conversationList ) {
            
            // update view
            View.$groupContent
                .update( prepareData( conversationList ) )
                .show();
            
            Ctrl.$conversationContent.hide();
            View.$loading.hide();

            markUnreadState ( conversationList );
            conversationDescriptionLoader( conversationList ).load( function( token, description ) {
                View.$groupContentItem.description( token, description );
            } );
            
        } );

        function prepareData( conversationList ) {

            var viewData = [];
            conversationList && $.each( conversationList, function( index, item ) {

                var uuid = item.token,
                    icon,
                    name,
                    summary;

                var conversationData = item.conversation_data || item;
                icon = Service.$tools.icon.get( conversationData.conversation_icon );
                name = conversationData.conversation_name;

                viewData.push( {
                    uuid: uuid,
                    icon: icon,
                    name: name,
                    summary: summary
                } );
                
            } );
            return viewData;
            
        }

        function markUnreadState ( conversationList ) {

            conversationList && $.each( conversationList, function( index, item ) {

                var token = item.token,
                    m = Modal.$conversationContentGroup.get ( token ),
                    $groupItemView = View.$groupContentItem;
                
                if ( m.unreadCount() > 0 ) {
                    $groupItemView.showUnread( token , m.unreadCount() );
                } else {
                    $groupItemView.hideUnread( token );
                }       
                
            } );
            
        }
    }

    /////// showItem /////////
    function showItem( token ) {

        var $conversationManager = Service.$conversationManager,
            conversation = $conversationManager.find( token ),
            TYPE = $conversationManager.TYPE;
            
        if ( conversation !== undefined ) {
            before();
            showItemConversation( conversation );
        }

        function before() {
            View.$loading.show(); // show loading view
            View.$groupContent.hide(); // Hide group-content-view
        }

        function showItemConversation( conversation ) {
            show( token );
        }

        function show( token ) {
            
            if ( token !== undefined ) {
                var $manager = Service.$conversationManager;            
                $manager.activeConversation( token );
                Ctrl.$conversationContent
                    .show( $manager.activeConversation(), {}, onSuccessCallback );                
            } else {
                onErrorCallback();
            }

        }

        function onErrorCallback() {
            View.$loading.hide(); // hide loading view
            View.$groupContent.show(); // Hide group-content-view
        }

        function onSuccessCallback() {
            Ctrl.$conversationPanel.mode( Ctrl.$conversationPanel.MODE.CONTENT );
            
            View.$loading.hide(); // hide loading view
            View.$composerContainer.focus(); // focus
        }
        
    }

    ///////// hide ///////////
    function hide() {
        
    }

    //////// conversationDescLoader /////
    function conversationDescriptionLoader( conversationList ) {

        return {
            load: load
        }

        function load( callback ) {
            conversationList && $.each( conversationList, function( index, item ) {
                    
                // 1. try to find latest_message from local
                var modal = Modal.$conversationContentGroup.get ( item.token );
                if ( modal && !modal.isEmpty() ) {
                    var lastMsg = modal.getMessages()[ modal.getMessages().length - 1 ];
                    if ( callback ) callback( item.token, Service.PPMessage.getMessageSummary( lastMsg ) );
                    return;
                }
                    
                // 2. try to find from item.latest_message
                if ( item.latest_message ) {
                    new Service
                        .ApiMessageAdapter( Service.$json.parse( item.latest_message.message_body ) )
                        .asyncGetPPMessage( function( ppMessage, success ) {
                            
                            if ( success ) {
                                if ( callback ) callback( item.token, success ? ppMessage.getMessageSummary() : "" );
                            }
                                
                        } );
                }
                
            } );
        }
    }
    
} )();
