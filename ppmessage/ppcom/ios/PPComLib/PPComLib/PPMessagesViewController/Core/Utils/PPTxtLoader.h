//
//  PPComTxtLoader.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/22/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPCom.h"
#import "PPDownloader.h"

/**
 * Download txt with txtUUID
 */
@interface PPTxtLoader : PPDownloader

/**
 * Static method for init
 */
+(instancetype)txtLoaderWithClient:(PPCom*)client;

// sync load txt
- (NSString*)syncloadTxt:(NSString*)txtUrl;

// async load txt with block
- (void)loadTxt:(NSString*)txtUrl withBlock:(void(^)(NSError *error, NSString *content))handler;

@end
