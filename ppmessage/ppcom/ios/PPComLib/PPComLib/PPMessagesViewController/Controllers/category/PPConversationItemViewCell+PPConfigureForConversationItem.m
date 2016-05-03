//
//  PPConversationItemViewCell+PPConfigureForConversationItem.m
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPConversationItemViewCell+PPConfigureForConversationItem.h"

#import "PPBadgeSquareImageView.h"
#import "PPConversationItem.h"

#import "PPComUtils.h"

@implementation PPConversationItemViewCell (PPConfigureForConversationItem)

- (void)configureForConversationItem:(PPConversationItem *)conversation {
    
    self.displayNameLabel.text = conversation.userName;
    self.msgSummaryLabel.text = PPIsNotNull(conversation.messageSummary) ? conversation.messageSummary : @" ";
    self.msgTimestampLabel.text = PPFormatTimestampToHumanReadableStyle(conversation.messageTimestamp, NO);
    
    UIImage *image = PPDefaultAvatarImage();
    [self.avatarView.imageView loadWithUrl:conversation.userAvatarUrl placeHolderImage:image completionHandler:nil];
    
}

@end
