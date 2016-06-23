//
// - Submit a task to polling
//
// ```javascript
// Service.$polling.run( { eventID: 'get-waiting-queue-length',
//                         apiFunc: Service.$api.getWaitingQueueLength,
//                         apiRequestParams: { app_uuid: xxx },
//                         delay: 1000, // 1000ms
//                         onGet: function( response, success ) {
//                             if ( success ) console.log( 'current waiting queue length is ', response.length );
//                         } } );
// ```
//
// - Cancel a task in polling list
//
// ```
// Service.$polling.cancel( { eventID: 'get-waiting-queue-length' } );
// ```
//
Service.$polling = ( function() {

    var DEFAULT_DELAY = 3000, // ms
        OPTIONS = { eventID: undefined,
                    apiFunc: undefined,
                    apiRequestParams: undefined,
                    delay: DEFAULT_DELAY,
                    onGet: undefined },
        tasks = {};

    return {
        run: run,
        cancel: cancel
    }

    //
    // @param config: {
    //     eventID: `your eventID` *
    //     apiFunc: `api function that should be called` *
    //     apiRequestParams: `api request params`
    //     delay: `the next call after this`, DEFAULT is 3000ms
    //     onGet: `onGet callback` ( data, success )
    // }
    function run( config ) {
        var copy = $.extend( OPTIONS, config );
        if ( !copy.eventID || !copy.apiFunc ) return;
        if ( tasks[ copy.eventID ] ) return;

        tasks[ copy.eventID ] = { handler: undefined };
        execute( copy );
    }

    //
    // @param config: {
    //     eventID: `your eventID` *
    // }
    function cancel( config ) {
        if ( !config || !config.eventID ) return;
        if ( isCancel( config ) ) return;

        if ( tasks[ config.eventID ].handler ) {
            $clearTimeout( tasks[ config.eventID ].handler );
        }
        tasks[ config.eventID ] = undefined;
    }

    // ==== Helpers ====
    function isCancel( config ) {
        return tasks[ config.eventID ] === undefined;
    }
    
    function execute( config ) {
        config.apiFunc.call( Service.$api, config.apiRequestParams, function( r ) {
            if ( !isCancel( config ) ) {
                makeCallback( config, r, true );
                scheduleNext( config );
            }
        }, function( e ) {
            if ( !isCancel( config ) ) {
                makeCallback( config, e, false );
                scheduleNext( config );
            }
        } );
    }

    function makeCallback( config, r, success ) {
        if ( config.onGet ) config.onGet( r, success );
    }

    function scheduleNext( config ) {
        tasks[ config.eventID ].handler = $timeout( function() {
            if ( !isCancel( config ) ) {
                execute( config );
            };
        }, config.delay );
    }
    
} )();
