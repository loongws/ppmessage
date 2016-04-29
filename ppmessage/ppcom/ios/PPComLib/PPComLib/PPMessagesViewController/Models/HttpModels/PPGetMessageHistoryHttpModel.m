//
//  PPGetMessageHistoryHttpModel.m
//  PPComLib
//
//  Created by PPMessage on 4/11/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPGetMessageHistoryHttpModel.h"

#import "PPComAPI.h"
#import "PPCom.h"
#import "PPMessageList.h"

static NSInteger const DEFAULT_MESSAGE_PAGESIZE = 20;

@interface PPGetMessageHistoryHttpModel ()

@property (nonatomic) PPCom *client;

@end

@implementation PPGetMessageHistoryHttpModel

+ (instancetype)modelWithClient:(PPCom *)client {
    return [[self alloc] initWithClient:client];
}

- (instancetype)initWithClient:(PPCom *)client {
    if (self = [super init]) {
        self.client = client;
    }
    return self;
}

- (void)requestWithConversationUUID:(NSString *)conversationUUID
                         pageOffset:(NSInteger)pageOffset
                          completed:(PPHttpModelCompletedBlock)completedBlock {
    [self requestWithConversationUUID:conversationUUID pageOffset:pageOffset pageSize:DEFAULT_MESSAGE_PAGESIZE completed:completedBlock];
}

- (void)requestWithConversationUUID:(NSString *)conversationUUID
                         pageOffset:(NSInteger)pageOffset
                           pageSize:(NSInteger)pageSize
                          completed:(PPHttpModelCompletedBlock)completedBlock {
    
    PPComAPI *api = self.client.api;
    NSDictionary *params = @{
                             @"conversation_uuid":conversationUUID,
                             @"page_offset":[NSNumber numberWithInteger:pageOffset],
                             @"page_size":[NSNumber numberWithInteger:pageSize],
                             };
    [api getMessageHistory:params completionHandler:^(NSDictionary *response, NSError *error) {
        if (!error) {
            
            if ( [response[@"error_code"] integerValue] == 0 ) {
                PPMessageList *list = [PPMessageList listWithClient:self.client messageListBody:response];
                if ( completedBlock ) completedBlock(list, response, error);
            } else {
                if ( completedBlock ) completedBlock(nil, response, error);
            }
            
        } else {
            if ( completedBlock ) completedBlock(nil, response, error);
        }
    }];
    
}

@end
