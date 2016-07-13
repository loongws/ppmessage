// @description
//     - filter by filter_keys
//     - sort by sort_key (default updatetime)
//     - front-end pagination
//
// @param settings
// {
//     page_size: default 12
//     page_offset: 0 ~ +Infinity
//
//     members: which to be pagination
//     filter_keys: member[key] to be filtered
//     filter_value: `your keyword`, default is ''
//     sort_key: default updatetime
//     sort: `true/false`, default is `true`, sort by `updatetime` in Desending order
// }
//
// @return
// {
//     page: [ memberA, memberB, ... ], // current page
//     total: totalNumber // total user's count after filtered
// }

angular.module("this_app.services").factory("yvPagination", $yvPaginationService);

$yvPaginationService.$inject = [];

function $yvPaginationService() {
    
    var _page = function(settings, members) {
        var startIndex = settings.page_offset * settings.page_size,
            endIndex = startIndex + settings.page_size,
            i = startIndex,
            result = [];

        var member;
        while ( (member = members[i++]) !== undefined && i <= endIndex ) {
            result.push(member);
        }
        return result;
    };

    var _sort = function(settings, members) {
        if ( !settings.sort ) return members;

        return members.sort(compare);
        
        function compare(a, b) {
            return a[settings.sort_key] > b[settings.sort_key] ? -1 : 1;
        }
    }

    var _filter = function(settings) {
        if (settings.filter_value === '') {
            return settings.members || [];
        }
        
        var keyword = settings.filter_value,
            regex = new RegExp( '.*' + keyword + '.*', 'g' ),
            result = [];
            
        angular.forEach(settings.members, function(value, index) {
            for (var i = 0; i < settings.filter_keys.length; i++) {
                if (regex.test(value[settings.filter_keys[i]])) {
                    result.push( value );
                    break;
                }
            }
        });
        return result;
    };
    
    var _pagination = function(settings) {
        var PAGE_SIZE = 12;
        var _settings = angular.extend({
            filter_value: '',
            page_size: PAGE_SIZE,
            page_offset: 0,
            sort_key: 'updatetime',
            sort: true
        }, settings),
            _filtered = _filter(_settings),
            _total = _filtered.length,
            _one = _page(_settings, _sort(_settings, _filtered));

        return {total: _total, page: _one};
    };

    return {
        pagination: function(settings) {
            return _pagination(settings);
        }
    };
}
