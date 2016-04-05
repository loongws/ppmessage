ppmessageModule.factory('yvSend', [
    "$rootScope",
    "yvConstants",
    "yvNoti",
    "yvMessage",
function ($rootScope, yvConstants, yvNoti, yvMessage) {

    function _send_message(_message, _is_forward) {
        
        // send message to server or forward this message
        var _api_message = null;
        
        function __success() {
            var status = yvConstants.SEND_STATUS.SEND_SUCCESS;
            $rootScope.$broadcast("event:update_message_status", _message, status);
        }

        function __error() {
            var status = yvConstants.SEND_STATUS.SEND_ERROR;
            $rootScope.$broadcast("event:update_message_status", _message, status);
        }

        if (_is_forward === true) {
            _api_message = yvMessage.create_api_forward_message(_message);
            yvAPI.forward_message(_api_message, __success, __error);
        } else {
            _api_message = yvMessage.create_api_send_message(_message);
            var _ws_message = {
                type:"send",
                send:_api_message
            };
            yvNoti.send_message(_ws_message, __success, __error);
        }
    }
    
    return {
        send_message: function(_message, _is_forward) {
            _send_message(_message, _is_forward);
        },
        
    };
}]);
