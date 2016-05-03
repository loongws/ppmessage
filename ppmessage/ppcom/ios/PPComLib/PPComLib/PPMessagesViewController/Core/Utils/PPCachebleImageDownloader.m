//
//  PPCachebleImageDownloader.m
//  PPComDemo
//
//  Created by Kun Zhao on 10/10/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPCachebleImageDownloader.h"
#import "NSString+Crypto.h"

@interface PPCachebleImageDownloader ()

@property (nonatomic) NSCache *imageCache;
@property (nonatomic) NSMutableDictionary *downloadImageQueue;

-(BOOL)isDownloading:(NSString*)imageUrl;

-(UIImage*)getCachedImage:(NSString*)imageUrl;
-(void)cacheImage:(NSString*)imageUrl image:(UIImage*)image;
-(void)clearImage:(NSString*)imageUrl;

@end

@implementation PPCachebleImageDownloader

#pragma mark - Getter Methods

-(NSMutableDictionary*)downloadImageQueue {
    if (!_downloadImageQueue) {
        _downloadImageQueue = [[NSMutableDictionary alloc] init];
    }
    return _downloadImageQueue;
}

-(NSCache*)imageCache {
    if (!_imageCache) {
        _imageCache = [[NSCache alloc] init];
    }
    return _imageCache;
}

#pragma mark - Image Download Methods

-(void)startDownload:(NSString *)imageUrl completionHandler:(void (^)(UIImage *))handler {
    [self startDownload:imageUrl targetSize:CGSizeZero completionHandler:handler];
}

-(void)startDownload:(NSString *)imageUrl targetSize:(CGSize)size completionHandler:(void (^)(UIImage *))handler {
    if ([self isDownloading:imageUrl]) {
        return;
    }
    
    UIImage *cachedImage = [self getCachedImage:imageUrl];
    if (cachedImage) {
        if (handler) {
            handler(cachedImage);
        }
        return;
    }
    
    ImageDownloader *downloader = [[ImageDownloader alloc] init];
    self.downloadImageQueue[imageUrl] = downloader;
    
    [downloader startDownload:imageUrl targetSize:size completionHandler:^(UIImage *image) {
        [self.downloadImageQueue removeObjectForKey:imageUrl];
        [self cacheImage:imageUrl image:image];
        if (handler) {
            handler(image);
        }

    }];
}

- (void)cancelDownload:(NSString*)imageUrl {
    if (self.downloadImageQueue[imageUrl]) {
        ImageDownloader *downloader = self.downloadImageQueue[imageUrl];
        [downloader cancelDownload];
        downloader = nil;
        [self.downloadImageQueue removeObjectForKey:imageUrl];
    }
    [self clearImage:imageUrl];
}

#pragma mark - Utils

-(BOOL)isDownloading:(NSString*)imageUrl {
    if (self.downloadImageQueue[imageUrl] != nil) {
        NSLog(@"%@ is in downloading queue...", imageUrl);
        return YES;
    }
    return NO;
}

-(UIImage*)getCachedImage:(NSString*)imageUrl {
    NSString *md5Key = [imageUrl MD5String];
    return (UIImage*)[self.imageCache objectForKey:md5Key];
}

-(void)cacheImage:(NSString *)imageUrl image:(UIImage *)image {
    if (image) {
        NSString *md5Key = [imageUrl MD5String];
        [self.imageCache setObject:image forKey:md5Key];
    }
}

-(void)clearImage:(NSString*)imageUrl {
    NSString *md5Key = [imageUrl MD5String];
    [self.imageCache removeObjectForKey:md5Key];
}

@end
