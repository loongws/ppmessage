
angular.module("this_app.services", []);

angular.module("this_app", [
    "720kb.tooltips",
    "base64",
    "ngCookies",
    "ngAnimate",
    "toastr",
    "angularUtils.directives.dirPagination",
    "angularFileUpload",
    "blockUI",
    "ui.router",
    "ngMaterial",
    "this_app.constants",
    "this_app.i18n",
    "this_app.route",
    "this_app.services",
])

    .run(function($rootScope, $location, $timeout) {
        if (window.PP) {
            PP.boot({
                app_uuid: 'a600998e-efff-11e5-9d9f-02287b8c0ebf', 
            }, function(isSuccess, errorCode) {
                console.log("PPCOM boot: ", errorCode);
            });
        }        
    })

;
