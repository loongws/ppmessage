//
//  PPMessageList.m
//  PPComDemo
//
//  Created by Kun Zhao on 10/8/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPMessageList.h"
#import "JSQMessage.h"
#import "PPMessage.h"
#import "PPComUtils.h"
#import "PPFastLog.h"

@interface PPMessageList ()

@property NSMutableSet *ppMessageIdSet;

// 新添加的消息是否显示timestamp
-(BOOL)showTimestamp:(PPMessage *)message;

@end

@implementation PPMessageList

#pragma mark - Initialize Methods

+(instancetype)listWithClient:(PPCom*)client messageListBody:(NSDictionary*)body {
    return [[self alloc] initWithClient:client messageListBody:body];
}

-(instancetype)initWithClient:(PPCom *)client messageListBody:(NSDictionary *)body {
    if (self = [super init]) {
        
        _jsqMessageArray = [[NSMutableArray alloc] init];
        _ppMessageArray = [[NSMutableArray alloc] init];
        _ppMessageIdSet = [[NSMutableSet alloc] init];
        
        if (client && body) {
            NSArray *array = body[@"list"];
            if (array && [array count] > 0) {
                
                for (NSDictionary* obj in array) {
                    PPMessage *message = [PPMessage messageWithClient:client body:obj];
                    [self addPPMessage:message];
                }
                
                _jsqMessageArray = [[[_jsqMessageArray reverseObjectEnumerator] allObjects] mutableCopy];
                _ppMessageArray = [[[_ppMessageArray reverseObjectEnumerator] allObjects] mutableCopy];
            }
        }
    }
    return self;
}

-(instancetype)initWithClient:(PPCom*)client {
    return [self initWithClient:client messageListBody:nil];
}

-(instancetype)init {
    return [self initWithClient:nil];
}

#pragma mark - Add Methods

-(BOOL)addPPMessage:(PPMessage*)ppMessage {
    if (ppMessage) {
        if (![self exist:ppMessage]) {
            JSQMessage *jsqMessage = [ppMessage getJSQMessage];
            if (jsqMessage) {
                [_ppMessageIdSet addObject:ppMessage.messageId];
                [_ppMessageArray addObject:ppMessage];
                [_jsqMessageArray addObject:jsqMessage];
                return YES;
            }
        }
    }
    return NO;
}

-(void)addPPMessageListToHead:(PPMessageList *)messageList {
    //移除重复的消息
    NSMutableArray *ppMessageArray = messageList.ppMessageArray;
    NSMutableArray *filterMessageArray = [[NSMutableArray alloc] init];
    for (PPMessage *message in ppMessageArray) {
        if (![self exist:message] && message.illegal) {
            [filterMessageArray addObject:message];
        }
    }
    
    //创建JSQMessageList Array
    NSMutableArray *jsqMessageArray = [[NSMutableArray alloc] initWithCapacity:filterMessageArray.count];
    for (PPMessage *message in filterMessageArray) {
        JSQMessage *jsqMessage = [message getJSQMessage];
        [jsqMessageArray addObject:jsqMessage];
        
        //同时更新messageIdArray
        [self.ppMessageIdSet addObject:message.messageId];
    }
    
    //添加至Array首部
    NSIndexSet *indexes = [NSIndexSet indexSetWithIndexesInRange:NSMakeRange(0, filterMessageArray.count)];
    [self.jsqMessageArray insertObjects:jsqMessageArray atIndexes:indexes];
    [self.ppMessageArray insertObjects:filterMessageArray atIndexes:indexes];
}

- (void)updateMessageIdSetWith:(NSString *)messageId {
    if (messageId) {
        [self.ppMessageIdSet addObject:messageId];        
    }
}

-(BOOL)showTimestamp:(PPMessage *)message {

//    PPMessage *oldMessage = nil;
//    if ( self.ppMessageArray.count > 0 ) {
//        oldMessage = [ self.ppMessageArray objectAtIndex:(self.ppMessageArray.count - 1) ];
//    }
//    
//    if ( oldMessage != nil ) {
//        
//        if ( message.timestamp - oldMessage.timestamp >= (int)TIMESTAMP_DELAY ) {
//            return YES;
//        }
//            
//    } else {
//        // current message is the first one message that user send or received
//        // show timestamp
//        return YES;
//    }

    return NO;
}

#pragma mark - Utils

-(BOOL)exist:(PPMessage*)ppMessage {
    NSArray *array = [_ppMessageIdSet allObjects];
    BOOL _exit = [array containsObject:ppMessage.messageId];
    if (_exit) {
        PPFastLog(@"Message exist %@.", ppMessage.messageId);
    }
    return _exit;
}

@end
