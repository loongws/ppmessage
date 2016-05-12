//
//  PPWebSocketHandlerFactory.h
//  PPComLib
//
//  Created by PPMessage on 5/5/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPWebSocketHandler.h"

typedef NS_ENUM(NSInteger, PPWebSocketMsgType) {
    PPWebSocketMsgTypeUnknown,
    PPWebSocketMsgTypeSys,
    PPWebSocketMsgTypeAuth,
    PPWebSocketMsgTypeMsg,
    PPWebSocketMsgTypeConversation
};

@interface PPWebSocketHandlerFactory : NSObject

+ (instancetype)sharedInstance;

- (void)handle:(id)obj;

@end
