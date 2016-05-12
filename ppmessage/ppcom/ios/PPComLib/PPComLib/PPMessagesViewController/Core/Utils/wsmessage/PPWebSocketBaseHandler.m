//
//  PPWebSocketBaseHandler.m
//  PPComLib
//
//  Created by PPMessage on 5/5/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPWebSocketBaseHandler.h"

@implementation PPWebSocketBaseHandler

- (instancetype)initWithClient:(PPCom *)client {
    if (self = [super init]) {
        self.client = client;
    }
    return self;
}

@end
