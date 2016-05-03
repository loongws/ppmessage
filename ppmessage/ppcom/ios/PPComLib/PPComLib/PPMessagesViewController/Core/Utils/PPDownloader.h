//
//  PPDownloader.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/22/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPComNet.h"
#import "PPCom.h"

@interface PPDownloader : PPComNet

#pragma mark - Initialize

- (instancetype)initWithClient:(PPCom *)client;

/**
 * sync download file with file uuid
 */
- (NSData*)syncdownload:(NSString*)fid;

/**
 * async download file with file uuid, and responsed with block
 */
- (void)download:(NSString*)fid withBlock:(void(^)(NSError *error, NSData *response))handler;

#pragma mark - Download Utils

/**
 * @description 根据resourceId得到相应的下载链接
 * @return resourceId对应的Url
 */
- (NSString*) getResourceDownloadUrl:(NSString*)resourceId;

@end
