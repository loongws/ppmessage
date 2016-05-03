//
//  ImageDownloader.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/18/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <UIKit/UIKit.h>

@interface ImageDownloader : NSObject

@property (nonatomic, copy) void (^completionHandler)(void);

- (void)startDownload:(NSString*)imageUrl completionHandler:(void(^)(UIImage* image))handler;
- (void)startDownload:(NSString*)imageUrl targetSize:(CGSize)size completionHandler:(void(^)(UIImage* image))handler;

- (void)cancelDownload;

@end
