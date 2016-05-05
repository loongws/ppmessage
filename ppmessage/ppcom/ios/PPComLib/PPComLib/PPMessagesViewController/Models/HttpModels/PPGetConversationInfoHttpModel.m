//
//  PPGetConversationInfoHttpModel.m
//  PPComLib
//
//  Created by PPMessage on 5/5/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPGetConversationInfoHttpModel.h"

#import "PPCom.h"
#import "PPAppInfo.h"
#import "PPUser.h"

#import "PPConversationItem.h"

@interface PPGetConversationInfoHttpModel ()

@property (nonatomic) PPCom *client;

@end

@implementation PPGetConversationInfoHttpModel

- (instancetype)initWithClient:(PPCom *)client {
    if (self = [super init]) {
        self.client = client;
    }
    return self;
}

- (void)getWithConversationUUID:(NSString *)conversationUUID
                 completedBlock:(PPHttpModelCompletedBlock)completedBlock {
    NSDictionary *requestParams = @{ @"app_uuid":self.client.appInfo.appId, @"user_uuid":self.client.user.uuid, @"conversation_uuid": conversationUUID };
    [self.client.api getConversationInfo:requestParams completionHandler:^(NSDictionary *response, NSError *error) {
        
        PPConversationItem *conversation = nil;
        if (response && [response[@"error_code"] integerValue] == 0) {
            conversation = [PPConversationItem itemWithClient:self.client body:response];
        }
        
        if (completedBlock) {
            completedBlock(conversation, response, error);
        }
        
    }];
}

@end
