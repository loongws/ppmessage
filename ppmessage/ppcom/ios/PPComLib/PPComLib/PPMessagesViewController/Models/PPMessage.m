//
//  PPMessage.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/25/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPMessage.h"
#import "PPCom.h"
#import "PPUser.h"
#import "PPComUtils.h"
#import "PPMessageMediaData.h"
#import "PPPhotoMediaItem.h"
#import "PPFileMediaItem.h"
#import "JSQMessages.h"
#import "PPTxtMediaItem.h"
#import "NSString+Crypto.h"
#import "PPAppInfo.h"
#import "NSBundle+JSQMessages.h"
#import "PPFastLog.h"

#define MAX_TEXT_LENGTH 128
#define TXT_MESSAGE_PLACEHOLDER @"..."

NSString *const PPMessageApiTypeText = @"TEXT";
NSString *const PPMessageApiTypeTxt = @"TXT";
NSString *const PPMessageApiTypeFile = @"FILE";
NSString *const PPMessageApiTypeImage = @"IMAGE";
NSString *const PPMessageApiTypeAudio = @"AUDIO";

@interface PPMessage ()

@property NSString *defaultErrorDescription;
@property PPCom *client;
@property JSQMessage *jsqMessage;
@property (nonatomic) NSArray *legalMessageTypes;

- (instancetype)initWithClient:(PPCom*)client conversationId:(NSString*)conversationId text:(NSString*)text;
- (instancetype)initWithClient:(PPCom*)client body:(NSDictionary*)messageBody;

- (id<PPMessageMediaData>)getMediaItem;
- (id<PPMessageMediaData>)getPhotoMediaItem;
- (id<PPMessageMediaData>)getTxtMediaItem;
- (id<PPMessageMediaData>)getFileMediaItem;

- (BOOL)isLargeText:(NSString*)text;

@end

@implementation PPMessage

#pragma mark - Initialization

+ (instancetype)messageWithClient:(PPCom*)client body:(NSDictionary*)messageBody {
    return [[self alloc] initWithClient:client body:messageBody];
}

+ (instancetype)messageWithClient:(PPCom*)client conversationId:(NSString*)conversationId text:(NSString*)text {
    return [[self alloc] initWithClient:client conversationId:conversationId text:text];
}

+ (NSString*)summaryInMessage:(PPMessage *)message {
    if ([message.type isEqualToString:PPMessageApiTypeText]) {
        return message.text;
    } else if ([message.type isEqualToString:PPMessageApiTypeTxt]) {
        id mediaData = message.media;
        if (!mediaData) {
            return @"[Txt]";
        }
        
        PPTxtMediaItem *txtMediaItem = mediaData;
        return txtMediaItem.text;
    } else if ([message.type isEqualToString:PPMessageApiTypeImage]) {
        return @"[Image]";
    } else if ([message.type isEqualToString:PPMessageApiTypeFile]) {
        return @"[File]";
    } else if ([message.type isEqualToString:PPMessageApiTypeAudio]) {
        return @"[Audio]";
    } else {
        return @"";
    }
}

- (instancetype)init {
    if (self = [super init]) {
        _error = NO;
        _errorDescription = nil;
        _defaultErrorDescription = [NSBundle jsq_localizedStringForKey:@"send_error"];
    }
    return self;
}

- (instancetype) initWithClient:(PPCom*)client body:(NSDictionary*)messageBody {
    self = [self init];
    if (self) {
        _client = client;

        // contains `from_user` field ?
        if ( [self.client.utils isNotNull:messageBody[@"from_user"]] ) {
            NSDictionary *fromUserDic = messageBody[@"from_user"];
            _fromUser = [PPUser userWithClient:_client messageUserBody:fromUserDic];
        }

        // contains `message_body` field ?
        NSDictionary *msgDict = messageBody;
        if ( [self.client.utils isNotNull:messageBody[@"message_body"]] &&
             [ messageBody[@"message_body"] isKindOfClass:[NSString class] ] ) {
            msgDict = [ self.client.utils jsonStringToDictionary:messageBody[@"message_body"] ];
        } else if ( [self.client.utils isNotNull:messageBody[@"msg"]] ) {
            msgDict = messageBody[@"msg"];
        }

        _messageId = msgDict[@"id"];
        _fromId = msgDict[@"fi"];
        _toId = msgDict[@"ti"];
        _text = msgDict[@"bo"];
        _conversationId = msgDict[@"ci"];
        _timestamp = [msgDict[@"ts"] integerValue];
        _rawBody = msgDict;
        _type = msgDict[@"ms"];
        _media = [self getMediaItem];
        _messagePushId = msgDict[@"pid"];        

    }
    return self;
}

- (instancetype)initWithClient:(PPCom*)client conversationId:(NSString*)conversationId text:(NSString*)text {
    self = [self init];
    if (self) {
        _client = client;
        
        // generate a random uuid as message's id
        _messageId = [_client.utils getRandomUUID];
        _fromId = _client.user.uuid;
        _text = text;
        _conversationId = conversationId;
        _timestamp = (long)[[NSDate date] timeIntervalSince1970];
        
        if ([self isLargeText:text]) {
            _type = @"TXT";
        } else {
            _type = @"TEXT";
        }

        // TODO
        // generally, we should assign different `toId` by different `policy` here
        if ( _client.appInfo != nil && _client.appInfo.appId != nil ) {
            _toId = _client.appInfo.appId;
        } else {
            // TODO Refactor
            // if goes here, this `message` is illegal yet
            // so we can mark this `message` as un-sendable state 
            _toId = _conversationId;
        }
    }
    return self;
}

- (JSQMessage*)getJSQMessage {
    if (!_jsqMessage) {
        if ([_type isEqualToString:@"TEXT"]) {
            _jsqMessage = [[JSQMessage alloc] initWithSenderId:self.fromId senderDisplayName:self.client.user.fullName date:[self.client.utils timestampToDate:self.timestamp]  text:self.text];
        } else if ([_type isEqualToString:@"IMAGE"]) {
            JSQPhotoMediaItem *photoItem = [[JSQPhotoMediaItem alloc] initWithImage:nil];
            photoItem.appliesMediaViewMaskAsOutgoing = [self.fromId isEqualToString:self.client.user.uuid];
            JSQMessage *photoMessage = [JSQMessage messageWithSenderId:self.fromId
                                                           displayName:self.client.user.fullName
                                                                 media:photoItem];
            _jsqMessage = photoMessage;
        } else if ([_type isEqualToString:@"TXT"]) {
            _jsqMessage = [[JSQMessage alloc] initWithSenderId:self.fromId senderDisplayName:self.client.user.fullName date:[self.client.utils timestampToDate:self.timestamp]  text:self.text];
        } else if ([_type isEqualToString:@"FILE"]) {
            PPFileMediaItem *fileMediaItem = (PPFileMediaItem*)[self getFileMediaItem];
            JSQFileMediaItem *fileItem = [[JSQFileMediaItem alloc] initWithFileURL:[NSURL URLWithString:fileMediaItem.furl] displayName:fileMediaItem.fname];
            fileItem.appliesMediaViewMaskAsOutgoing = [self.fromId isEqual:self.client.user.uuid];
            JSQMessage *fileMessage = [JSQMessage messageWithSenderId:self.fromId displayName:self.client.user.fullName media:fileItem];
            _jsqMessage = fileMessage;
        }
    }
    return _jsqMessage;
}

- (id<PPMessageMediaData>)getMediaItem {
    id<PPMessageMediaData> mediaItem = nil;
    if ([_type isEqualToString:@"IMAGE"]) {
        mediaItem = [self getPhotoMediaItem];
    } else if ([_type isEqualToString:@"TXT"]) {
        mediaItem = [self getTxtMediaItem];
    } else if ([_type isEqualToString:@"FILE"]) {
        mediaItem = [self getFileMediaItem];
    }
    return mediaItem;
}

- (id<PPMessageMediaData>)getPhotoMediaItem {
    NSDictionary *photoDict = [_client.utils jsonStringToDictionary:_text];
    return [PPPhotoMediaItem itemWithClient:_client mediaBody:photoDict];
}

- (id<PPMessageMediaData>)getTxtMediaItem {
    NSDictionary *txtDict = [_client.utils jsonStringToDictionary:_text];
    return [PPTxtMediaItem itemWithClient:_client txtBody:txtDict];
}

- (id<PPMessageMediaData>)getFileMediaItem {
    NSDictionary *fileDict = [_client.utils jsonStringToDictionary:_text];
    return [PPFileMediaItem itemWithClient:_client fileBody:fileDict];
}

#pragma mark - Getter And Setter Methods

- (NSArray*)legalMessageTypes {
    if (!_legalMessageTypes) {
        _legalMessageTypes = @[@"TEXT", @"TXT", @"IMAGE", @"FILE"];
    }
    return _legalMessageTypes;
}

- (BOOL)illegal {
    return [self.legalMessageTypes containsObject:self.type];
}

- (void)markError {
    [self markErrorWithDescription:_defaultErrorDescription];
}

- (void)markErrorWithDescription:(NSString *)description {
    _error = YES;
    _errorDescription = description;
}

#pragma mark - Utils Methods

- (BOOL)isLargeText:(NSString*)text {
    NSUInteger bytes = [text lengthOfBytesUsingEncoding:NSUTF8StringEncoding];
    unsigned long length = (unsigned long)bytes;
    return length > MAX_TEXT_LENGTH;
}

- (NSString*)description {
    return [NSString stringWithFormat:@"< %p, %@, %@ >",
            self,
            self.class,
            @{ @"type": PPSafeString(self.type),
               @"text": PPSafeString(self.text),
               @"fromId": PPSafeString(self.fromId),
               @"conversationID": PPSafeString(self.conversationId),
               @"uuid": PPSafeString(self.messageId) }];
}

@end
