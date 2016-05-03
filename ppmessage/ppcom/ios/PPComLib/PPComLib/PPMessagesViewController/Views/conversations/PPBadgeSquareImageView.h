//
//  PPBadgeImageView.h
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "PPCustomBadge.h"
#import "PPImageView.h"

@interface PPBadgeSquareImageView : UIView

@property (nonatomic) PPImageView *imageView;
@property (nonatomic) PPCustomBadge *badgeView;
@property (nonatomic) NSString *badgeText;

@end
