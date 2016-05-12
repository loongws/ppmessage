//
//  PPWebSocketHandlerFactory.m
//  PPComLib
//
//  Created by PPMessage on 5/5/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPWebSocketHandlerFactory.h"

#import "PPComUtils.h"
#import "PPFastLog.h"

#import "PPWebSocketBaseHandler.h"
#import "PPWebSocketSysHandler.h"
#import "PPWebSocketUnknownHandler.h"
#import "PPWebSocketAuthHandler.h"
#import "PPWebSocketMsgHandler.h"
#import "PPWebSocketConversationHandler.h"

@implementation PPWebSocketHandlerFactory

+ (instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    static PPWebSocketHandlerFactory *webSocketHandlerFactory;
    dispatch_once(&onceToken, ^{
        webSocketHandlerFactory = [PPWebSocketHandlerFactory new];
    });
    return webSocketHandlerFactory;
}

- (void)handle:(id)obj {
    if (!obj) return;
    
    PPFastLog(@"[WS] message arrived: %@", obj);
    
    PPCom *client = [PPCom instance];
    NSDictionary *jsonObj = [client.utils jsonStringToDictionary:obj];
    PPWebSocketMsgType msgType = [self findTypeWithJsonObj:jsonObj];
    id<PPWebSocketHandler> webSocketHandler = nil;
    
    switch (msgType) {
        case PPWebSocketMsgTypeSys:
            webSocketHandler = [[PPWebSocketSysHandler alloc] initWithClient:client];
            break;
            
        case PPWebSocketMsgTypeAuth:
            webSocketHandler = [[PPWebSocketAuthHandler alloc] initWithClient:client];
            break;
            
        case PPWebSocketMsgTypeMsg:
            webSocketHandler = [[PPWebSocketMsgHandler alloc] initWithClient:client];
            break;
            
        case PPWebSocketMsgTypeConversation:
            webSocketHandler = [[PPWebSocketConversationHandler alloc] initWithClient:client];
            break;
            
        case PPWebSocketMsgTypeUnknown:
        default:
            webSocketHandler = [[PPWebSocketUnknownHandler alloc] initWithClient:client];
            break;
    }
    
    [webSocketHandler handle:(jsonObj[@"msg"] ? jsonObj[@"msg"] : jsonObj)];
    
}

- (PPWebSocketMsgType)findTypeWithJsonObj:(NSDictionary*)jsonObj {
    NSString *msgType = jsonObj[@"type"];
    if ([msgType isEqualToString:@"MSG"]) {
        
        if (jsonObj[@"msg"]) {
            if ([jsonObj[@"msg"][@"mt"] isEqualToString:@"SYS"]) {
                return PPWebSocketMsgTypeSys;
            } else {
                return PPWebSocketMsgTypeMsg;
            }
        }
        
    } else if ([msgType isEqualToString:@"ACK"]) {
        
        NSString *what = jsonObj[@"what"];
        
        if ([what isEqualToString:@"AUTH"]) {
            return PPWebSocketMsgTypeAuth;
        } else if ([what isEqualToString:@"SEND"]) {
            return PPWebSocketMsgTypeMsg;
        } else if ([what isEqualToString:@"CONVERSATION"]) {
            return PPWebSocketMsgTypeConversation;
        }
        
    }
    return PPWebSocketMsgTypeUnknown;
}

@end
