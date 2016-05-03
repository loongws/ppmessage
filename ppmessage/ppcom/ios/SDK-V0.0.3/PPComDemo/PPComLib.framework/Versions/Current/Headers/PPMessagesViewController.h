//
//  PPMessagesViewController.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/24/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPMessagesViewController.h"

#import "JSQMessagesViewController.h"

//------------------------------
//category
//------------------------------

/**
   @abstract Returns the PPCom version as a string.
*/
extern NSString *const PPVersionString;

@protocol PPMessagesViewControllerDelegate <NSObject>

@optional
-(void)onFileMessageTapped:(NSURL*)fileUrl;
-(void)onImageMessageTapped:(NSURL*)imageUrl image:(UIImage*)displayedImage;

@end

@interface PPMessagesViewController : JSQMessagesViewController

/** 打开这个页面必须传递这个conversationUUID参数 **/
@property (nonatomic) NSString *conversationUUID;

/** conversationName, 这个会被用作标题 **/
@property (nonatomic) NSString *conversationName;

#pragma mark - Initialize Methods

/**
 * set `InputView` placeholder text
 */
- (void)setInputViewPlaceHolder:(NSString *)hintText;

/** controller delegate **/
@property (nonatomic, weak) id<PPMessagesViewControllerDelegate> delegate;

@end
