//
//  PPMessagesStore.h
//  PPComLib
//
//  Created by PPMessage on 4/11/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>

@class PPCom, PPMessageList, PPMessage;

@interface PPMessagesStore : NSObject

+ (instancetype)storeWithClient:(PPCom*)client;

- (PPMessageList*)messagesInCovnersation:(NSString*)conversationUUID;
- (PPMessageList*)messagesInCovnersation:(NSString *)conversationUUID
                              autoCreate:(BOOL)autoCreate;

- (void)setMessageList:(PPMessageList*)messageList
       forConversation:(NSString*)conversationUUID;

- (BOOL)updateWithNewMessage:(PPMessage*)message;

// @param messageId: this `messageId` was fetched from server
- (void)updateMessageIdSet:(PPMessage*)message withApiMessageId:(NSString *)messageId;

@end
