$yvUtilService.$inject = ["$base64"];
function $yvUtilService($base64) {
    return {
        uuid: function() {
            var d = new Date().getTime();
            var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x7|0x8)).toString(16);
            });
            return id;
        },

        is_valid_email: function (email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        },

        base64_decode: function(input) {
            return $base64.decode(input);
        },

        base64_encode: function(input) {
            return $base64.encode(input);
        },
     
        // check if a string contain unregular words
        regexp_check: function(str) {
            var pattern = RegExp("[\\u4E00-\\u9FFF\\dA-z@\-\_\\s*]+","i");
            if( !str || !str.match(pattern)) {
                return false;
            };
            var reg_length = str.match(pattern).toString().length;
            if (reg_length == str.length)
                return true;
            else
                return false;
        },        
    };
}

ppmessageModule.factory("yvUtil", $yvUtilService);
