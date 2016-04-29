//
//  PPGetDefaultConversationHttpModels.m
//  PPComLib
//
//  Created by PPMessage on 3/31/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPGetDefaultConversationHttpModels.h"

#import "PPComAPI.h"
#import "PPCom.h"
#import "PPConversationItem.h"
#import "PPAppInfo.h"
#import "PPUser.h"

@interface PPGetDefaultConversationHttpModels ()

@property (nonatomic) PPCom *client;

@end

@implementation PPGetDefaultConversationHttpModels

+ (instancetype)modelWithClient:(PPCom *)client {
    PPGetDefaultConversationHttpModels *models = [self new];
    models.client = client;
    return models;
}

- (void)requestWithBlock:(PPHttpModelCompletedBlock)completed {
    
    NSDictionary *params = @{ @"app_uuid": self.client.appInfo.appId,
                              @"user_uuid": self.client.user.uuid };
    
    [self.client.api getDefaultConversation:params completionHandler:^(NSDictionary *response, NSError *error) {
        
        PPConversationItem *defaultConversation = nil;
        
        if (!error && response && [response[@"error_code"] integerValue] == 0) {
            defaultConversation = [PPConversationItem itemWithClient:self.client body:response];
        }
        
        if (completed) completed(defaultConversation, response, error);
        
    }];
    
}

@end
