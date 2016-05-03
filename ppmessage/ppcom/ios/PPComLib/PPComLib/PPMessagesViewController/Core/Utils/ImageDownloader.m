//
//  ImageDownloader.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/18/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "ImageDownloader.h"

#pragma extension

@interface ImageDownloader ()

@property (nonatomic, strong) NSURLSessionDataTask *sessionTask;

@end

#pragma mark -

@implementation ImageDownloader

- (void)startDownload:(NSString*)imageUrl completionHandler:(void(^)(UIImage* image))handler {
    [self startDownload:imageUrl targetSize:CGSizeZero completionHandler:handler];
}

- (void)startDownload:(NSString*)imageUrl targetSize:(CGSize)size completionHandler:(void(^)(UIImage* image))handler {
    
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:imageUrl]];
    
    NSLog(@"ImageDownloader, imageURL:%@", imageUrl);
    
    //only available iOS (7.0 and later) TODO
    _sessionTask = [[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error != nil) {
            NSLog(@"ImageDownloader:%@", error.description);
            return;
        }
        
        [[NSOperationQueue mainQueue] addOperationWithBlock:^{
            
            // Set image and clear temporary data/image
            UIImage *image = [[UIImage alloc] initWithData:data];
            UIImage *finalImage = nil;
            
            if (!(CGSizeEqualToSize(CGSizeZero, size)) && (image.size.width != size.width || image.size.height != size.height)) {
                UIGraphicsBeginImageContextWithOptions(size, NO, 0.0f);
                CGRect imageRect = CGRectMake(0.0, 0.0, size.width, size.height);
                [image drawInRect:imageRect];
                finalImage = UIGraphicsGetImageFromCurrentImageContext();
                UIGraphicsEndImageContext();
            } else {
                finalImage = image;
            }
            
            // call our completion handler to tell our client that our image is ready for display
            if (handler) {
                handler(finalImage);
            }
            
        }];
        
    }];
    
    [self.sessionTask resume];
}

- (void)cancelDownload {
    [self.sessionTask cancel];
    _sessionTask = nil;
}

@end
