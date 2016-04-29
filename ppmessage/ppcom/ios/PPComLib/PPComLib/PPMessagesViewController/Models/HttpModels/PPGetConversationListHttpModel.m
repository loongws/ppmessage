//
//  PPGetConversationListHttpModel.m
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPGetConversationListHttpModel.h"

#import "PPCom.h"
#import "PPComAPI.h"
#import "PPAppInfo.h"
#import "PPUser.h"
#import "PPConversationItem.h"

#import "PPFastLog.h"

@interface PPGetConversationListHttpModel ()

@property (nonatomic) PPCom *client;

@end

@implementation PPGetConversationListHttpModel

- (instancetype)initWithClient:(PPCom *)client {
    if (self = [super init]) {
        self.client = client;
    }
    return self;
}

+ (instancetype)modelWithClient:(PPCom *)client {
    return [[self alloc] initWithClient:client];
}

- (void)getConversationListWithBlock:(PPHttpModelCompletedBlock)block {
    
    NSString *appUUID = self.client.appInfo.appId;
    NSString *userUUID = self.client.user.uuid;
    NSDictionary *params = @{ @"user_uuid": userUUID, @"app_uuid": appUUID };
    
    [self.client.api getConversationList:params completionHandler:^(NSDictionary *response, NSError *error) {
        
        NSMutableArray *conversations = nil;
        
        if (!error && response && ([response[@"error_code"] integerValue] == 0)) {
            NSMutableArray *array = response[@"list"];
            conversations = [NSMutableArray arrayWithCapacity:array.count];
            [array enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                PPConversationItem *conversationItem = [PPConversationItem itemWithClient:self.client content:obj];
                [conversations addObject:conversationItem];
            }];
        }
        
        if (block) block(conversations, response, error);
        
    }];
    
}

@end
