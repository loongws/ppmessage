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

-(JSQMessagesAvatarImage*)getJSQAvatarImage:(NSString*)userUuid withImageUrlString:(NSString*)urlString;
-(JSQMessagesAvatarImage*)getJSQAvatarImage:(NSString*)userUuid withImageUrl:(NSURL*)url;

@end
