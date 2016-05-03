//
//  PPGetAppOrgGroupListHttpModel.m
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPGetAppOrgGroupListHttpModel.h"

#import "PPCom.h"
#import "PPComAPI.h"
#import "PPAppInfo.h"

#import "PPConversationItem.h"

@interface PPGetAppOrgGroupListHttpModel ()

@property (nonatomic) PPCom *client;

@end

@implementation PPGetAppOrgGroupListHttpModel

+ (instancetype)modelWithClient:(PPCom *)client {
    return [[self alloc] initWithClient:client];
}

- (instancetype)initWithClient:(PPCom *)client {
    if (self = [super init]) {
        self.client = client;
    }
    return self;
}

//{
//    "app_uuid" = "7c144f63-f728-11e5-9b10-acbc327f19e9";
//    "conversation_uuid" = "<null>";
//    createtime = "2016-04-12 19:11:38 781310";
//    "group_desc" = 123;
//    "group_icon" = "http://192.168.0.206:8080/identicon/6737e3e5068c84afa96c9e5664078c6537f396ec.png";
//    "group_name" = "\U5206\U7ec41";
//    "group_route_algorithm" = broadcast;
//    "group_visible_for_ppcom" = True;
//    "group_visible_order_for_ppcom" = 1;
//    "group_work_time_str" = "09:00-18:00";
//    updatetime = "2016-04-12 19:11:49 673076";
//    "user_count" = 2;
//    uuid = "53d20747-009f-11e6-87fb-acbc327f19e9";
//}
- (void)getAppOrgGroupListWithBlock:(PPHttpModelCompletedBlock)block {
    
    NSString *appUUID = self.client.appInfo.appId;
    NSDictionary *params = @{ @"app_uuid": appUUID };
    
    [self.client.api getAppOrgGroupList:params completionHandler:^(NSDictionary *response, NSError *error) {
        
        NSMutableArray *appGroups = nil;
        
        if (!error && response && [response[@"error_code"] integerValue] == 0) {
            
            NSArray *array = response[@"list"];
            appGroups = [NSMutableArray arrayWithCapacity:array.count];
            [array enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL * _Nonnull stop) {
                PPConversationItem *appGroup = [PPConversationItem itemWithClient:self.client group:obj];
                [appGroups addObject:appGroup];
            }];
            
        }
        
        if (block) {
            block(appGroups, response, error);
        }
        
    }];
    
}

@end
