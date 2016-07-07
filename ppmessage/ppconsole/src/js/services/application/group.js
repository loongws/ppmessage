(function() {

    yvAppServiceGroupService.$inject = [ 'yvAjax', 'yvUser', 'yvCallbackService', 'yvDebug' ];
    function yvAppServiceGroupService( yvAjax, yvUser, yvCallbackService, yvDebug ) {

        var DEFAULT_PAGE_COUNT = 12;
        
        ////// Api //////////

        return {
            getAppServiceGroupsWithPagination: getAppServiceGroupsWithPagination,
        };

        ////// Implementation //////////

        function getAppServiceGroups( successCallback, errorCallback ) {
            yvAjax.get_group_list( { app_uuid: yvUser.get_team().uuid } )
                .success( function( data ) {
                    yvCallbackService.response( angular.copy( data ), onSuccess, onError );
                })
                .error( onError );

            function onSuccess( data ) {
                successCallback && successCallback( data.list );
            }

            function onError( e ) {
                errorCallback && errorCallback( [] );
            }            
        }

        // @description
        //     - filter by group_name
        //     - support pagination ( in front-end )
        //     - support sort by `updatetime`
        //
        // @param settings
        // {
        //     length: `count of each page`, default is 12
        //     start_page: 0 ~ +Infinity
        //     
        //     filter_keyword: `your keyword`, default is ''
        //     sort: `true/false`, default is `true`, sort by `updatetime` in Desending order
        // }
        //
        // @return
        // {
        //     groups: [ groupA, groupB, ... ], // current page groups
        //     total: totalNumber // total user's count after filtered
        // }
        function getAppServiceGroupsWithPagination( settings, successCallback, errorCallback ) {
            getAppServiceGroups( function( groups ) {
                
                // `angular.extend(dst, src);`
                // @see http://docs.angularjs.cn/api/ng/function/angular.extend
                var s = angular.extend( { filter_keyword: '', length: DEFAULT_PAGE_COUNT, start_page: 0, sort: true }, settings ),
                    filteredGroups = filter( s, groups ),
                    total = filteredGroups.length,
                    paginationGroups = pagination( s, sort( s, filteredGroups ) );
                
                yvCallbackService.success( {
                    groups: paginationGroups,
                    total: total
                } , successCallback );
                
            }, function( e ) {
                yvCallbackService.error( e, errorCallback );
            } );
        }

        
        function filter( settings, groups ) {
            
            if ( settings.filter_keyword === '' ) {
                return groups || [];
            }

            var keyword = settings.filter_keyword,
                regex = new RegExp( '.*' + keyword + '.*', 'g' ),
                result = [];
            
            angular.forEach( groups, function( value, index ) {
                if ( regex.test( value.group_name ) || regex.test( value.group_desc ) ) {
                    result.push( value );
                }
            } );

            return result;
        }

        function pagination( settings, groups ) {
            var pageCount = settings.length,
                pageNum = settings.start_page,
                len = groups.length,
                startIndex = pageNum * pageCount,
                endIndex = startIndex + pageCount,
                i = startIndex,
                result = [];

            var group;
            while ( (group = groups[i++]) !== undefined && i <= endIndex ) {
                result.push(group);
            }
            return result;            
        }

        function sort( settings, groups ) {
            if ( !settings.sort ) return groups;
            return groups.sort( compare );
            function compare( a, b ) {
                return a.updatetime > b.updatetime ? -1 : 1;
            }
        }
    }

    angular.module("this_app.services").factory("yvAppServiceGroupService", yvAppServiceGroupService);

} )();
