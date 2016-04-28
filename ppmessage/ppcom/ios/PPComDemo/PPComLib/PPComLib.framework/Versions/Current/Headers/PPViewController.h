//
//  PPComDemoConversationsViewController.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/16/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface PPViewController : UIViewController<UITableViewDataSource, UITableViewDelegate, UIScrollViewDelegate>

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
-(void)initialize;

/**
 * Initialize with the specified user email
 */
-(void)initializeWithUserEmail:(NSString*)email;

/**
 * Release resources
 */
-(void)releaseResources;

/**
 * Clear cache
 */
-(void)clearCache;

/**
 * If you custom PPMessagesViewController, please override this method to given your custom view controller class
 */
- (Class)getPPMessageListViewControllerClass;

@end
