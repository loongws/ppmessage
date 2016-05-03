//
//  PPMessageList.h
//  PPComDemo
//
//  Created by Kun Zhao on 10/8/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPCom.h"

@interface PPMessageList : NSObject

@property (readonly) NSMutableArray *jsqMessageArray;
@property (readonly) NSMutableArray *ppMessageArray;
@property NSInteger pageOffset;

+(instancetype)listWithClient:(PPCom*)client messageListBody:(NSDictionary*)body;
-(instancetype)initWithClient:(PPCom*)client messageListBody:(NSDictionary*)body;
-(instancetype)initWithClient:(PPCom*)client;

-(BOOL)addPPMessage:(PPMessage*)ppMessage;
-(void)addPPMessageListToHead:(PPMessageList*)messageList;

// store new message id to message id set to check messages duplicate
- (void)updateMessageIdSetWith:(NSString *)messageId;

-(BOOL)exist:(PPMessage*)ppMessage;

@end
