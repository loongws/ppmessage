//
//  JSQTxtMediaItem.m
//  PPComDemo
//
//  Created by Kun Zhao on 10/8/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "JSQTxtMediaItem.h"

#define DEFAULT_TXT_PLACEHOLDER @"..."

@implementation JSQTxtMediaItem

#pragma mark - Initialize Methods

-(instancetype)initWithTxtUrl:(NSURL*)txtUrl {
    return [self initWithTxtUrl:txtUrl placeHolder:DEFAULT_TXT_PLACEHOLDER];
}

-(instancetype)initWithTxtUrl:(NSURL*)txtUrl placeHolder:(NSString*)placeHolder {
    if (self = [super init]) {
        
    }
    return self;
}

@end
