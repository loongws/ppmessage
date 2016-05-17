//
//  PPWebSocketSysHandler.m
//  PPComLib
//
//  Created by PPMessage on 5/5/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPWebSocketSysHandler.h"

#import "PPUser.h"
#import "PPMessageReceiver.h"

@implementation PPWebSocketSysHandler

- (void)handle:(NSDictionary *)obj {
    if ([self isLogoutMessage:obj]) {
        [self.client.messageReceiver close];
    }
}

- (BOOL)isLogoutMessage:(NSDictionary *)obj {
    if (!self.client.user || !self.client.user.deviceUuid) return NO;
    return [obj[@"ms"] isEqualToString:@"LOGOUT"] && [obj[@"bo"] isEqualToString:self.client.user.deviceUuid];
}

@end
