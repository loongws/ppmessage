//
//  PPWebSocketUnknownHandler.m
//  PPComLib
//
//  Created by PPMessage on 5/5/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPWebSocketUnknownHandler.h"

#import "PPFastLog.h"

@implementation PPWebSocketUnknownHandler

- (void)handle:(NSDictionary *)obj {
    PPFastLog(@"[WS] unknown msg: %@", obj);
}

@end
