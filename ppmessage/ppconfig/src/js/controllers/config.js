angular.module("this_app")
    .controller("ConfigCtrl", function($scope, $state, $stateParams, $timeout, $translate, $mdDialog, yvAjax) {

        var CONFIG_STATUS = {
            NONE: 0,
            DATABASE: 1,
            FIRST: 2,
            IOS: 3,
            ANDROID: 4,
            RESTART: 5
        };

        $scope._config_status = CONFIG_STATUS.NONE;
        
        $scope.get_database_status = function() {
            if ($scope._config_status == CONFIG_STATUS.NONE) {
                return "N/A";
            }
            return "OK";
        };

        $scope.get_first_status = function() {
            if ($scope._config_status >= CONFIG_STATUS.FIRST) {
                return "OK";
            }
            return "N/A";
        };

        $scope.get_apns_status = function() {
            if ($scope._config_status >= CONFIG_STATUS.IOS) {
                return "OK";
            }
            return "N/A";
        };

        $scope.get_android_push_status = function() {
            if ($scope._config_status == CONFIG_STATUS.ANDROID) {
                return "OK";
            }
            return "N/A";
        };

        $scope.should_disable_initialize_database = function() {
            if ($scope._config_status == CONFIG_STATUS.NONE) {
                return false;
            }
            return true;
        };
        
        $scope.should_disable_create_first = function() {
            if ($scope._config_status == CONFIG_STATUS.DATABASE) {
                return false;
            }
            return true;
        };
        
        $scope.should_disable_config_apns = function() {
            if ($scope._config_status == CONFIG_STATUS.FIRST) {
                return false;
            }
            return true;
        };
        
        $scope.should_disable_config_android_push = function() {
            if ($scope._config_status == CONFIG_STATUS.IOS) {
                return false;
            }
            return true;
        };

        $scope.should_disable_restart = function() {
            if ($scope._config_status >= CONFIG_STATUS.ANDROID) {
                return false;
            }
            return true;
        };

        $scope.initialize_database = function(ev) {
            $mdDialog.show({
                controller: ConfigServerController,
                templateUrl: 'templates/dialog/config-server.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(answer) {
                $scope._init_config_status();
            }, function() {
            });
        };
                
        $scope.create_first = function(ev) {
            $mdDialog.show({
                controller: CreateFirstController,
                templateUrl: 'templates/dialog/create-first.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(answer) {
                $scope._init_config_status();
            }, function() {
            });
        };
        
        $scope.config_ios = function(ev) {

            $mdDialog.show({
                controller: ConfigIOSController,
                templateUrl: 'templates/dialog/config-ios.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(answer) {
                $scope._init_config_status();
            }, function() {
            });
        
        };

        $scope.config_android = function(ev) {

            $mdDialog.show({
                controller: ConfigAndroidController,
                templateUrl: 'templates/dialog/config-android.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(answer) {
                $scope._init_config_status();
            }, function() {
            });
        
        };

        $scope.restart_ppmessage = function(ev) {
            $mdDialog.show({
                controller: RestartController,
                templateUrl: 'templates/dialog/restart-ppmessage.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(answer) {
                $scope._init_config_status();
            }, function() {
            });

        };

        $scope._init_config_status = function() {
            yvAjax.status().success(function(data) {
                $scope._config_status = CONFIG_STATUS[data.status];
            }).error(function() {
            });
        };

        $scope._init_config_status();
        
    }); // end login ctrl
