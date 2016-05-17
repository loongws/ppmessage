//
//  PPGetWaitingQueueLengthHttpModel.m
//  PPComLib
//
//  Created by PPMessage on 5/4/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPGetWaitingQueueLengthHttpModel.h"

#import "PPComAPI.h"
#import "PPCom.h"
#import "PPAppInfo.h"

@interface PPGetWaitingQueueLengthHttpModel ()

@property (nonatomic) PPCom *client;

@end

@implementation PPGetWaitingQueueLengthHttpModel

+ (instancetype)modelWithClient:(PPCom *)client {
    return [[PPGetWaitingQueueLengthHttpModel alloc] initWithClient:client];
}

- (instancetype)initWithClient:(PPCom*)client {
    if (self = [super init]) {
        self.client = client;
    }
    return self;
}

- (void)getWaitingQueueLengthWithCompletedBlock:(PPHttpModelCompletedBlock)completedBlock {
    if (!self.client.appInfo || !self.client.appInfo.appId) return;
    
    NSDictionary *requestParams = @{ @"app_uuid": self.client.appInfo.appId };
    [self.client.api getWaitingQueueLength:requestParams completionHandler:^(NSDictionary *response, NSError *error) {
        NSInteger *waitingQueueLength = 0;
        if (response && [response[@"error_code"] integerValue] == 0) {
            waitingQueueLength = [response[@"length"] integerValue];
        }
        if (completedBlock) {
            completedBlock([NSNumber numberWithInteger:waitingQueueLength], response, error);
        }
    }];
}

@end
