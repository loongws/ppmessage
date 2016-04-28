//
//  PPUser.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/25/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPCom.h"

@interface PPUser : NSObject

+(instancetype)userWithClient:(PPCom*)client body:(NSDictionary*)userBody;
+(instancetype)userWithClient:(PPCom*)client messageUserBody:(NSDictionary*)messageUserBody;

-(instancetype)initWithClient:(PPCom*)client uuid:(NSString*)uuid fullName:(NSString*)name avatarId:(NSString*)avatarUuid;
-(instancetype)initWithClient:(PPCom*)client uuid:(NSString*)uuid fullName:(NSString*)name avatarId:(NSString*)avatarUuid deviceUuid:(NSString*)deviceUuid;

@property NSString* avatar;
@property NSString* avatarUrl;
@property NSString* fullName;
@property NSString* uuid;
@property NSString* deviceUuid;

@end
