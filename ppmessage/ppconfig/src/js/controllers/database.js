function InitializeDatabaseController($scope, $mdDialog) {

    var DATABASE_TYPE = {
        SQLITE: "SQLITE",
        MYSQL: "MYSQL",
        PGSQL: "PGSQL"
    };

    $scope.database = {
        type: DATABASE_TYPE.SQLITE,
        types: angular.copy(DATABASE_TYPE),
        sqlite: {
            db_file_path: "/user/local/var/db/sqlite/ppmessage.db"
        },
        mysql: {
            db_host: "127.0.0.1",
            db_port: "3306",
            db_user: "root",
            db_password: "password",
            db_name: "ppmessage"
        },
        pgsql: {
            db_host: "127.0.0.1",
            db_port: "5432",
            db_user: "postgresql",
            db_password: "password",
            db_name: "ppmessage"
        }
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.should_show_mysql = function() {
        if ($scope.database.type == DATABASE_TYPE.MYSQL) {
            return true;
        }
        return false;
    };

    $scope.should_show_sqlite = function() {
        if ($scope.database.type == DATABASE_TYPE.SQLITE) {
            return true;
        }
        return false;
    };

    $scope.should_show_pgsql = function() {
        if ($scope.database.type == DATABASE_TYPE.PGSQL) {
            return true;
        }
        return false;
    };

    $scope.confirm = function() {
        yvAjax.database().success(function(){
            console.log("database create successfully");
            $mdDialog.hide("success");
        }).error(function(){
            console.log("database create failed");
        });
        console.log("confirm to initialize database");
    };
    
}

function CreateFirstController($scope, $mdDialog) {
    var LANGUAGE = {
        CHINESE: "CHINESE",
        ENGLISH: "ENGLISH"
    };
    
    $scope.user = {
        languages: angular.copy(LANGUAGE),
        user_fullname: "Guijin Ding",
        user_email: "dingguijin@gmail.com",
        user_password: "YouGiveLoveABadName",
        user_language: LANGUAGE.CHINESE,
        team_name: "PPMessage"
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.confirm = function() {
        $mdDialog.hide("success");
    };
    
}

function ConfigIOSController($scope, $mdDialog) {

    $scope.ios = {
        dev_cert_file_path: null,
        dev_cert_password: null,
        pro_cert_file_path: null,
        pro_cert_password: null,
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.confirm = function() {
        $mdDialog.hide("success");
    };

    $scope.pass = function() {
        $mdDialog.hide("success");
    };
}

function ConfigAndroidController($scope, $mdDialog) {

    var PUSH_TYPE = {
        MQTT: "MQTT",
        GCM: "GCM",
        JPUSH: "JPUSH"
    };
    
    $scope.android = {
        type: PUSH_TYPE.MQTT,
        types: angular.copy(PUSH_TYPE),

        gcm: {
            api_key: "AIzaSyArXf60KTz2KwROtzAlQDJozAskFAdvzBF",
        },

        jpush: {
            master_secret: null,
        }
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.confirm = function() {
        $mdDialog.hide("success");
    };

    $scope.pass = function() {
        $mdDialog.hide("success");
    };

    $scope.should_show = function(push_type) {
        if ($scope.android.type == push_type) {
            return true;
        }
        return false;
    };

}

function RestartController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.confirm = function() {
        $mdDialog.hide("success");
    };

    $scope.pass = function() {
        $mdDialog.hide("success");
    };

}
    

