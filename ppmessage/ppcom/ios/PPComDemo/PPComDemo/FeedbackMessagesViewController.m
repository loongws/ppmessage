//
//  FeedbackMessagesViewController.m
//  PPComDemo
//
//  Created by Kun Zhao on 10/10/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "FeedbackMessagesViewController.h"

#define APP_KEY @"7a7e3542-91b2-11e5-8db8-58b035f16bf4"
#define APP_SECRET @"85c8f661-91b2-11e5-91b4-58b035f16bf4"
#define USER_EMAIL @"somebody.web@yvertical.com.aa"

@interface FeedbackMessagesViewController ()

- (void)onClosePressed:(UIBarButtonItem *)sender;

@end

@implementation FeedbackMessagesViewController

- (void)viewDidLoad {
    [super viewDidLoad];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];

    if (self.delegateModal) {
        self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemStop
                                                                                              target:self
                                                                                              action:@selector(onClosePressed:)];
    }

    // change input view placeholder text
    [self setInputViewPlaceHolder:@"请输入..."];

    // set title
    self.title = @"咨询客服";

    // set your appKey
    self.appKey = APP_KEY;
    
    // set your appSecret
    self.appSecret = APP_SECRET;
    
    // initialize with anonymous user or call `[self initializeWithUserEmail:USER_EMAIL]` to initialize with user_email.
    [self initialize];
}

- (void)onFileMessageTapped:(NSURL *)fileUrl {
    NSLog(@"FeedbackMessagesViewController-onFileMessageTapped-fileUrl:%@", fileUrl);
}

//Note: displayedImage may be empty
- (void)onImageMessageTapped:(NSURL *)imageUrl image:(UIImage *)displayedImage {
    NSLog(@"FeedbackMessagesViewController-onImageMessageTapped-imageUrl:%@", imageUrl);
}

- (void)onClosePressed:(UIBarButtonItem *)sender {
    [self.delegateModal didDismissFeedbackViewController:self];
}

@end
