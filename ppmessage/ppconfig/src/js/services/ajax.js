$yvAjaxService.$inject = ["$state", "$timeout", "$http", "$cookies", "yvConstants"];
function $yvAjaxService($state, $timeout, $http, $cookies, yvConstants) {

    var _apiPost = function(_url, _data) {
        _data = _data || {};
        
        _url = '/ppconfig/' + _url;
        return $http({
            method: 'POST',
            cache: false,
            url: _url,
            data: _data
        });

    };

    // @see 
    var API_ERR = {
        NO_ERR: 0,
    };

    return {
        API_ERR: API_ERR,
    };
} // end $yvAjaxService

angular.module("this_app.services").factory("yvAjax", $yvAjaxService);
