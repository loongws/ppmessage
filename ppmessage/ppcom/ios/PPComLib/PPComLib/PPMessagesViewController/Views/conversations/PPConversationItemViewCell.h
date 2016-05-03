//
//  PPConversationItemViewCell.h
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <UIKit/UIKit.h>

@class PPBadgeSquareImageView;

extern CGFloat const PPConversationItemViewHeight;
extern NSString *const PPConversationItemViewCellIdentifier;

@interface PPConversationItemViewCell : UITableViewCell

@property (nonatomic) PPBadgeSquareImageView *avatarView;
@property (nonatomic) UILabel *displayNameLabel;
@property (nonatomic) UILabel *msgSummaryLabel;
@property (nonatomic) UILabel *msgTimestampLabel;

@end
