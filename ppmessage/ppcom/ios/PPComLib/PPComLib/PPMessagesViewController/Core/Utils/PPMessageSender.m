//
//  PPMessageSender.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPMessageSender.h"
#import "PPUser.h"
#import "PPUploader.h"
#import "PPComUtils.h"
#import "PPDataCache.h"
#import "PPAppInfo.h"

#import "PPStoreManager.h"
#import "PPMessagesStore.h"

#define MESSAGE_TO_TYPE @"AP" // broadcast `AP`
#define MESSAGE_NOTI @"NOTI"

@interface PPMessageSender ()

@property PPCom *client;

-(NSMutableDictionary*)getBasicMessageParams:(PPMessage*)message;

-(void)sendTextMessage:(NSMutableDictionary*)basicParams message:(PPMessage*)message complectionHandler:(void(^)(NSError *error, NSDictionary *response))handler;
-(void)sendTxtMessage:(NSMutableDictionary*)basicParams message:(PPMessage*)message complectionHandler:(void(^)(NSError *error, NSDictionary *response))handler;
-(void)sendImageMessage:(NSMutableDictionary*)basicParams message:(PPMessage*)message complectionHandler:(void(^)(NSError *error, NSDictionary *response))handler;

- (void)onSendMessageComplected:(PPMessage *)message response:(NSDictionary*)response;

@end

@implementation PPMessageSender

#pragma mark - Initialize Methods

+ (instancetype)senderWithClient:(PPCom*)client {
    return [[self alloc] initWithClient:client];
}

- (instancetype)initWithClient:(PPCom *)client {
    if (self = [super init]) {
        _client = client;
    }
    return self;
}

#pragma mark - Send Methods

-(void)sendMessage:(PPMessage*)message {
    [self sendMessage:message complectionHandler:nil];
}

-(void)sendMessage:(PPMessage*)message complectionHandler:(void(^)(NSError *error, NSDictionary *response))handler {
    NSMutableDictionary *params = [self getBasicMessageParams:message];
    NSString* type = message.type;
    if ([type isEqualToString:@"TEXT"]) {
        [self sendTextMessage:params message:message complectionHandler:handler];
    } else if ([type isEqualToString:@"TXT"]) {
        [self sendTxtMessage:params message:message complectionHandler:handler];
    } else if ([type isEqualToString:@"IMAGE"]) {
        [self sendImageMessage:params message:message complectionHandler:handler];
    }
}

-(void)sendTextMessage:(NSMutableDictionary *)basicParams message:(PPMessage *)message complectionHandler:(void (^)(NSError *, NSDictionary *))handler {
    basicParams[@"message_body"] = message.text;
    [self.client.api sendMessage:basicParams completionHandler:^(NSDictionary *response, NSError *error) {

            if ( response ) {
                [self onSendMessageComplected:message response:response];
            }
            
            if (handler) {
                handler(error, response);
            }
        }];
}

-(void)sendTxtMessage:(NSMutableDictionary *)basicParams message:(PPMessage *)message complectionHandler:(void (^)(NSError *, NSDictionary *))handler {
    [self.client.uploader uploadTxt:message.text withDelegate:^(NSError *error, NSDictionary *response) {
            if (!error) {
                //TODO delete local txt file
                NSString *fid = response[@"fuuid"];
                NSDictionary *fidParams = @{@"fid":fid};
            
                basicParams[@"message_body"] = [self.client.utils dictionaryToJsonString:fidParams];
            
                [self.client.api sendMessage:basicParams completionHandler:^(NSDictionary *response, NSError *error) {

                        if ( response ) {
                            [self onSendMessageComplected:message response:response];
                        }
                    
                        if (handler) {
                            handler(error, response);
                        }
                    }];
            }
        }];
}

-(void)sendImageMessage:(NSMutableDictionary *)basicParams message:(PPMessage *)message complectionHandler:(void (^)(NSError *, NSDictionary *))handler {
    
}

#pragma mark - Private Methods

-(NSMutableDictionary*)getBasicMessageParams:(PPMessage*)message {
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    
    params[@"conversation_uuid"] = message.conversationId;
    params[@"to_uuid"] = message.toId; //app_uuid
    params[@"to_type"] = MESSAGE_TO_TYPE;
    params[@"message_type"] = MESSAGE_NOTI;
    params[@"message_subtype"] = message.type;
    params[@"from_uuid"] = _client.user.uuid;
    params[@"device_uuid"] = _client.user.deviceUuid;
    params[@"conversation_type"] = @"P2S";

    // THE FOLLOWING THREE FILEDS ONLY WORKING FOR `SEND MESSAGE`
    params[@"uuid"] = message.messageId;
    params[@"from_type"] = @"DU";
    params[@"app_uuid"] = _client.appInfo.appId;
    
    return params;
}

// Because message's `message.id` was generated in client-side
// So don't need to do any thing when send successful
- (void)onSendMessageComplected:(PPMessage *)message response:(NSDictionary*)response {
    
//    if (message && message.messageId) {

        // message id that server returned
        // we need store this message id to avoid duplicate message generated when user
        // try to load history 
//        NSString * messageId = message.messageId;

        // store the `messageId` that get from server to local,
        // to avoid duplicated message
//        [[PPStoreManager instanceWithClient:self.client].messagesStore updateMessageIdSet:message withApiMessageId:messageId];
    
//    }
}

@end
