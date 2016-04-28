//
//  PPDataCache.m
//  PPComDemo
//
//  Created by Kun Zhao on 10/8/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPDataCache.h"
#import "PPConversationItem.h"
#import "PPMessage.h"

#define CONVERSATION_LIST_CACHE_KEY @"PP_CONVERSATION_LIST_KEY"

@implementation PPDataCache

#pragma mark - Load Cache

-(PPConversationsList*)getCachedConversationList {
    id value = [self objectForKey:CONVERSATION_LIST_CACHE_KEY];
    if (value != nil) {
        return (PPConversationsList*)value;
    }
    return nil;
}

-(PPConversationsList*)getCachedConversationList:(BOOL)autoCreate {
    PPConversationsList* value = [self getCachedConversationList];
    if (!value) {
        if (autoCreate) {
            value = [[PPConversationsList alloc] init];
        }
    }
    return value;
}

-(PPMessageList*)getCachedMessagesList:(NSString*)conversationId {
    NSParameterAssert(conversationId != nil);
    id value = [self objectForKey:conversationId];
    if (value != nil) {
        return (PPMessageList*)value;
    }
    return nil;
}

-(PPMessageList*)getCachedMessagesList:(NSString*)conversationId autoCreate:(BOOL)autoCreate {
    PPMessageList *messageList = [self getCachedMessagesList:conversationId];
    if (!messageList) {
        if (autoCreate) {
            messageList = [[PPMessageList alloc] init];
            [self cacheMessagesList:messageList withConversationId:conversationId];
        }
    }
    return  messageList;
}

#pragma mark - Cache

-(void)cacheConversationList:(NSMutableArray*)conversationList {
    if (conversationList != nil) {
        [self setObject:conversationList forKey:CONVERSATION_LIST_CACHE_KEY];
    }
}

-(void)cacheMessagesList:(PPMessageList*)messagesList withConversationId:(NSString*)conversationId {
    NSParameterAssert(conversationId != nil);
    if (messagesList != nil) {
        [self setObject:messagesList forKey:conversationId];
    }
}

- (BOOL)updateCache:(PPMessage*)message withClient:(PPCom*)client {
    
    PPMessageList *cachedMessageList = [self getCachedMessagesList:message.conversationId autoCreate:YES];
    
    //更新Conversation列表
    if ([cachedMessageList addPPMessage:message]) {
        
        //更新消息列表
        PPConversationsList *conversationItems = [self getCachedConversationList:YES];
        [conversationItems updateConversationList:message];
        
        return YES;
    }
    
    return NO;
}

- (void)updateMessageIdSet:(PPMessage*)message withApiMessageId:(NSString *)messageId {
    
    if ( message != nil && messageId != nil ) {
        
        // conversation id
        NSString *conversationId = message.conversationId;
        if (!conversationId) {
            return;
        }

        // get messageList associated with `conversationId`
        PPMessageList *messageList = [self getCachedMessagesList:conversationId autoCreate:YES];
        [messageList updateMessageIdSetWith:messageId];
        
    }
    
}

#pragma mark - Clear

-(void)clearAll {
    [self removeAllObjects];
    [[self getCachedConversationList] removeAll];
}

-(void)clearMessagesList:(NSString*)conversationId {
    if (conversationId != nil) {
        [self removeObjectForKey:conversationId];
        PPConversationsList *conversationList = [self getCachedConversationList];
        [conversationList removeConversation:conversationId];
    }
}

@end
