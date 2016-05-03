//
//  PPImageDownloaderManager.h
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, PPImageDownloadErrorCode) {
    PPImageDownloadErrorCodeUrlEmpty,
    PPImageDownloadErrorCodeHttpError
};

@interface PPImageDownloaderManager : NSObject

+ (instancetype)sharedInstance;

- (void)loadWithUrl:(NSString*)urlString
        toImageView:(UIImageView*)imageView
   placeholderImage:(UIImage*)placeholderImage
  completionHandler:(void (^)(UIImage *image, NSError *error, NSString *urlString))completionHandler;

@end
