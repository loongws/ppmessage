//
//  PPJSQAvatarLoader.h
//  PPComDemo
//
//  Created by Kun Zhao on 10/10/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPCachebleImageDownloader.h"
#import "JSQMessages.h"

@interface PPJSQAvatarLoader : PPCachebleImageDownloader

@property (nonatomic) JSQMessagesAvatarImage *defaultAvatarImage;

-(JSQMessagesAvatarImage*)getJSQAvatarImage:(NSString*)userUuid withImageUrlString:(NSString*)urlString;
-(JSQMessagesAvatarImage*)getJSQAvatarImage:(NSString*)userUuid withImageUrl:(NSURL*)url;
- (void)loadJSQAvatarImage:(NSString*)userUuid
        withImageUrlString:(NSString*)urlString
                 completed:(void (^)(JSQMessagesAvatarImage* jsqImage))completed;

@end
