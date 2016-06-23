angular.module("this_app")
	.controller("IntegrateCtrl", function($scope, $rootScope, $stateParams, $cookies, $state, $timeout, $http, $translate, yvTransTags, yvAjax, yvUtil, yvUser, yvConstants, yvLogin) {

        $scope.enterprise = {
            link: null,
            code: null
        };

        var _generate_enterprise_link = function() {
            var _team = yvUser.get_team();
            if (_team == null) {
                return;
            }

            // `base64_encode` only accept `255 ascill` characters, so we need `escape` here
            var _appObj = { uuid: _team.uuid,
                            app_name: encodeURI( _team.app_name || '' ) }; 
            var _url = location.protocol + "//" + location.host + "/ppcom/enterprise/";
            var _param = yvUtil.base64_encode(JSON.stringify(_appObj));
            $timeout(function() {
                $scope.enterprise.link = _url + _param;
            });
            
        };

        var _generate_embedded_code = function() {
            var _own_team = yvUser.get_team();
            var _url = null;
            var _server = location.protocol + "//" + location.host;
            var _pre = "<script> window.ppSettings = {";
            _pre = _pre + "app_uuid:";
            _pre = _pre + "'" + _own_team.uuid + "'};";
            _pre = _pre + "(function(){var w=window,d=document;function l(){var a=d.createElement('script');a.type='text/javascript';a.async=!0;a.src='{SERVER}/ppcom/assets/pp-library.min.js';var b=d.getElementsByTagName('script')[0];b.parentNode.insertBefore(a,b)}w.attachEvent?w.attachEvent('onload',l):w.addEventListener('load',l,!1);})()</script>";
            _pre = _pre.replace("{SERVER}", _server);
            $scope.enterprise.code = _pre;
        };

        var _on_team_ok = function() {
            _generate_enterprise_link();
            _generate_embedded_code();
        };
                      
        var _logined = function() {
            yvLogin.prepare( function( errorCode ) {
                _on_team_ok();
            }, { $scope: $scope, onRefresh: _on_team_ok } );
        };

        var _translate = function() {
            var _tag_list = [];
            var i;
            for (i in yvTransTags.en.application.profile) {
                var _t = "application.profile." + i;
                _tag_list.push(_t);
            };

            $scope.translate = function() {
                // console.log($scope.lang);
            };
            
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };
        
		var _init = function() {
            _translate();
            $scope.refresh_settings_menu();
            _logined();
        };
		
		_init();
	}); // end ctrl
