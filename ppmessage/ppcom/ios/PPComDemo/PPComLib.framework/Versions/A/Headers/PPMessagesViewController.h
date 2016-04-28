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

/**
 * Your appKey
 */
@property NSString *appKey;

/**
 * Your appSecret
 */
@property NSString *appSecret;

#pragma mark - Initialize Methods

/**
 * Initialize with anonymous user
 */
- (void)initialize;

/**
 * Initialize with the specified user email
 */
- (void)initializeWithUserEmail:(NSString*)email;

/**
 * set `InputView` placeholder text
 */
- (void)setInputViewPlaceHolder:(NSString *)hintText;

/** controller delegate **/
@property (nonatomic, weak) id<PPMessagesViewControllerDelegate> delegate;

@end
