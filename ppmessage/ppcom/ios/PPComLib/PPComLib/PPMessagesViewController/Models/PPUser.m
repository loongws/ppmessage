//
//  PPUser.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/25/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPUser.h"
#import "PPCom.h"
#import "PPComUtils.h"
#import "PPDownloader.h"

@interface PPUser ()

@property PPCom* client;

@end

@interface PPUser (Avatar)

- (NSString *)getAvatarUrlWith:(NSString*)avatarId;

@end

@implementation PPUser (Avatar)

- (NSString *)getAvatarUrlWith:(NSString*)avatarId {

    if (avatarId != nil) {
        return PPFileUrl(avatarId);
    }

    return avatarId;
}

@end

@implementation PPUser

#pragma mark - Initialize

+(instancetype)userWithClient:(PPCom*)client body:(NSDictionary*)userBody {
    return [[self alloc] initWithClient:client uuid:userBody[@"uuid"] fullName:userBody[@"fullname"] avatarId:userBody[@"icon"]];
}

+(instancetype)userWithClient:(PPCom*)client messageUserBody:(NSDictionary*)messageUserBody {
    return [[self alloc] initWithClient:client uuid:messageUserBody[@"uuid"] fullName:messageUserBody[@"user_name"] avatarId:messageUserBody[@"user_icon"]];
}

-(instancetype)initWithClient:(PPCom*)client uuid:(NSString*)uuid fullName:(NSString*)name avatarId:(NSString*)avatarUuid {
    return [self initWithClient:client uuid:uuid fullName:name avatarId:avatarUuid deviceUuid:nil];
}

-(instancetype)initWithClient:(PPCom*)client uuid:(NSString*)uuid fullName:(NSString*)name avatarId:(NSString*)avatarUuid deviceUuid:(NSString*)deviceUuid {
    self = [super init];
    if (self) {
        _client = client;
        _uuid = uuid;
        _fullName = name;
        _avatar = avatarUuid;
        _deviceUuid = deviceUuid;
        
        if (![client.utils isNull:_avatar]) {
            _avatarUrl = [self getAvatarUrlWith:_avatar];
        }
    }
    return self;
}

-(NSString*)description {
    return [NSString stringWithFormat:@"[PPUser] uuid:%@, fullName:%@, avatar:%@, deviceId:%@", self.uuid, self.fullName, self.avatarUrl, self.deviceUuid];
}

@end
