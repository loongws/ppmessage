//
//  PPWebSocketConversationHandler.m
//  PPComLib
//
//  Created by PPMessage on 5/5/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPWebSocketConversationHandler.h"

#import "PPUser.h"
#import "PPComAPI.h"
#import "PPAppInfo.h"
#import "PPMessageReceiver.h"

#import "PPConversationItem.h"
#import "PPGetConversationInfoHttpModel.h"

@implementation PPWebSocketConversationHandler

- (void)handle:(NSDictionary *)obj {
    if ([obj[@"code"] integerValue] == 0) { // 0 means 'ERR_CODE.NOERR' in backend
        [self asyncFindConversationInfoWithConversationUUID:[self findConversationUUID:obj] completed:^(PPConversationItem *conversation) {
            if (conversation) {
                [self.client.messageReceiver.delegate didReceiveObj:conversation objType:PPWebSocketMsgTypeConversation];
            }
        }];
    }
}

- (NSString*)findConversationUUID:(NSDictionary *)obj {
    if (!obj[@"extra"]) return nil;
    return obj[@"extra"][@"conversation_uuid"];
}

- (void)asyncFindConversationInfoWithConversationUUID:(NSString*)conversationUUID completed:(void (^)(PPConversationItem *conversation))completed {
    if (!conversationUUID) return;
    
    PPGetConversationInfoHttpModel *getConversationInfoHttpTask = [[PPGetConversationInfoHttpModel alloc] initWithClient:self.client];
    [getConversationInfoHttpTask getWithConversationUUID:conversationUUID completedBlock:^(id obj, NSDictionary *response, NSError *error) {
        if (completed) completed(obj);
    }];
}

@end
