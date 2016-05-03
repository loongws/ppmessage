//
//  PPImageView.m
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPImageView.h"

#import "PPImageDownloaderManager.h"

@implementation PPImageView

- (void)loadWithUrl:(NSString *)imageUrl
   placeHolderImage:(UIImage *)placeHolderImage
  completionHandler:(void (^)(UIImage *))completionHandler {
    
    [[PPImageDownloaderManager sharedInstance] loadWithUrl:imageUrl toImageView:self placeholderImage:placeHolderImage completionHandler:^(UIImage *image, NSError *error, NSString *urlString) {
        
        if (!error) {
            self.image = image;
        }
        
        if (completionHandler) completionHandler(image);
        
    }];
    
}

@end
