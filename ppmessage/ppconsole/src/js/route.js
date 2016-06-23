angular.module("this_app.route", ["ui.router", "this_app.constants"])

    .config(function($stateProvider, $urlRouterProvider, yvConstants, blockUIConfig) {
        blockUIConfig.autoInjectBodyBlock = false;

        $stateProvider

            .state("forget", {
                url: "/forget",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "forget.html",
                controller: "ForgetCtrl"
            })

            .state("app", {
                abstract: true,
                url: "/app",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "app.html",
                controller: "AppCtrl"
            })

            .state("app.signin", {
                url: "/signin",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "signin.html",
                controller: "SignInCtrl"
            })

            .state("app.error", {
                url: "/error",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "404.html",
                controller: "ErrorCtrl"
            })

            .state("app.createaccount", {
                url: "/createaccount/:account",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "createaccount.html",
                controller: "CreateAccountCtrl"
            })

            .state("app.recoverpassword", {
                url: "/recoverpassword/:account",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "recoverpassword.html",
                controller: "RecoverPasswordCtrl"
            })

             .state("app.resetpassword", {
                url: "/resetpassword/:email",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/resetpassword.html",
                controller: "SettingsResetpasswordCtrl"
            })

             .state("app.confirmreset", {
                url: "/confirmreset",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/confirmreset.html",
                controller: "SettingsConfirmresetCtrl"
            })

            .state("app.settings.teamprofile", {
                url: "/teamprofile",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/teamprofile.html",
                controller: "ApplicationProfileCtrl"
            })

            .state("app.settings.configuration", {
                url: "/configuration",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/welcome.html",
                controller: "ApplicationWelcomeCtrl"
            })

            .state("app.settings.teamgrouping", {
                url: "/teamgrouping",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/grouping.html",
                controller: "GroupingCtrl"
            })

            .state("app.glance", {
                url: "/glance",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/glance.html",
                controller: "GlanceCtrl"
            })
        
            .state("app.settings.teampeople", {
                url: "/teampeople",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/people.html",
                controller: "ApplicationPeopleCtrl"
            })

            .state("app.settings.messageroute", {
                url: "/messageroute",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/messageroute.html",
                controller: "ApplicationMessageRouteCtrl"
            })

            .state("app.settings.overview", {
                url: "/overview",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/overview.html",
                controller: "StatisticsOverviewCtrl"
            })

            .state("app.settings.historymessage", {
                url: "/historymessage",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/historymessage.html",
                controller: "StatisticsHistoryMessageCtrl"
            })

            .state("app.settings.integrate", {
                url: "/integrate",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/integrate.html",
                controller: "IntegrateCtrl"
            })

            .state("app.settings", {
                abstract: true,
                url: "/settings",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/settings.html",
                controller: "SettingsCtrl"
            })

            .state("app.settings.profile", {
                url: "/profile",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/userprofile.html",
                controller: "SettingsProfileCtrl"
            })

            .state("app.settings.account", {
                url: "/account",
                templateUrl: yvConstants.TEMPLATE_PREFIX + "settings/account.html",
                controller: "SettingsAccountCtrl"
            })
        ;
      
        $urlRouterProvider.otherwise("/app/signin");

    });
