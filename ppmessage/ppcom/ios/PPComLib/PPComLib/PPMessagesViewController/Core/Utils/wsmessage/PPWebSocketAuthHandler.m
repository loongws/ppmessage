//
//  PPWebSocketAuthHandler.m
//  PPComLib
//
//  Created by PPMessage on 5/5/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPWebSocketAuthHandler.h"

#import "PPFastLog.h"

@implementation PPWebSocketAuthHandler

- (void)handle:(NSDictionary *)obj {
    PPFastLog(@"[WS] auth message: %@", obj);
}

@end
