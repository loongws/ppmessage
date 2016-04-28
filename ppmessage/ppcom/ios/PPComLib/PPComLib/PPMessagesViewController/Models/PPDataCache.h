//
//  PPDataCache.h
//  PPComDemo
//
//  Created by Kun Zhao on 10/8/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPMessageList.h"
#import "PPConversationsList.h"

@interface PPDataCache : NSCache

-(PPConversationsList*)getCachedConversationList;
-(PPConversationsList*)getCachedConversationList:(BOOL)autoCreate;
-(PPMessageList*)getCachedMessagesList:(NSString*)conversationId;
-(PPMessageList*)getCachedMessagesList:(NSString*)conversationId autoCreate:(BOOL)autoCreate;

-(void)cacheConversationList:(PPConversationsList*)conversationList;
-(void)cacheMessagesList:(PPMessageList*)messagesList withConversationId:(NSString*)conversationId;
-(BOOL)updateCache:(PPMessage*)message withClient:(PPCom*)client;

// @param messageId: this `messageId` was fetched from server
- (void)updateMessageIdSet:(PPMessage*)message withApiMessageId:(NSString *)messageId;

-(void)clearAll;
-(void)clearMessagesList:(NSString*)conversationId;

@end
