//
//  PPAppInfo.h
//  PPComLib
//
//  Created by Kun Zhao on 12/23/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PPAppInfo : NSObject

+(instancetype)app:(NSDictionary*)appInfo;

@property (nonatomic) NSString* appName;
@property (nonatomic) NSString* appId;

@end
