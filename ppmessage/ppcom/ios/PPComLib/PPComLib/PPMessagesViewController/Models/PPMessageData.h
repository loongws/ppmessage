//
//  PPMessageData.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/25/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPMessageMediaData.h"

@protocol PPMessageData <NSObject>

@required

/** message id **/
- (NSString*)messageId;

/**
 * from uuid
 */
- (NSString*)fromId;

/**
 * message timestamp
 */
- (long)timestamp;

/**
 * to uuid
 */
- (NSString*)toId;

/**
 * conversation id
 */
- (NSString*)conversationId;

/**
 * text message
 */
- (NSString*)text;

/**
 * message type
 */
- (NSString*)type;

@optional

/**
 * raw message body
 */
- (NSDictionary*)rawBody;

/**
 * media data
 */
- (id<PPMessageMediaData>)media;

/**
 * from user
 */
- (PPUser*)fromUser;

/**
 * message push uuid, generally used for ack message.
 */
- (NSString*)messagePushId;

@end
