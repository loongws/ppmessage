//
// @documentation
//     every conversation has several filed named `type`, `token`, `ts`
//
//
//     `token`: as the conversation's unique identifier:
//
//     `ts`: used for sort conversations
//
//     every conversation has several filed named `active`, `vip`
//
//     `active`: there is only ONE `active` conversation at the same time:
//     - true ( means this conversation is the user begin to chat or chatting with now )
//     - false
//
//     `vip`: means this conversation is the default conversation that will show on the welcome hovercard
//     - true
//     - false
//
//     ======================================
//     |          Get Conversation          |
//     ======================================
//
//     When the following api
//
//     - `asyncGetDefaultConversation`
//     - `asyncGetConversation`
//
//     failed to get conversation, it means you should waitting the server to
//     give you an avaliable `Conversation` after a while, here are two events you may interested on:
//
//     - `Event.WAITING` // the server is busy now, and you should waitting
//     - `Event.AVALIABLE` // Hey, a new conversation is avaliable now, and you can continue to chatting
//
//     if you interested in the event `EVENT.WAITING`, please subscribe the event
//     ```javascript
//     Service.$subpub.subscribe( Service.$conversationManager.EVENT.WAITING, function( topic, conversation ) {
//         // we should waiting to get an avaliable conversation now
//     } };
//     ```
//
//     if you interested in the event `EVENT.AVALIABLE`, please subscribe the event
//     ```javascript
//     Service.$subpub.subscribe( Service.$conversationManager.EVENT.AVALIABLE, function( topic, conversation ) {
//         // the server has give us an avaliable conversation now, so we begin talk now
//     } };
//     ```
//
Service.$conversationManager = ( function() {

    var EVENT = { WAITING: 'CONVERSATION_MANAGER/WAITING',
                  AVALIABLE: 'CONVERSATION_MANAGER/AVALIABLE' },
        conversationList = [],
        activeToken,
        hasLoadedAllConversationList = false;

    ////////// API ///////////
    return {
        EVENT: EVENT,

        init: init,
        all: all, // ONLY for debug, you should't call this method, instead of call `asyncGetList` to assure fully correct
        simulateConversationAvaliable: simulateConversationAvaliable, // for debug
        
        asyncGetDefaultConversation: asyncGetDefaultConversation,
        activeConversation: activeConversation, // acts as setter and getter
        vipConversation: findDefault,
        asyncGetList: asyncGetList,
        find: findByToken,

        asyncGetConversation: asyncGetConversation
    }

    ///////// all //////////////
    function init() {
        var $pubsub = Service.$pubsub;
        
        $pubsub.subscribe( Service.$notifyConversation.EVENT.AVALIABLE, function( topics, conversationUUID ) {

            Service.$conversationAgency.requestInfo( conversationUUID, function( conv ) {
                
                if ( conv ) {
                    // We are waiting `default conversation`
                    // Now, this `default conversation` become avaliable now
                    var isDefaultConversation = !Service.$conversationAgency.isDefaultConversationAvaliable();
                    if ( isDefaultConversation ) { 
                        onDefaultConversationAvaliable( conv );
                    } else {
                        push ( conversation( conv ) );
                    }
                    $pubsub.publish( EVENT.AVALIABLE, conv );   
                }
                
            } );
            
        } );
    }
    
    function all() {
        return sort( conversationList );
    }

    function simulateConversationAvaliable() {
        Service.$conversationAgency.enableDebug( false );
        Service.$conversationAgency.request( function( defaultConversation ) {
            onDefaultConversationAvaliable( defaultConversation );
            Service.$pubsub.publish( EVENT.AVALIABLE, defaultConversation );
        } );
    }

    //////// asyncGetDefaultConversation /////////////
    function asyncGetDefaultConversation( callback ) {

        if ( findDefault() ) {
            $onResult( findDefault(), callback );
            return;
        }

        Service.$conversationAgency.request( function( defaultConversation ) {
            if ( defaultConversation ) {
                onDefaultConversationAvaliable( defaultConversation );
            } else {
                notifyToWaiting();                
            }
            $onResult( findDefault(), callback );
        } );

    }

    function onDefaultConversationAvaliable( response ) {
        push( conversation( response, true ) );
        active( response[ 'token' ] );
    }

    //////// activeConversation ///////////
    function activeConversation( token ) {

        // act as a getter method
        if ( token === undefined ) {
            if ( activeToken !== undefined ) {
                return findByToken( activeToken );
            }

            return undefined;    
        } else { // act as a setter method
            active( token );
        }
        
    }

    /////// asyncGetList //////////////
    function asyncGetList( callback ) {

        if ( hasLoadedAllConversationList ) {
            $onResult( sort( conversationList ), callback );
            return;
        }
        
        // 2. asyncGetAllConversations
        Service.$api.getConversationList( {
            user_uuid: Service.$user.getUser().getInfo().user_uuid,
            app_uuid: Service.$ppSettings.getAppUuid()
        }, function ( response ) {

            if ( response && response.error_code === 0 ) {
                var list = ( response.list || [] ).slice();
                list && $.each( list, function( index, item ) {
                    push( conversation( item ) );
                } );
            }

            // 3. success callback
            hasLoadedAllConversationList = true;
            $onResult( sort( conversationList ), callback );
            return;
            
        }, function ( error ) {
            
            // 3. error callback
            hasLoadedAllConversationList = true;
            $onResult( sort( conversationList ), callback );
            return;
                
        } );
    }

    ///////// asyncGetConversation ///////
    
    // @param config {
    //     user_uuid: xxx, create a conversation with `member_list`
    // }
    // provided `user_uuid`
    function asyncGetConversation( config, callback ) {
        if ( config.user_uuid !== undefined ) throw new Error();

        var exist = ( config.user_uuid !== undefined ) ? find( config.user_uuid ) : undefined; 

        if ( !Service.$tools.isNull( exist ) ) {
            $onResult( exist, callback );
            return;
        }

        Service.$conversationAgency.create( config, function( conv ) {
            
            if ( conv ) {
                push( conversation( conv ) );
                $onResult( findByToken( conv.uuid ) , callback );
            } else {
                $onResult( undefined, callback );
                notifyToWaiting();
            }
            
        } );

        // try to match `assigned_uuid` to `userId`
        function find( userId ) {

            var r;
            $.each( conversationList, function( index, item ) {
                if ( item.assigned_uuid === userId ) {
                    r = item;
                }
            } );
            return r;
            
        }

        function shouldWaiting( r ) {
            return r.error_code !== 0 || Service.$tools.isApiResponseEmpty( r );
        }
        
    }

    ////////// set `token` to active /////////
    function active( token ) {
        
        var conversation = findByToken( token );
        if ( conversation !== undefined ) {
            
            $.each( conversationList, function ( index, item ) {
                item.active = false;
            } );

            conversation.ts = Date.now();
            conversation.active = true;
            activeToken = token;
            
        }

        vip( token );
        
    }

    function vip( token ) {

        var conversation = findDefault(),
            appWelcome,
            appName;
        
        if ( conversation !== undefined ) {
            
            appWelcome = conversation.app_welcome;
            appName = conversation.app_name;
            
            conversation.vip = false;
            delete conversation.app_welcome;
            delete conversation.app_name;
            
        }

        var newer = findByToken( token );
        if ( newer ) {

            // move welcome info and `vip` flag to the newer conversation
            newer.vip = true;
            appWelcome && ( newer.app_welcome = appWelcome );
            appName && ( newer.app_name = appName );
            
        }
        
    }

    function conversation( item, vip ) {        
        item [ 'token' ] = item.uuid;
        item [ 'ts' ] = Service.$tools.getTimestamp( item.updatetime );
        item [ 'vip' ] = ( typeof vip === 'boolean' ) ? vip : false;
        return item;
    }

    function findByToken( token ) {

        var find,
            i,
            len = conversationList.length;

        for ( i = 0; i < len; ++i ) {
            if ( token === conversationList [ i ].token ) return conversationList [ i ];
        }
        
        return undefined;        
    }

    function findDefault() {

        var find,
            i,
            len = conversationList.length;
        
        for ( i = 0 ; i < len ; ++i ) {
            if ( conversationList [ i ].vip ) return conversationList [ i ];
        }

        return undefined;
        
    }

    function sort( conversations ) {

        if ( !conversations || conversations.length <= 1 ) return conversations;
        return conversations.sort( compare );

        function compare( a, b ) {
            
            var timestampA = a.ts,
                timestampB = b.ts;

            return timestampB - timestampA;
        }
        
    }

    function push( conversation ) {

        var existItem;
        $.each( conversationList, function ( index, item ) {
            if ( existItem === undefined && item.token === conversation.token ) {
                existItem = item;
            }
        } );

        if ( existItem === undefined ) {
            conversationList.push( conversation );
        } else {
            conversation.vip = existItem.vip; // prevent `vip` override
            $.extend( existItem, conversation );
        }
        
    }

    // === helpers ===
    function notifyToWaiting() {
        Service.$pubsub.publish( EVENT.WAITING );
    }
    
} )();
