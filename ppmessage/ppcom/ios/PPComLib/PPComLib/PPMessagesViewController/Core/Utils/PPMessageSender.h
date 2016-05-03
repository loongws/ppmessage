//
//  PPMessageSender.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPComAPI.h"
#import "PPMessage.h"

/**
 * Send Message
 */
@interface PPMessageSender : NSObject

#pragma mark - Initialize Methods

+(instancetype)senderWithClient:(PPCom*)client;
-(instancetype)initWithClient:(PPCom*)client;

#pragma mark - Send Methods
-(void)sendMessage:(PPMessage*)message;
-(void)sendMessage:(PPMessage*)message complectionHandler:(void(^)(NSError *error, NSDictionary *response))handler;

@end
