//
//  PPConversationsViewControllerTableViewController.h
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface PPConversationsViewController : UITableViewController

/** 第三方开发者需要提供 appUUID **/
@property (nonatomic) NSString *appUUID;

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
 * Release resources when press `close` button at the left-side
 */
- (void)releaseResources;

@end
