((function(Service) {

    var factory = (function() {

        var build = function(ppMessageJsonBody) {
            var body = ppMessageJsonBody;
            
            sendSettings = function(){
                
                switch (body.messageType) {
                case Service.PPMessage.TYPE.TEXT:
                    return Service.$textMessageSendSettings.build(body);
                    
                case Service.PPMessage.TYPE.EMOJI:
                    return Service.$emojiMessageSendSettings.build(body);
                    
                case Service.PPMessage.TYPE.IMAGE:
                    return Service.$imageMessageSendSettings.build(body);

                case Service.PPMessage.TYPE.FILE:
                    return Service.$fileMessageSendSettings.build(body);
                }
            }();

            return sendSettings;
        };
        
        return {
            get: build
        }
        
    })();

    Service.$sendSettingsFactory = factory;
    
})(Service));
