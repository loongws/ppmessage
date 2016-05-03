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

@property (nonatomic) PPCom *client;

- (instancetype)initWithClient:(PPCom*)client body:(NSDictionary*)conversationBody;
- (instancetype)initWithClient:(PPCom*)client withMessage:(PPMessage*)message;

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
        _messageSummary = nil;
        NSDictionary* lastMessage = [conversationBody objectForKey:@"last_message"];
        if (lastMessage && [lastMessage count] > 0) {
            NSDictionary *fromUserDic = [lastMessage objectForKey:@"from_user"];
            
            PPUser *user = [[PPUser alloc] initWithClient:client uuid:fromUserDic[@"user_uuid" ] fullName:fromUserDic[@"device_user_fullname"] avatarId:fromUserDic[@"device_user_icon"]];
            NSDictionary *lastMessageDic = [lastMessage objectForKey:@"message"];
            
            _userName = user.fullName;
            _userAvatar = user.avatar;
            _messageTimestamp = [[lastMessageDic[@"ts"] description] intValue];

        } else {
            NSString *updateTime = [conversationBody objectForKey:@"updatetime"];
            NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
            [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss SSSSSS"];
            NSDate *updateDate = [dateFormatter dateFromString:updateTime];
            
            _messageTimestamp = (long) [updateDate timeIntervalSince1970];
            _userName = @"PPMessage";
            
            if (conversationBody[@"conversation_icon"]) {
                _userAvatarUrl = [_client.downloader getResourceDownloadUrl:conversationBody[@"conversation_icon"]];
            }
        }
        
        _conversationItemType = [self.class decideConversationTypeForStringType:conversationBody[@"conversation_type"]];
        
        if (![_client.utils isNull:_userAvatar]) {
            _userAvatarUrl = [_client.downloader getResourceDownloadUrl:_userAvatar];
        }
    }
    return self;
}

+ (instancetype)itemWithClient:(PPCom*)client withMessageBody:(PPMessage*)message {
    return [[self alloc] initWithClient:client withMessage:message];
}

+ (instancetype)itemWithClient:(PPCom *)client content:(NSDictionary *)contentBody {
    PPMessage *message = nil;
    if (contentBody[@"latest_message"]) {
        message = [PPMessage messageWithClient:client body:[client.utils jsonStringToDictionary:contentBody[@"latest_message"][@"message_body"]]];
    }
    
    long timestamp = message ? message.timestamp : (long)[client.utils timestampFromString:contentBody[@"updatetime"]];
    NSString *summary = [PPMessage summaryInMessage:message];
    PPConversationItemType conversationType = [PPConversationItem decideConversationTypeForStringType:contentBody[@"conversation_type"]];
    NSString *assignedUUID = contentBody[@"assigned_uuid"];
    
    return [[self alloc] initWithClient:client
                               withUUID:contentBody[@"uuid"]
                            withIconUrl:[client.utils getFileURL:contentBody[@"from_user"][@"user_icon"]]
                               withName:contentBody[@"from_user"][@"user_fullname"]
                          withTimestamp:timestamp withSummary:summary
                               withType:conversationType
                         withAssignUUID:assignedUUID];
    
}

+ (instancetype)itemWithClient:(PPCom*)client group:(NSDictionary*)groupBody {
    long timestamp = [client.utils timestampFromString:groupBody[@"updatetime"]];
    NSString *summary = groupBody[@"group_desc"];
    NSString *userAvatar = [client.utils getFileURL:groupBody[@"group_icon"]];
    NSString *groupName = groupBody[@"group_name"];
    NSString *conversationUUID = groupBody[@"conversation_uuid"];
    
    PPConversationItem *conversation = [[self alloc] initWithClient:client
                                                           withUUID:conversationUUID
                                                        withIconUrl:userAvatar
                                                           withName:groupName
                                                      withTimestamp:timestamp
                                                        withSummary:summary
                                                           withType:PPConversationItemTypeGroup
                                                     withAssignUUID:nil];
    conversation.groupUUID = groupBody[@"uuid"];
    
    return conversation;
}

+ (instancetype)itemWithClient:(PPCom *)client contentFromCreateConversation:(NSDictionary *)body {
    long updateTime = [client.utils timestampFromString:body[@"updatetime"]];
    NSString *summary = nil;
    NSString *conversationIcon = [client.utils getFileURL:body[@"conversation_icon"]];
    NSString *conversationName = PPSafeString(body[@"conversation_name"]);
    PPConversationItemType type = [PPConversationItem decideConversationTypeForStringType:body[@"conversation_type"]];
    NSString *groupUUID = body[@"group_uuid"];
    NSString *conversationUUID = body[@"uuid"];
    NSString *assignedUUID = body[@"assigned_uuid"];
    
    PPConversationItem *conversation = [[self alloc] initWithClient:client
                                                           withUUID:conversationUUID
                                                        withIconUrl:conversationIcon
                                                           withName:conversationName
                                                      withTimestamp:updateTime
                                                        withSummary:summary
                                                           withType:type
                                                     withAssignUUID:assignedUUID];
    conversation.groupUUID = groupUUID;
    
    return conversation;
    
}

- (instancetype)initWithClient:(PPCom*)client withMessage:(PPMessage*)message {
    if (self = [super init]) {
        _client = client;
        _uuid = message.conversationId;
        _messageTimestamp = message.timestamp;
        _messageSummary = [PPMessage summaryInMessage:message];
        
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

- (instancetype)initWithClient:(PPCom *)client
                      withUUID:(NSString *)conversationUUID
                   withIconUrl:(NSString *)conversationIconUrl
                      withName:(NSString *)conversationName
                 withTimestamp:(long)timestamp
                   withSummary:(NSString *)messageSummary
                      withType:(PPConversationItemType)conversationType
                withAssignUUID:(NSString *)assignUUID {
    if (self = [super init]) {
        self.client = client;
        self.uuid = conversationUUID;
        self.userAvatarUrl = conversationIconUrl;
        self.userName = conversationName;
        self.messageTimestamp = timestamp;
        self.messageSummary = messageSummary;
        self.conversationItemType = conversationType;
        self.assignedUUID = assignUUID;
    }
    return self;
}

- (NSComparisonResult)compare:(PPConversationItem *)other {
    NSInteger weightObj1 = [self.class weightForConversation:self];
    NSInteger weightObj2 = [self.class weightForConversation:other];
    
    if (weightObj1 > weightObj2) return NSOrderedAscending;
    if (weightObj1 < weightObj2) return NSOrderedDescending;
    
    if (self.messageTimestamp > other.messageTimestamp) {
        return NSOrderedAscending;
    } else if (self.messageTimestamp < other.messageTimestamp) {
        return NSOrderedDescending;
    }
    return NSOrderedSame;
}

- (NSString*)description {
    return [NSString stringWithFormat:@"< %p, %@, %@ >",
            self,
            self.class,
            @{ @"conversation_uuid": PPSafeString(self.uuid),
               @"conversation_name": PPSafeString(self.userName),
               @"conversation_icon": PPSafeString(self.userAvatarUrl),
               @"conversation_timestamp": [NSNumber numberWithLong:self.messageTimestamp],
               @"conversation_message_summary": PPSafeString(self.messageSummary),
               @"group_uuid": PPSafeString(self.groupUUID),
               @"conversation_type": [NSNumber numberWithInteger:self.conversationItemType]}];
}

#pragma mark - helpers

+ (PPConversationItemType)decideConversationTypeForStringType:(NSString*)type {
    if (!type) return PPConversationItemTypeUnknown;
    if ([type isEqualToString:@"S2P"]) return PPConversationItemTypeS2P;
    if ([type isEqualToString:@"P2S"]) return PPConversationITemTypeP2S;
    return PPConversationItemTypeUnknown;
}

+ (NSInteger)weightForConversation:(PPConversationItem*)conversation {
    return conversation.conversationItemType == PPConversationItemTypeGroup ? 10000 : 0;
}

@end
