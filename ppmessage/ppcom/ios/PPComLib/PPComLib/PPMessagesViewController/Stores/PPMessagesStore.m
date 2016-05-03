//
//  PPMessagesStore.m
//  PPComLib
//
//  Created by PPMessage on 4/11/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPMessagesStore.h"
#import "PPConversationsStore.h"
#import "PPStoreManager.h"

#import "PPCom.h"
#import "PPMessageList.h"
#import "PPMessage.h"

#import "PPFastLog.h"

@interface PPMessagesStore ()

@property (nonatomic) PPCom *client;
@property (nonatomic) NSMutableDictionary *messageDictionary;

@end

@implementation PPMessagesStore

+ (instancetype)storeWithClient:(PPCom*)client {
    return [[self alloc] initWithClient:client];
}

- (instancetype)initWithClient:(PPCom*)client {
    if (self = [super init]) {
        self.client = client;
        self.messageDictionary = [NSMutableDictionary dictionary];
    }
    return self;
}

- (PPMessageList*)messagesInCovnersation:(NSString *)conversationUUID {
    return [self messagesInCovnersation:conversationUUID autoCreate:NO];
}

- (PPMessageList*)messagesInCovnersation:(NSString *)conversationUUID
                              autoCreate:(BOOL)autoCreate {
    id obj = self.messageDictionary[conversationUUID];
    if (!obj) {
        obj = [PPMessageList new];
        [self setMessageList:obj forConversation:conversationUUID];
    }
    return obj;
}

- (void)setMessageList:(PPMessageList *)messageList
       forConversation:(NSString *)conversationUUID {
    if (messageList) {
        self.messageDictionary[conversationUUID] = messageList;
    }
}

- (BOOL)updateWithNewMessage:(PPMessage *)message {
    PPMessageList *messages = [self messagesInCovnersation:message.conversationId autoCreate:YES];
    if ([messages addPPMessage:message]) {
        
        [[PPStoreManager instanceWithClient:self.client].conversationStore updateConversationsWithMessage:message];
        
        return YES;
    }
    return NO;
}

// @param messageId: this `messageId` was fetched from server
- (void)updateMessageIdSet:(PPMessage*)message withApiMessageId:(NSString *)messageId {
    
    if ( message != nil && messageId != nil ) {
    
//         conversation id
        NSString *conversationId = message.conversationId;
        if (!conversationId) {
            return;
        }
        
//         get messageList associated with `conversationId`
        PPMessageList *messageList = [self messagesInCovnersation:conversationId autoCreate:YES];
        [messageList updateMessageIdSetWith:messageId];
        
    }
    
}

- (NSString*)description {
    return [NSString stringWithFormat:@"< %p, %@, %@ >",
            self,
            self.class,
            self.messageDictionary];
}

@end
