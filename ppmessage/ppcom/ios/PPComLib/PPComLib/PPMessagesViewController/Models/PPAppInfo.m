//
//  PPAppInfo.m
//  PPComLib
//
//  Created by Kun Zhao on 12/23/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPAppInfo.h"

NSString *const PPAppInfoGroupPolicyALL = @"ALL";
NSString *const PPAppInfoGroupPolicySMART = @"SMART";
NSString *const PPAppInfoGroupPolicyGROUP = @"GROUP";

@interface PPAppInfo ()

-(instancetype)init:(NSDictionary*)appInfo;

@end

@implementation PPAppInfo

+ (instancetype)app:(NSDictionary*)appInfo {
    return [[self alloc] init:appInfo];
}

- (instancetype)init:(NSDictionary*)appInfo {
    self = [super init];
    if (self) {
        _appId = appInfo[@"app_uuid"];
        if (!_appId) _appId = appInfo[@"uuid"];
        _appName = appInfo[@"app_name"];
        _groupPolicy = appInfo[@"app_route_policy"];
        if (!_groupPolicy) _groupPolicy = PPAppInfoGroupPolicyALL;
    }
    return self;
}

//////// Getter //////////
- (NSString *)appId {
    return _appId != nil ? _appId : @""; // never return `nil`
}

- (NSString *)appName {
    return _appName != nil ? _appName : @""; // never return `nil`
}

- (NSString*)description {
    return [NSString stringWithFormat:@"<%p, %@, %@>",
            self,
            self.class,
            @{ @"app_uuid": self.appId,
               @"app_name": self.appName }];
}

@end
