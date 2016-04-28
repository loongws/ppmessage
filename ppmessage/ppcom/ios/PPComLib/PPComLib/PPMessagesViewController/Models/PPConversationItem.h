//
//  PPConversationItem.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/25/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "PPCom.h"

@interface PPConversationItem : NSObject

+ (instancetype)itemWithClient:(PPCom*)client body:(NSDictionary*)conversationBody;
+ (instancetype)itemWithClient:(PPCom*)client withMessageBody:(PPMessage*)message;
- (instancetype)initWithClient:(PPCom*)client conversationId:(NSString*)conversationId;
- (instancetype)initWithClient:(PPCom*)client conversationId:(NSString*)conversationId date:(NSDate*)date;

/**
 * conversation uuid
 */
@property NSString *uuid;

@property NSString *userAvatar;
@property NSString *userName;
@property long messageTimestamp;
@property NSString *messageSummary;

@property UIImage *userAvatarImage;
@property NSString *userAvatarUrl;

@end
