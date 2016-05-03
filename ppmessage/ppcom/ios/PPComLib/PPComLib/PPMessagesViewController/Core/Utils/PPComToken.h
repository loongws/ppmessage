//
//  PPComToken.h
//  PPComLib
//
//  Created by PPMessage on 3/31/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPComNet.h"

typedef void (^PPComTokenCompletedBlock)(NSString *accessToken, NSError *error, BOOL success);

@class PPCom;

/**
 *
 * 本地会缓存`access_token`，会首先检查本地是否存在`access_token`，如果存在直接返回；不存在，则尝试从服务器获取
 *
 */
@interface PPComToken : PPComNet

+ (instancetype)tokenWithClient:(PPCom*)client;

/**
 * 获取`PPComToken`
 *
 * 如果出错，那么`success`为`NO`, 否则为`YES`
 *
 */
- (void)getPPComTokenWithBlock:(PPComTokenCompletedBlock)block;

@end
