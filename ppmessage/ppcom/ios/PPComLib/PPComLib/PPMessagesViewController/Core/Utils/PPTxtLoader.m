//
//  PPComTxtLoader.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/22/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPTxtLoader.h"
#import "PPComUtils.h"

#define _PP_TXT_LOADER_DEBUG_ 0

@interface PPTxtLoader ()

@property PPCom *client;
@property NSCache *cache;

- (NSString*)checkMemory:(NSString*)txtUid;
- (void)cacheTxt:(NSString*)txtUid txtContent:(NSString*)content;

@end

@implementation PPTxtLoader

#pragma mark - Init Methods

- (instancetype)initWithClient:(PPCom *)client {
    if (self = [super initWithClient:client]) {
        self.client = client;
        self.cache = [[NSCache alloc] init];
    }
    return self;
}

+ (instancetype)txtLoaderWithClient:(PPCom*)client {
    return [[self alloc] initWithClient:client];
}

#pragma mark - Load txt methods

- (NSString*)syncloadTxt:(NSString *)txtUrl {
    NSData *data = [self syncdownload:txtUrl];
    if (data) {
        return [self.client.utils dataToString:data];
    }
    return nil;
}

- (void)loadTxt:(NSString *)txtUrl withBlock:(void (^)(NSError *, NSString *))handler {
    if (_PP_TXT_LOADER_DEBUG_) {
        NSLog(@"Load txt: %@.", txtUrl);
    }
    
    NSString* content = [self checkMemory:txtUrl];
    if (content) {
        if (_PP_TXT_LOADER_DEBUG_)  {
            NSLog(@"Load txt from memory:%@", txtUrl);
        }
        if (handler) {
            handler(nil, content);
        }
        return;
    }
    
    [self download:txtUrl withBlock:^(NSError *error, NSData *response) {
        if (handler) {
            NSString *content = error == nil ? [self.client.utils dataToString:response] : nil;
            if (_PP_TXT_LOADER_DEBUG_) {
                NSLog(@"Load txt: %@ finish", txtUrl);
            }
            if (content) {
                [self cacheTxt:txtUrl txtContent:content];
            }
            handler(error, content);
        }
    }];
}

#pragma mark - Cache txt methods

- (NSString*)checkMemory:(NSString*)txtUid {
    if (txtUid) {
        return [self.cache objectForKey:txtUid];
    }
    return nil;
}

- (void)cacheTxt:(NSString*)txtUid txtContent:(NSString*)content {
    if (txtUid && content) {
        [self.cache setObject:content forKey:txtUid];
    }
}

@end
