//
//  PPWebSocketMsgHandler.m
//  PPComLib
//
//  Created by PPMessage on 5/5/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPWebSocketMsgHandler.h"

#import "PPMessage.h"
#import "PPMessageReceiver.h"

@implementation PPWebSocketMsgHandler

- (void)handle:(NSDictionary *)obj {
    PPMessage *message = [PPMessage messageWithClient:self.client body:obj];
    if (self.client.messageReceiver.delegate) {
        [self.client.messageReceiver.delegate didReceiveObj:message objType:PPWebSocketMsgTypeMsg];
    }
}

@end
