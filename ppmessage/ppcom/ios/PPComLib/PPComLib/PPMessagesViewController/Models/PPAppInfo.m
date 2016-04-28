//
//  PPAppInfo.m
//  PPComLib
//
//  Created by Kun Zhao on 12/23/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPAppInfo.h"

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
        _appName = appInfo[@"app_name"];
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

@end
