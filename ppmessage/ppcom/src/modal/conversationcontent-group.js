Modal.$conversationContentGroup = (function() {

    var conversationContentArray = {
        // broadcast: modal of `broadcast`,
        // 
        // group_uuid_1: modal of `group_uuid_1`,
        // group_uuid_2: modal of `group_uuid_2`,
        // ...
    };


    function create(groupIdentifier) {
        return new Modal.ConversationContentModal(groupIdentifier);
    }

    function exist( groupIdentifier ) {
        return conversationContentArray [groupIdentifier] !== undefined;
    }

    return {
        get: function(groupIdentifier) {
            var modal;
            if (!exist(groupIdentifier)) {
                modal = conversationContentArray [groupIdentifier] = create(groupIdentifier);
            } else {
                modal = conversationContentArray [groupIdentifier];                
            }
            return modal;
        },

        set: function(groupIdentifier, modal) {
        
            if (!modal) throw new Error('Modal == null');
            if (exist(groupIdentifier)) throw new Error('Modal ' + groupIdentifier + ' exist!');
            
            conversationContentArray [groupIdentifier] = modal;
        },

        exist: function(groupIdentifier) {
            exist(groupIdentifier);
        },

        tryLoadLostMessages: function() {
            $.each(conversationContentArray, function(groupIdentifier, modal) {
                modal.tryLoadLostMessages();
            });
        }
    }
    
})();
