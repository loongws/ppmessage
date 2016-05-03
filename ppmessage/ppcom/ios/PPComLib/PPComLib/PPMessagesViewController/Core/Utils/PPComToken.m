//
//  PPComToken.m
//  PPComLib
//
//  Created by PPMessage on 3/31/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPComToken.h"

#import "PPCom.h"
#import "PPFastLog.h"
#import "PPComUtils.h"

#define PPCOMTOKEN_ENABLE_LOG 1

static NSString *const PPComTokenCacheKey = @"com.ppmessage.ppcom.cache.access_token";

@interface PPComToken ()

@property (nonatomic) PPCom *client;

@end

@implementation PPComToken

+ (instancetype)tokenWithClient:(PPCom *)client {
    return [[self alloc] initWithClient:client];
}

- (instancetype)initWithClient:(PPCom *)client {
    if (self = [super initWithClient:client]) {
        self.client = client;
    }
    return self;
}

- (void)getPPComTokenWithBlock:(PPComTokenCompletedBlock)block {
    NSString *localCacheAccessToken = [self getPPComTokenFromCache];
    if (localCacheAccessToken) {
        if (PPCOMTOKEN_ENABLE_LOG) PPFastLog(@"fetch access token from local : %@", localCacheAccessToken);
        if (block) block(localCacheAccessToken, nil, YES);
        return;
    }
    
    NSString *requestUrl = [self tokenRequestUrl];
    NSString *params = [self tokenParam];
    [self baseAsyncPost:requestUrl withParam:params config:^(NSMutableURLRequest *request) {
        
        [request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
        
    } completed:^(NSDictionary *response, NSError *error) {
        
        NSString *accessToken = nil;
        if (!error) {
            accessToken = response[@"access_token"];
            [self storeToCacheWithPPComToken:accessToken];
        }
        if (block) block(accessToken, error, error == nil);
        
    }];
}

/** 从本地手机上取出`access_token` **/
- (NSString*)getPPComTokenFromCache {
    NSUserDefaults *sharedPreferences = [NSUserDefaults standardUserDefaults];
    return [sharedPreferences stringForKey:PPComTokenCacheKey];
}

/** 将`access_token`保存到手机上 **/
- (void)storeToCacheWithPPComToken:(NSString*)accessToken {
    NSUserDefaults *sharedPreferences = [NSUserDefaults standardUserDefaults];
    [sharedPreferences setObject:accessToken forKey:PPComTokenCacheKey];
    [sharedPreferences synchronize];
}

#pragma mark - helpers

- (NSString*)tokenRequestUrl {
    return [NSString stringWithFormat:@"%@/token", PPAuthHost];
}

- (NSString*)tokenParam {
    return [NSString stringWithFormat:@"client_id=%@&client_secret=%@&grant_type=client_credentials", PPApiKey, PPApiSecret];
}

@end
