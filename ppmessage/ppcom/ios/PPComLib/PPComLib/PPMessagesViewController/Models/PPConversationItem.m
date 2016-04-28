//
//  PPConversationItem.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/25/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPConversationItem.h"
#import "PPUser.h"
#import "PPCom.h"
#import "PPComUtils.h"
#import "PPDownloader.h"
#import "PPMessage.h"

#define DEFAULT_USER_NAME @"PPMessage"

@interface PPConversationItem ()

@property PPCom *client;

- (instancetype)initWithClient:(PPCom*)client body:(NSDictionary*)conversationBody;
- (instancetype)initWithClient:(PPCom*)client withMessage:(PPMessage*)message;

- (NSString*)getMessageSummary:(NSDictionary*)jsonMessageBody;
- (NSString*)getMessageSummary:(NSString*)messageType messageBody:(NSString*)body;

@end

@implementation PPConversationItem

#pragma mark - Initialize Methods

+ (instancetype)itemWithClient:(PPCom*)client body:(NSDictionary*)conversationBody {
    return [[self alloc] initWithClient:client body:conversationBody];
}

- (instancetype)initWithClient:(PPCom*)client body:(NSDictionary*)conversationBody {
    self = [super init];
    if (self) {
        _client = client;
        _uuid = conversationBody[@"uuid"];
        NSDictionary* lastMessage = [conversationBody objectForKey:@"last_message"];
        if (lastMessage && [lastMessage count] > 0) {
            NSDictionary *fromUserDic = [lastMessage objectForKey:@"from_user"];
            
            PPUser *user = [[PPUser alloc] initWithClient:client uuid:fromUserDic[@"user_uuid" ] fullName:fromUserDic[@"device_user_fullname"] avatarId:fromUserDic[@"device_user_icon"]];
            NSDictionary *lastMessageDic = [lastMessage objectForKey:@"message"];
            
            _userName = user.fullName;
            _userAvatar = user.avatar;
            _messageSummary = [self getMessageSummary:lastMessageDic];
            _messageTimestamp = [[lastMessageDic[@"ts"] description] intValue];

        } else {
            NSString *updateTime = [conversationBody objectForKey:@"updatetime"];
            NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
            [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss SSSSSS"];
            NSDate *updateDate = [dateFormatter dateFromString:updateTime];
            
            _messageTimestamp = (long) [updateDate timeIntervalSince1970];
            _userName = @"PPMessage";
        }
        
        if (![_client.utils isNull:_userAvatar]) {
            _userAvatarUrl = [_client.downloader getResourceDownloadUrl:_userAvatar];
        }
    }
    return self;
}

+ (instancetype)itemWithClient:(PPCom*)client withMessageBody:(PPMessage*)message {
    return [[self alloc] initWithClient:client withMessage:message];
}

- (instancetype)initWithClient:(PPCom*)client withMessage:(PPMessage*)message {
    if (self = [super init]) {
        _client = client;
        _uuid = message.conversationId;
        _messageTimestamp = message.timestamp;
        _messageSummary = [self getMessageSummary:message.type messageBody:message.text];
        
        if (message.fromUser) {
            _userName = message.fromUser.fullName;
            _userAvatar = message.fromUser.avatar;
            _userAvatarUrl = message.fromUser.avatarUrl;
        } else {
            _userName = client.user.fullName;
        }
    }
    return self;
}

- (instancetype)initWithClient:(PPCom*)client conversationId:(NSString*)conversationId {
    return [self initWithClient:client conversationId:conversationId date:[NSDate date]];
}

- (instancetype)initWithClient:(PPCom *)client conversationId:(NSString *)conversationId date:(NSDate *)date {
    if (self = [super init]) {
        _client = client;
        _uuid = conversationId;
        _messageTimestamp = (long)[date timeIntervalSince1970];
        _userName = DEFAULT_USER_NAME;
        _messageSummary = @"";
    }
    return self;
}

#pragma mark - Utils

- (NSString*)getMessageSummary:(NSDictionary*)jsonMessageBody {
    return [self getMessageSummary:jsonMessageBody[@"ms"] messageBody:jsonMessageBody[@"bo"]];
}

- (NSString*)getMessageSummary:(NSString*)messageType messageBody:(NSString*)body {
    NSString *type = messageType;
    if ([type isEqualToString:@"TEXT"]) {
        return body;
    } else if ([type isEqualToString:@"TXT"]) {
        return @"[Large Text]";
    } else if ([type isEqualToString:@"IMAGE"]) {
        return @"[Image]";
    } else if ([type isEqualToString:@"FILE"]) {
        return @"[File]";
    } else {
        return @"";
    }
}

@end
