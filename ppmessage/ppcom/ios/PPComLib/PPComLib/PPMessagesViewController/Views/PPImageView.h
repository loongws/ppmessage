//
//  PPImageView.h
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface PPImageView : UIImageView

- (void)loadWithUrl:(NSString *)imageUrl
   placeHolderImage:(UIImage *)placeHolderImage
  completionHandler:(void (^)(UIImage *image))completionHandler;

@end
