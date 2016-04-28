//
//  FeedbackMessagesViewController.h
//  PPComDemo
//
//  Created by Kun Zhao on 10/10/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <PPComLib/PPComLib.h>

@class FeedbackMessagesViewController;

@protocol FeedbackMessagesViewControllerDelegate <NSObject>

- (void)didDismissFeedbackViewController:(FeedbackMessagesViewController *)vc;

@end

@interface FeedbackMessagesViewController : PPMessagesViewController

@property (nonatomic, weak) id<FeedbackMessagesViewControllerDelegate> delegateModal;

@end
