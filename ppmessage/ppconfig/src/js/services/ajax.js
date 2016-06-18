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
        status: function () {
            var _url = "/status";
            var _data = {};
            return _api_post(_url, _data);
        },

        database: function () {
            var _url = "/database";
            var _data = {};
            return _api_post(_url, _data);
        },

        first: function () {
            var _url = "/first";
            var _data = {};
            return _api_post(_url, _data);
        },

        ios: function () {
            var _url = "/ios";
            var _data = {};
            return _api_post(_url, _data);
        },

        android: function () {
            var _url = "/android";
            var _data = {};
            return _api_post(_url, _data);
        },

        API_ERR: API_ERR,
    };
} // end $yvAjaxService

angular.module("this_app.services").factory("yvAjax", $yvAjaxService);
