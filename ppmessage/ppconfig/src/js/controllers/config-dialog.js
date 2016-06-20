function ConfigServerController($scope, $mdDialog, yvAjax) {

    var DATABASE_TYPE = {
        SQLITE: "SQLITE",
        MYSQL: "MYSQL",
        PGSQL: "PGSQL"
    };

    $scope.database = {
        server: {
            name: "127.0.0.1",
            port: 8945,
        },
        
        db: {
            type: DATABASE_TYPE.SQLITE,
            types: angular.copy(DATABASE_TYPE),
            sqlite: {
                db_file_path: "/usr/local/var/db/sqlite/ppmessage.db"
            },
            mysql: {
                db_host: "127.0.0.1",
                db_port: "3306",
                db_user: "root",
                db_pass: "test",
                db_name: "ppmessage"
            },
            pgsql: {
                db_host: "127.0.0.1",
                db_port: "5432",
                db_user: "postgres",
                db_pass: "test",
                db_name: "ppmessage"
            }
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
        if ($scope.database.db.type == DATABASE_TYPE.MYSQL) {
            return true;
        }
        return false;
    };

    $scope.should_show_sqlite = function() {
        if ($scope.database.db.type == DATABASE_TYPE.SQLITE) {
            return true;
        }
        return false;
    };

    $scope.should_show_pgsql = function() {
        if ($scope.database.db.type == DATABASE_TYPE.PGSQL) {
            return true;
        }
        return false;
    };

    $scope.confirm = function() {
        yvAjax.database($scope.database).success(function(){
            console.log("database create successfully");
            $mdDialog.hide("success");
        }).error(function(){
            console.log("database create failed");
        });
    };
    
}

function CreateFirstController($scope, $mdDialog, yvAjax) {
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
        yvAjax.first($scope.user).success(function(){
            $mdDialog.hide("success");
        }).error(function(){
            console.log("first user create failed");
        });
    };
    
}

function ConfigIOSController($scope, $mdDialog, yvAjax, FileUploader) {

    $scope.ios = {
        files: {
            dev_cert: null,
            pro_cert: null,
            com_cert: null
        },
        
        passwords: {
            dev_cert_password: null,
            pro_cert_password: null,
            com_cert_password: null
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
        console.log($scope.ios);

        var _update_progress = function(_d) {
            console.log("_update_progress ", _d);
        };

        var _transfer_complete = function(_d) {
            console.log("_transfer_compelete ", _d);
            $mdDialog.success("");
        };

        var _transfer_failed = function(_d) {
            console.log("_transfer_failed ", _d);
        };

        var _transfer_canceled = function(_d) {
            console.log("_transfer_canceled ", _d);
        };
        
        //FILL FormData WITH FILE DETAILS.
        var data = new FormData();

        for(var i in $scope.ios.files) {
            data.append(i, $scope.ios.files[i]);
        }

        for(var i in $scope.ios.passwords) {
            data.append(i, $scope.ios.passwords[i]);
        }

        console.log(data);
        
        // ADD LISTENERS.
        var objXhr = new XMLHttpRequest();
        objXhr.addEventListener("progress", _update_progress, false);
        objXhr.addEventListener("load", _transfer_complete, false);
        objXhr.addEventListener("error", _transfer_failed);
        objXhr.addEventListener("abort", _transfer_canceled);
        
        // SEND FILE DETAILS TO THE API.
        objXhr.open("POST", "/ppconfig/ios");
        objXhr.send(data);
    };

    $scope.pass = function() {
        $mdDialog.hide("success");
    };

    var uploader = $scope.uploader = new FileUploader({
        url:"/ios",
        
    });

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    $scope.getFileDetails = function (e, name) {
        $scope.ios.files[name] = e.files[0];
    };
}

function ConfigAndroidController($scope, $mdDialog, yvAjax) {

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
        yvAjax.android($scope.android).success(function(){
            $mdDialog.hide("success");
        }).error(function(){
            console.log("android failed");
        });
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
    

