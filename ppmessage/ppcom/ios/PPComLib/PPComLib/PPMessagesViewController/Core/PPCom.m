//
//  PPCom.m
//  OCTest
//
//  Created by Kun Zhao on 9/17/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//


#import "PPUser.h"
#import "PPCom.h"
#import "SRWebSocket.h"
#import "PPTxtLoader.h"
#import "PPComUtils.h"
#import "PPDownloader.h"
#import "PPMessageSender.h"
#import "PPMessageReceiver.h"
#import "PPUploader.h"
#import "PPDataCache.h"
#import "PPConstants.h"
#import "PPAppInfo.h"
#import "PPFastLog.h"
#import "PPComToken.h"

#import "PPGetDefaultConversationHttpModels.h"

#import "PPStoreManager.h"
#import "PPConversationsStore.h"

#define ANONYMOUS_USER_TRACK_ID @"anonymous_track_id"
#define PPCOM_ENABLE_LOG 1

@class PPComAPI;

@interface PPCom () <PPMessageReceiverDelegate>

@property PPMessageReceiver *messageReceiver;
/** 用来获取`accessToken` **/
@property (nonatomic) PPComToken *tokenStore;
/** 用来存储第三方开发者提供的appUUID **/
@property (nonatomic) NSString *appUUID;

- (void) getAppInfo: (NSString *) appKey completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) initWithAnonymousUser;
- (void) initWithEmailUser:(NSString*)email;
- (NSString*) getAnonymousUserTrackId;
- (void) storeAnonymousUserTrackId:(NSString*)trackId;
- (BOOL) isAnonymous:(NSString*)email;
- (void) updateDeviceAndOnline:(PPUser*)user;

- (void) initWebSocket:(PPUser*)user;

- (void) publishInitState:(InitializeState)state;

- (void) ackMessage:(PPMessage*)message;
- (void) online;
- (void) offline;

@end

////////////////////////////////////
///////// PPComInitialize //////////
///////////////////////////////////
@interface PPCom (PPComInitialize)
- (void) handleError:(NSError*)error with:(NSDictionary *)errorResponse;
- (void) handleOnGetUserInfo:(PPUser*)user;
- (void) handleSuccess:(PPUser*)user conversationId:(NSString *)conversationId;
@end

@implementation PPCom (PPComInitialize)

- (void) handleError:(NSError*)error with:(NSDictionary *)errorResponse {
    [self publishInitState:InitializeStateNull];
    
    if (self.initDelegate != nil) {
        if ([self.initDelegate respondsToSelector:@selector(onInitError:with:)]) {
            [self.initDelegate onInitError:error with:errorResponse];
        }
    }
}

- (void) handleOnGetUserInfo:(PPUser*)user {
    self.user = user;

    if ( self.initDelegate ) {
        if ([self.initDelegate respondsToSelector:@selector(onGetUserInfo:)]) {
            [self.initDelegate onGetUserInfo:self.user];
        }
    }
}

- (void) handleSuccess:(PPUser*)user conversationId:(NSString *)conversationId {
    [self publishInitState:InitializeStateInited];

    // assign user to `PPCom` class
    self.user = user;
    
    // begin init web socket
    [self initWebSocket:self.user];
    
    //callback
    if (self.initDelegate != nil) {
        [self.initDelegate onInitSuccess:user conversationId:conversationId];
    }
}
@end

@implementation PPCom

+ (PPCom*)instance {
    static dispatch_once_t onceToken;
    static PPCom *client;
    dispatch_once(&onceToken, ^{
        client = [[PPCom alloc] init];
    });
    return client;
}

+ (PPCom*)instanceWithAppUUID:(NSString *)appUUID {
    PPCom *client = [self instance];
    client.appUUID = appUUID;
    return client;
}

- (PPCom*) init {
    self = [super init];
    if (self) {
        self.initState = InitializeStateNull;

        // create a fake user
        self.user = [[PPUser alloc] initWithClient:self uuid:unknownUserId fullName:unknownUserName avatarId:nil];
        self.user.deviceUuid = unknownUserDeviceId;
        
        // create a fake conversation
        self.conversationId = unknownConversationId;

        // create an empty appInfo
        self.appInfo = [PPAppInfo app:@{}];
        
    }
    return self;
}

#pragma mark - Init Methods

// 0. init order
//
// before 1: get access token
// 1. getImappInfo
// 2. createDevice
// 3. updateDevice
// 4. check conversation exist
// 5. if not exist , create a conversation
// 6. success callback

- (void)initilize:(NSString *)email {
    
    if (self.initState == InitializeStateIniting) {
        PPFastLog(@"InitializeStateIniting");
        return;
    }
    
    if (self.initState == InitializeStateInited) {
        PPFastLog(@"InitializeStateInited");
        [self handleSuccess:self.user conversationId:self.conversationId];
        return;
    }
    
    [self publishInitState:InitializeStateIniting];
    
    // get ppcom token
    [self.tokenStore getPPComTokenWithBlock:^(NSString *accessToken, NSError *error, BOOL success) {
        
        if (!success && PPCOM_ENABLE_LOG) PPFastLog(@"get access token error: %@", error);
        
        self.api.accessToken = accessToken;
        [self onGetAccessToken:accessToken email:email];
        
    }];

}

- (void)initilize:(NSString *)email withDelegate:(id<PPComInitializeDelegate>)delegate {
    _initDelegate = delegate;
    [self initilize:email];
}

- (void)onGetAccessToken:(NSString*)accessToken
                   email:(NSString*)email {
    // get imapp info first
    [self getAppInfo:self.appUUID completionHandler:^(NSDictionary *response, NSError *error) {
        
        if ( !error ) {
            // no error
            if ([ response[@"error_code"] integerValue ] == 0) {
                
                // cache app info
                self.appInfo = [PPAppInfo app:response];
                
                // begin load user info
                if ([self isAnonymous:email]) {
                    [self initWithAnonymousUser];
                } else {
                    [self initWithEmailUser:email];
                }
            } else {
                [self handleError:nil with:response];
            }
        } else {
            [self handleError:error with:nil];
        }
    }];
}

- (void) getAppInfo: (NSString *) appUUID completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    params[@"app_uuid"] = appUUID;
    [ self.api getAppInfo:params completionHandler:handler ];
}

- (void)initWithEmailUser:(NSString*)email {
    PPComAPI *api = self.api;
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    params[@"user_email"] = email;
    
    [api getUserUuid:params completionHandler:^(NSDictionary *response, NSError *error) {
            
        if ( !error ) {

            // No error
            // @hint String => int
            if ( [ response[@"error_code"] integerValue ] == 0 ) {
                NSString *userUUID = [response objectForKey:@"user_uuid"];
            
                [params removeAllObjects];
                [params setObject:@"DU" forKey:@"type"];
                [params setObject:userUUID forKey:@"uuid"];
            
                [api getUserDetailInfo:params completionHandler:^(NSDictionary *response, NSError *error) {
                        if (!error) {
                            
                            // cache user info
                            PPUser *user = [PPUser userWithClient:self body:response];

                            [self updateDeviceAndOnline:user];
                            
                        } else {
                            [self handleError:nil with:response];
                        }
                    }];
            } else {
                [self handleError:nil with:response];
            }
            
        } else {
            [self handleError:error with:nil];
        }
    }];
}

- (void) initWithAnonymousUser {
    NSString *trackId = [self getAnonymousUserTrackId];
    if (!trackId) {
        trackId = [self.utils getRandomUUID];
        [self storeAnonymousUserTrackId:trackId];
        PPFastLog(@"create new trackId:%@.", trackId);
    } else {
        PPFastLog(@"find trackId from disk:%@.", trackId);
    }
    
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    params[@"ppcom_trace_uuid"] = trackId;
    params[@"app_uuid"] = self.appUUID;
    
    PPComAPI *api = self.api;
    [api createAnonymousUser:params completionHandler:^(NSDictionary *response, NSError *error) {
        if (!error) {

            // No error
            if (response != nil && [response[@"error_code"] integerValue] == 0) {
                PPUser *user = [[PPUser alloc] initWithClient:self uuid:response[@"user_uuid"] fullName:response[@"user_fullname"] avatarId:nil deviceUuid:nil];

                [self updateDeviceAndOnline:user];
            } else {
                [self handleError:nil with:response];
            }
            
        } else {
            [self handleError:error with:nil];
        }
    }];
}

- (void) initWebSocket:(PPUser*)user {
    if (!_messageReceiver) {
        _messageReceiver = [ [PPMessageReceiver alloc] init:self appInfo:self.appInfo ];
    }
    [_messageReceiver openWithDelegate:self];
}

- (NSString*) getAnonymousUserTrackId {
    NSUserDefaults *preferences = [NSUserDefaults standardUserDefaults];
    if ([preferences objectForKey:ANONYMOUS_USER_TRACK_ID]) {
        return [preferences stringForKey:ANONYMOUS_USER_TRACK_ID];
    }
    return nil;
}

- (void) storeAnonymousUserTrackId:(NSString*)trackId {
    NSUserDefaults *preferences = [NSUserDefaults standardUserDefaults];
    [preferences setValue:trackId forKey:ANONYMOUS_USER_TRACK_ID];
    [preferences synchronize];
}

- (BOOL) isAnonymous:(NSString*)email {
    return email == nil;
}

- (void) updateDeviceAndOnline:(PPUser*)user {
    
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    
    params[@"app_uuid"] = self.appUUID;
    params[@"device_id"] = [self.utils getDeviceUUID];
    params[@"user_uuid"] = user.uuid;
    params[@"device_ostype"] = @"IOS"; // TODO get OS Type
    
    PPComAPI *api = self.api;
    [api createDevice:params completionHandler:^(NSDictionary *response, NSError *error) {
        if (!error) {
            NSString *deviceUUID = response[@"device_uuid"];
            user.deviceUuid = deviceUUID;

            // Notify we have get user info complected
            [self handleOnGetUserInfo:user];
            
            [params removeAllObjects];
            [params setObject:user.deviceUuid forKey:@"device_uuid"];
            [params setObject:@"IOS" forKey:@"device_ostype"];
            [params setObject:[NSNumber numberWithBool:YES] forKey:@"device_is_online"];
            
            [api updateDevice:params completionHandler:^(NSDictionary *response, NSError *error) {
                if (!error) {
                    
                    // 获取默认`conversation`
                    PPGetDefaultConversationHttpModels *fetchDefaultConversation = [PPGetDefaultConversationHttpModels modelWithClient:self];
                    [fetchDefaultConversation requestWithBlock:^(PPConversationItem *conversation, NSDictionary *response, NSError *error) {
                        if (conversation) {
                            [[PPStoreManager instanceWithClient:self].conversationStore addConversation:conversation];
                            self.conversationId = conversation.uuid;
                            [self handleSuccess:user conversationId:self.conversationId];
                        } else {
                            [self handleError:error with:response];
                        }
                    }];
                    
                    
                } else {
                    [self handleError:error with:nil];
                }
                
            }];
            
        } else {
            [self handleError:error with:nil];
        }
    }];
}

- (void) publishInitState:(InitializeState)state {
    self.initState = state;
}

- (void)releaseResources {
    if (self.messageReceiver) {
        [self.messageReceiver close];
    }
}

- (NSString*)description {
    return [NSString stringWithFormat:@"appUUID:%@, initState:%@", self.appUUID, [NSNumber numberWithInteger:self.initState]];
}

#pragma mark - MessageReceiverDelegate Methods

- (void)didReceiveMessage:(PPMessage *)message {
    if (self.messageDelegate) {
        [self ackMessage:message];
        if (message.illegal) {
            [self.messageDelegate onNewMessageArrived:message];
        } else {
            PPFastLog(@"Illegal message %@.", message);
        }
    }
}

-(void)didWebSocketOpen {
    [self online];
    //get unacked messages
    [self.api getUnackedMessages:@{ @"from_uuid":self.user.uuid,
                                    @"device_uuid":self.user.deviceUuid,
                                    @"app_uuid":self.appUUID }
               completionHandler:^(NSDictionary *response, NSError *error) {
        if (!error) {

            // the messages order in `msgIdsArray` is sort by `createtime` by serverside
            // @see `getunackedmessageshandler.py`
            NSArray *msgIdsArray = response[@"list"];
            
            // but the `msgList` not sorted -_-|| ...
            NSDictionary *msgList = response[@"message"];

            // So we must iterate through `msgIdsArray` get the sorted message id
            // add then get message body from `msgList`
            for (NSString *pid in msgIdsArray) {
                
                NSString *msgRawBody = msgList[pid];
                
                if ([self.utils isNotNull:msgRawBody]) {
                    NSMutableDictionary *messageDict = [NSMutableDictionary dictionaryWithDictionary:[self.utils jsonStringToDictionary:msgRawBody]];
                    messageDict[@"pid"] = pid;
                    PPMessage *message = [PPMessage messageWithClient:self body:messageDict];

                    // We consider unackedMessage as the new received message,
                    // so we let `MessageReceiver` to handle this ``new`` message
                    [self didReceiveMessage:message];

                    // Don't forget to ack this message
                    [self ackMessage:message];
                    
                }
                
            }

        }
    }];
}

-(void)didWebSocketFailWithError:(NSError*)error {

}

-(void)didWebSocketClose {
    [self offline];
}

- (void)ackMessage:(PPMessage*)message {
    if (!message.messagePushId) {
        PPFastLog(@"Message %@ push id == nil", message);
        return;
    }
    
    PPComAPI *api = self.api;
    NSDictionary *params = @{ @"list": @[ message.messagePushId ] };
    [api ackMessage:params completionHandler:nil];
}

- (void)online {
    // No need to call `PP_ONLINE` api
}

- (void)offline {
    // No need to call `PP_OFFLINE` api
}

/////////////////////
////// Getter ///////
/////////////////////

#pragma mark - Getter Methods

- (PPComAPI*)api {
    if (!_api) {
        _api = [[PPComAPI alloc] initWithClient:self];
    }
    return _api;
}

- (PPComUtils*)utils {
    if (!_utils) {
        _utils = [[PPComUtils alloc] init];
    }
    return _utils;
}

- (PPTxtLoader*)txtLoader {
    if (!_txtLoader) {
        _txtLoader = [[PPTxtLoader alloc] initWithClient:self];
    }
    return _txtLoader;
}

- (PPDownloader*)downloader {
    if (!_downloader) {
        _downloader = [[PPDownloader alloc] initWithClient:self];
    }
    return _downloader;
}

- (PPMessageSender*)messageSender {
    if (!_messageSender) {
        _messageSender = [[PPMessageSender alloc] initWithClient:self];
    }
    return _messageSender;
}

- (PPUploader*)uploader {
    if (!_uploader) {
        _uploader = [[PPUploader alloc] initWithClient:self];
    }
    return _uploader;
}

- (PPJSQAvatarLoader*)jsqAvatarLoader {
    if (!_jsqAvatarLoader) {
        _jsqAvatarLoader = [[PPJSQAvatarLoader alloc] init];
    }
    return _jsqAvatarLoader;
}

- (PPComToken*)tokenStore {
    if (!_tokenStore) {
        _tokenStore = [PPComToken tokenWithClient:self];
    }
    return _tokenStore;
}

@end
