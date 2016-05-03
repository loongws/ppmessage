//
//  PPMessagesViewController.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/24/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPMessagesViewController.h"

#import "JSQMessagesViewController.h"

@protocol PPMessagesViewControllerDelegate <NSObject>

@optional
-(void)onFileMessageTapped:(NSURL*)fileUrl;
-(void)onImageMessageTapped:(NSURL*)imageUrl image:(UIImage*)displayedImage;

@end

@interface PPMessagesViewController : JSQMessagesViewController

/** controller delegate **/
@property (nonatomic, weak) id<PPMessagesViewControllerDelegate> delegate;

/** Conversation id **/
@property NSString *conversationId;

@end
