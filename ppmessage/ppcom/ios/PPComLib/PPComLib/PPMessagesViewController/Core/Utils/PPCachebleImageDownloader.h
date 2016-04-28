//
//  PPCachebleImageDownloader.h
//  PPComDemo
//
//  Created by Kun Zhao on 10/10/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "ImageDownloader.h"

@interface PPCachebleImageDownloader : NSObject

- (void)startDownload:(NSString*)imageUrl completionHandler:(void(^)(UIImage* image))handler;
- (void)startDownload:(NSString*)imageUrl targetSize:(CGSize)size completionHandler:(void(^)(UIImage* image))handler;
- (void)cancelDownload:(NSString*)imageUrl;

@end
