//
//  PPImageDownloaderManager.m
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPImageDownloaderManager.h"
#import "ImageDownloader.h"
#import "PPFastLog.h"

#define PPIMAGE_DOWNLOADER_ENABLE_LOG 1

@interface PPImageDownloaderManager ()

@property (nonatomic) NSCache *imageCache;

@end

@implementation PPImageDownloaderManager

+ (instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    static PPImageDownloaderManager *manager;
    dispatch_once(&onceToken, ^{
        manager = [PPImageDownloaderManager new];
    });
    return manager;
}

- (instancetype)init {
    if (self = [super init]) {
        self.imageCache = [NSCache new];
    }
    return self;
}

- (void)loadWithUrl:(NSString *)urlString
        toImageView:(UIImageView *)imageView
   placeholderImage:(UIImage *)placeholderImage
  completionHandler:(void (^)(UIImage *, NSError *, NSString *))completionHandler {
    
    if (!urlString) {
        [self setPlaceholderImage:placeholderImage forImageView:imageView];
        if (PPIMAGE_DOWNLOADER_ENABLE_LOG) PPFastLog(@"url == nil");
        if (completionHandler) completionHandler(nil, [self buildImageErrorWithErrorCode:PPImageDownloadErrorCodeUrlEmpty], urlString);
        return;
    }
    
    UIImage *image = [self.imageCache objectForKey:urlString];
    if (image) {
        if (PPIMAGE_DOWNLOADER_ENABLE_LOG) PPFastLog(@"find image from memory cache %@", urlString);
        if (completionHandler) completionHandler(image, nil, urlString);
        return;
    }
    
    [self setPlaceholderImage:placeholderImage forImageView:imageView];
    
    ImageDownloader *imageDownloader = [ImageDownloader new];
    [imageDownloader startDownload:urlString completionHandler:^(UIImage *image) {
        
        if (!image) {
            if (completionHandler) completionHandler(nil, [self buildImageErrorWithErrorCode:PPImageDownloadErrorCodeHttpError], urlString);
        } else {
            if (PPIMAGE_DOWNLOADER_ENABLE_LOG) PPFastLog(@"find image from http %@", urlString);
            [self.imageCache setObject:image forKey:urlString];
            if (completionHandler) completionHandler(image, nil, urlString);
        }
        
    }];
    
}

- (void)setPlaceholderImage:(UIImage*)placehoderImage
               forImageView:(UIImageView*)imageView {
    if (!placehoderImage) return;
    
    imageView.image = placehoderImage;
}

- (NSError*)buildImageErrorWithErrorCode:(PPImageDownloadErrorCode)errorCode {
    NSError *error = [[NSError alloc] initWithDomain:@"PPComDomain" code:errorCode userInfo:@{ @"error_code": [NSNumber numberWithInteger:errorCode] }];
    return error;
}

@end
