//
//  ConversationCellItem.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/17/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "PPCom.h"

@interface ConversationCellItem : UITableViewCell

@property (weak, nonatomic) IBOutlet UIImageView *userAvatarView;
@property (weak, nonatomic) IBOutlet UILabel *userNameView;
@property (weak, nonatomic) IBOutlet UILabel *messageSummaryView;
@property (weak, nonatomic) IBOutlet UILabel *messageTimestampView;


@end
