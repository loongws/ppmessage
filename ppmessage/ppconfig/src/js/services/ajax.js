$yvAjaxService.$inject = ["$state", "$timeout", "$http", "$cookies", "yvConstants"];
function $yvAjaxService($state, $timeout, $http, $cookies, yvConstants) {

    var _api_post = function(_url, _data) {
        _data = _data || {};
        
        _url = '/ppconfig' + _url;
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
        status: function() {
            var _url = "/status";
            var _data = {};
            return _api_post(_url, _data);
        },
        
        server: function(_data) {
            var _url = "/server";
            return _api_post(_url, _data);
        },

        database: function(_data) {
            var _url = "/database";
            return _api_post(_url, _data);
        },

        first: function(_data) {
            var _url = "/first";
            var _d = angular.copy(_data);
            _d.user_password = sha1(_d.user_password);
            return _api_post(_url, _data);
        },
        
        restart: function(_data) {
            var _url = "/restart";
            var _d = angular.copy(_data);
            _d.user_password = sha1(_d.user_password);
            return _api_post(_url, _data);
        },

        API_ERR: API_ERR,
    };
} // end $yvAjaxService

angular.module("this_app.services").factory("yvAjax", $yvAjaxService);
