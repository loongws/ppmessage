//
//  PPJSQAvatarLoader.m
//  PPComDemo
//
//  Created by Kun Zhao on 10/10/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPJSQAvatarLoader.h"
#import <UIKit/UIKit.h>

@interface PPJSQAvatarLoader ()

@property (nonatomic) NSMutableDictionary *imageDownloadDict;
@property (nonatomic) NSMutableDictionary *avatarDict;

@end

@implementation PPJSQAvatarLoader

#pragma mark - Getter Methods

-(NSMutableDictionary*)avatarDict {
    if (!_avatarDict) {
        _avatarDict = [[NSMutableDictionary alloc] init];
    }
    return _avatarDict;
}

-(JSQMessagesAvatarImage*)defaultAvatarImage {
    if (!_defaultAvatarImage) {
        UIImage *image = [UIImage imageNamed:@"PPComLib.bundle/pp_icon_avatar"];
        _defaultAvatarImage = [JSQMessagesAvatarImageFactory avatarImageWithImage:image
                                                                             diameter:kJSQMessagesCollectionViewAvatarSizeDefault];
    }
    return _defaultAvatarImage;
}

#pragma mark - Get JSQAvatarImage

-(JSQMessagesAvatarImage*)getJSQAvatarImage:(NSString*)userUuid withImageUrlString:(NSString*)urlString {
    return [self getJSQAvatarImage:userUuid withImageUrl:urlString ? [NSURL URLWithString:urlString] : nil];
}

-(JSQMessagesAvatarImage*)getJSQAvatarImage:(NSString*)userUuid withImageUrl:(NSURL*)url {
    return self.avatarDict[userUuid];
}

- (void)loadJSQAvatarImage:(NSString *)userUuid
        withImageUrlString:(NSString *)urlString
                 completed:(void (^)(JSQMessagesAvatarImage *))completed {
    JSQMessagesAvatarImage* avatarImage = [self getJSQAvatarImage:userUuid withImageUrlString:urlString];
    if (avatarImage) {
        if (completed) {
            completed(avatarImage);
        }
        return;
    }
    
    NSURL *url = [NSURL URLWithString:urlString];
    if (url) {
        [self startDownload:url.absoluteString completionHandler:^(UIImage *image) {
            if (image != nil) {
                JSQMessagesAvatarImage *avatarImage = [JSQMessagesAvatarImageFactory avatarImageWithImage:image diameter:kJSQMessagesCollectionViewAvatarSizeDefault];
                self.avatarDict[userUuid] = avatarImage;
            } else {
                self.avatarDict[userUuid] = self.defaultAvatarImage;
            }
            if (completed) completed(self.avatarDict[userUuid]);
        }];
    } else {
        self.avatarDict[userUuid] = self.defaultAvatarImage;
        if (completed) completed(self.defaultAvatarImage);
    }
    
}

@end
