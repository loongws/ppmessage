angular.module("this_app")
    .controller("AppCtrl", function($window, $scope, $rootScope, $location, $state, $translate, $timeout, $cookies, $filter, toastr, yvAjax, yvUser, yvUtil, yvDebug, yvLogin, yvAppService, yvConstants, yvLoginedUser, yvTransTags) {

        $scope._languages = [
            {
                lang: "zh-CN",
            },            
            {
                lang: "en",
            },
        ];


        var _getPreferredLanguage = function() {
            var _p = $translate.use();
            var _l = $scope._languages.length;
            for (var i = 0; i < _l; i++) {
                if ($scope._languages[i].lang == _p) {
                    return $scope._languages[i].lang;
                }
            }
            return $scope._languages[0].lang;
        };
        
        var _getLanguage = function() {
            var _l = yvUser.get_language();
            if (_l == null) {
                _l = _getPreferredLanguage();
                yvUser.set_language(_l);
            }
            return _l;
        };
        
        $scope.ppmessage = function() {
            window.open("https://ppmessage.com");
        };

        $scope.switch_to_english = function () {
            yvUser.set_language("en");
            $translate.use("en");
        };

        $scope.switch_to_chinese = function () {
            yvUser.set_language("zh-CN");
            $translate.use("zh-CN");
        };

        $scope.is_lang_english = function() {
            var _l = yvUser.get_language();
            if (_l == null) {
                return true;
            }
            if (_l == "en") {
                return true;
            }
            return false;
        };
        
        $scope.toast_error_string = function(str) {
            var _local_str = $filter("translate")("global." + str);
            console.log(_local_str);
            $timeout( function() {
                toastr.error(_local_str);
            });
        };

        $scope.toast_success_string = function(str) {
            var _local_str = $filter("translate")("global." + str);
            console.log(_local_str);
            $timeout( function() {
                toastr.success(_local_str);
            });
        };

        $scope.$on("$destroy", function() {
            
        });

        var _init = function() {
        };

        _init();
        
    }); // end app ctrl
