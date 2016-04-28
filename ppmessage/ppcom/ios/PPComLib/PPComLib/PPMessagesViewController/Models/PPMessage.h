//
//  PPMessage.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/25/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPCom.h"
#import "PPMessageData.h"
#import "JSQMessage.h"
#import "PPMessageMediaData.h"

@interface PPMessage : NSObject <PPMessageData>

@property (nonatomic, readonly) NSString *messageId;
@property (nonatomic, readonly) NSString *fromId;
@property (nonatomic) NSString *text;
@property (nonatomic, readonly) long timestamp;
@property (nonatomic, readonly) NSString *toId;
@property (nonatomic) NSString *conversationId;
@property (nonatomic, readonly) NSDictionary *rawBody;
@property (nonatomic, readonly) NSString *type;
@property (nonatomic, readonly) id<PPMessageMediaData> media;
@property (nonatomic, readonly) PPUser *fromUser;
@property (nonatomic, readonly) NSString *messagePushId;
@property (nonatomic, readonly) BOOL showTimestamp;

@property (nonatomic, readonly) BOOL illegal;
@property (nonatomic, readonly) BOOL error;
@property (nonatomic, readonly) NSString *errorDescription;

#pragma mark - Initialization

/**
 * 根据服务器返回的messageBody来创建`PPMessage`
 */
+ (instancetype)messageWithClient:(PPCom*)client body:(NSDictionary*)messageBody;

/**
 * 根据client，conversationId和text来创建一个普通的PPMessage，日期默认为当前
 */
+ (instancetype)messageWithClient:(PPCom*)client conversationId:(NSString*)conversationId text:(NSString*)text;

/**
 * 返回JSQMessage的表达
 */
- (JSQMessage*)getJSQMessage;

/**
 * 标示这条消息有错(一般用来标示发送失败)，默认失败描述为"Send Error"
 */
- (void)markError;

/**
 * 标示这条消息有错(一般用来标示发送失败)
 */
- (void)markErrorWithDescription:(NSString*)description;

@end
