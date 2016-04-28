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

#define ANONYMOUS_USER_TRACK_ID @"anonymous_track_id"

@class PPComAPI;

@interface PPCom () <PPMessageReceiverDelegate>

typedef NS_ENUM(NSInteger, InitializeState) {
    
    // init error or not inited
    InitializeStateNull = 0,
    
    // initing
    InitializeStateIniting = 1,
    
    // inited success
    InitializeStateInited = 2,
    
};

@property InitializeState initState;
@property PPMessageReceiver *messageReceiver;

- (void) getAppInfo: (NSString *) appKey completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) initWithAnonymousUser;
- (void) initWithEmailUser:(NSString*)email;
- (NSString*) getAnonymousUserTrackId;
- (void) storeAnonymousUserTrackId:(NSString*)trackId;
- (BOOL) isAnonymous:(NSString*)email;
- (void) updateDeviceAndOnline:(PPUser*)user;
- (void) asyncGetConversationId: (NSString*)userId withHandler:(void(^)(NSString *conversationId, NSDictionary *response, NSError *error))handler;

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

static PPCom* instance = nil;

+ (PPCom*)instance {
    if (!instance) {
        instance = [[PPCom alloc] init];
    }
    return instance;
}

+ (PPCom*)instanceWithAppKey:(NSString*)key withSecret:(NSString*)secret {
    PPCom *com = [self instance];
    com.appKey = key;
    com.appSecret = secret;
    
    return com;
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

    // get imapp info first
    [self getAppInfo:self.appKey completionHandler:^(NSDictionary *response, NSError *error) {
            
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

- (void)initilize:(NSString *)email withDelegate:(id<PPComInitializeDelegate>)delegate {
    _initDelegate = delegate;
    [self initilize:email];
}

- (void) getAppInfo: (NSString *) appKey completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    params[@"app_key"] = appKey;
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
            
            [api updateDevice:params completionHandler:^(NSDictionary *response, NSError *error) {
                if (!error) {
                    
                    // try get conversation
                    [self asyncGetConversationId:user.uuid withHandler:^(NSString *conversationId, NSDictionary *response, NSError *error) {
                        if ( conversationId != nil ) {
                            self.conversationId = conversationId;
                            [ self handleSuccess:user conversationId:conversationId ];
                        } else {
                            [ self handleError:error with:response ];
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

- (void) asyncGetConversationId:(NSString *)userId withHandler:(void (^)(NSString *, NSDictionary *response, NSError *error))handler {
    
    NSMutableDictionary *params = [ NSMutableDictionary dictionaryWithCapacity:(NSUInteger)4 ];
    params[@"user_uuid"] = userId;
    params[@"app_uuid"] = self.appInfo.appId;
    
    [self.api getConversationList:params completionHandler:^(NSDictionary *response, NSError *error) {

            if ( error ) {
                if (handler != nil) handler ( nil, nil, error );
                return;
            }
        
            // no error
            if ( [ response[@"error_code"] integerValue ] == 0) {

                NSArray *conversationList = response[@"list"];
                if ( conversationList.count > 0 ) { // get the first conversation as our conversation
                
                    if ( handler != nil ) handler ( conversationList[0][@"uuid"], response, nil );
                
                } else {
                
                    // we have to create a new one
                    params[@"conversation_type"] = @"P2S";
                    [self.api createConversation:params completionHandler:^(NSDictionary *response, NSError *error) {

                            if (!error) {
                                if ( [response[@"error_code"] integerValue] == 0 ) {
                                    if ( handler != nil ) handler ( response[@"conversation_uuid"], response, nil );
                                } else {
                                    if ( handler != nil ) handler ( nil, response, nil );
                                }
                            } else {
                                if ( handler != nil) handler ( nil, nil, error );
                            }

                        }];
                }
            
            } else {

                if ( handler != nil ) handler ( nil, response, nil );
                
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
    return [NSString stringWithFormat:@"appKey:%@, appSecret:%@", self.appKey, self.appSecret];
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
    [self.api getUnackedMessages:@{@"from_uuid":self.user.uuid, @"device_uuid":self.user.deviceUuid} completionHandler:^(NSDictionary *response, NSError *error) {
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
    NSDictionary *params = @{@"uuid":message.messagePushId};
    [api ackMessage:params completionHandler:nil];
}

- (void)online {
    if (self.user) {
        NSDictionary *params = @{@"user_uuid":self.user.uuid, @"device_uuid":self.user.deviceUuid};
        [self.api online:params completionHandler:^(NSDictionary *response, NSError *error) {
        }];
    }
}

- (void)offline {
    if (self.user) {
        NSDictionary *params = @{@"user_uuid":self.user.uuid, @"device_uuid":self.user.deviceUuid};
        [self.api offline:params completionHandler:^(NSDictionary *response, NSError *error) {
        }];
    }
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

- (PPDataCache*)dataStorage {
    if (!_dataStorage) {
        _dataStorage = [[PPDataCache alloc] init];
    }
    return _dataStorage;
}

- (PPJSQAvatarLoader*)jsqAvatarLoader {
    if (!_jsqAvatarLoader) {
        _jsqAvatarLoader = [[PPJSQAvatarLoader alloc] init];
    }
    return _jsqAvatarLoader;
}

@end
