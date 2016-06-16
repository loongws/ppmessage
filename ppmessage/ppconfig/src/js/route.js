angular.module("this_app.route", ["ui.router", "this_app.constants"])

    .config(function($stateProvider, $urlRouterProvider, yvConstants, blockUIConfig) {
        blockUIConfig.autoInjectBodyBlock = false;

        $stateProvider

            .state("app", {
                abstract: true,
                url: "/app",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "app.html",
                controller: "AppCtrl"
            })

            .state("app.config", {
                url: "/config",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "config.html",
                controller: "ConfigCtrl"
            })

        ;
      
        $urlRouterProvider.otherwise("/app/config");

    });
