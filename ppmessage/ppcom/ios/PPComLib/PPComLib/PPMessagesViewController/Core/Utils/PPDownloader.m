//
//  PPDownloader.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/22/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPDownloader.h"

@interface PPDownloader ()

@end

@implementation PPDownloader

#pragma mark - Initialize

- (instancetype)initWithClient:(PPCom *)client {
    if (self = [super initWithClient:client]) {
        
    }
    return self;
}

#pragma mark - Download Methods

- (NSData*)syncdownload:(NSString *)furl {
    return [self request:furl];
}

- (void)download:(NSString *)furl withBlock:(void (^)(NSError *, NSData *))handler {
    [self asyncRequest:furl withBlock:^(NSError *error, NSData *data) {
        if (handler) {
            NSData *finalData = error == nil ? data : nil;
            handler(error, finalData);
        }
    }];
}

#pragma mark - Private Method

- (NSString*) getResourceDownloadUrl:(NSString*)resourceId {
    assert(self.fileDownloadHost != nil);
    NSString *url = [[self.fileDownloadHost stringByAppendingString:@"/"] stringByAppendingString:resourceId];
    return url;
}

@end
