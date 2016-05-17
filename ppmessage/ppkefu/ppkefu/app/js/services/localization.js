ppmessageModule.factory('yvLocal', [
    "$filter",
    "$cookies",
    "$translate",
    "yvSys",
    "yvAPI",
function ($filter, $cookies, $translate, yvSys, yvAPI) {

    function _get_electron_session() {
        var win = require("electron").remote.getCurrentWindow();
        var session = win.webContents.session;
        return session;
    }
    
    // for Browser and Electron only
    function _get_current_language(callback) {
        if (yvSys.in_electron()) {
            // don't set url when get cookies
            var session = _get_electron_session();
            var server = yvAPI.get_server();
            var data = {
                "url": server.protocol + server.host,
                "name": "current_language"
            };
            session.cookies.get(data, function (err, cookies) {
                if (err) console.error(err);
                var language = navigator.language;
                if (cookies.length > 0 && cookies[0].value) {
                    language = cookies[0].value;
                }
                callback(language);
            });
        } else {
            var language = $cookies.get("current_language") || navigator.language;
            callback(language);
        }
    }
    
    // for Browser and Electron only
    function _set_current_language(language) {
        var expire_date = new Date();
        expire_date.setDate(expire_date.getDate() + "365");
        if (yvSys.in_electron()) {
            var session = _get_electron_session();
            var server = yvAPI.get_server();
            var data = {
                "url": server.protocol + server.host,
                "name": "current_language",
                "value": language,
                "expirationDate": expire_date / 1000
            };
            session.cookies.set(data, function (err) {
                if (err) console.error(err);
            });
        } else {
            $cookies.put("current_language", language, { "expires": expire_date });
        }
    }

    function _translate(str) {
        if (str && typeof str === "string") {
            return $filter("translate")(str);
        }
        return str;
    }

    
    function _format_timestamp(timestamp, in_conversation) {
        if (!timestamp) {
            return "";
        }
        
        // Note: It should be noted that moments are mutable.
        // Calling any of the manipulation methods will change the original moment.
        var now = moment();
        var start = now.clone().startOf("day");
        var end = now.clone().endOf("day"); 
        var target = moment.unix(timestamp);

        // today
        if (target.isBetween(start, end)) {
            return target.format("HH:mm");
        }

        // future, should not happen, just in case
        if (target.isAfter(end)) {
            if (in_conversation) {
                return target.format("MM-DD");
            }
            return target.format("MM-DD HH:mm")
        }

        // yesterday
        start.subtract(1, "day");
        end.subtract(1, "day");
        if (target.isBetween(start, end)) {
            if (in_conversation) {
                return _translate("app.GLOBAL.YESTERDAY") + target.format(" HH:mm");
            }
            return _translate("app.GLOBAL.YESTERDAY");
        }
        
        // before yesterday, if in conversation, show date & time, if not, only show date
        if (in_conversation) {
            return target.format("MM-DD HH:mm");
        }
        return target.format("MM-DD");
    }

    
    function _set_moment_locale() {
        var locale = _translate("app.GLOBAL.TIMESTAMP_LANGUAGE");
        moment.locale(locale);
    }

    function _filter_language(language) {
        var lower = language.toLowerCase();
        if (lower.indexOf("zh") === 0) {
            return "zh-Hans";
        }
        if (lower.indexOf("en") === 0) {
            return "en";
        }
        return language;
    }
    
    return {
        localize: function (cb) {
            if (yvSys.in_mobile_app()) {
                navigator.globalization.getPreferredLanguage(function (local) {
                    var language = _filter_language(local.value);
                    $translate.use(language).then(function () {
                        _set_moment_locale();
                        cb && cb();
                    });
                });
                return;
            }
            
            _get_current_language(function (current_language) {
                $translate.use(current_language).then(function () {
                    _set_moment_locale();
                    cb && cb();
                });
            });
        },
        
        localize_by_language: function (language) {
            $translate.use(language).then(function () {
                _set_moment_locale();
                _set_current_language(language);
            });
        },

        filter_language: function (language) {
            return _filter_language(language);
        },
        
        get_current_language: function (callback) {
            return _get_current_language(callback);
        },

        set_current_language: function (language) {
            return _set_current_language(language);
        },
        
        translate: function (_str) {
            return _translate(_str);
        },

        format_timestamp: function (timestamp, in_conversation) {
            return _format_timestamp(timestamp, in_conversation);
        }
    };
}]);
