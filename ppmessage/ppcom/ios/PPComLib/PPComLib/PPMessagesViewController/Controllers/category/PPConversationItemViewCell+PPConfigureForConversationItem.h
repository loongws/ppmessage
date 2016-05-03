//
//  PPConversationItemViewCell+PPConfigureForConversationItem.h
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPConversationItemViewCell.h"

@class PPConversationItem;

@interface PPConversationItemViewCell (PPConfigureForConversationItem)

- (void)configureForConversationItem:(PPConversationItem *)conversation;

@end
