//
//  PPAppInfo.h
//  PPComLib
//
//  Created by Kun Zhao on 12/23/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>

FOUNDATION_EXPORT NSString *const PPAppInfoGroupPolicyALL;
FOUNDATION_EXPORT NSString *const PPAppInfoGroupPolicySMART;
FOUNDATION_EXPORT NSString *const PPAppInfoGroupPolicyGROUP;

@interface PPAppInfo : NSObject

+(instancetype)app:(NSDictionary*)appInfo;

@property (nonatomic) NSString* appName;
@property (nonatomic) NSString* appId;
@property (nonatomic) NSString* groupPolicy;

@end
