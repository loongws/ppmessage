//
//  PPCom.h
//  OCTest
//
//  Created by Kun Zhao on 9/17/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPComAPI.h"
#import "PPJSQAvatarLoader.h"

#import "PPWebSocketHandlerFactory.h"

@class PPTxtLoader;
@class PPUser;
@class PPComUtils;
@class PPDownloader;
@class PPMessageSender;
@class PPMessage;
@class PPMessageReceiver;
@class PPUploader;
@class PPAppInfo;

typedef NS_ENUM(NSInteger, InitializeState) {
    
    // init error or not inited
    InitializeStateNull = 0,
    
    // initing
    InitializeStateIniting = 1,
    
    // inited success
    InitializeStateInited = 2,
    
};

/** PPCom Message Delegate **/

@protocol PPComMessageDelegate <NSObject>

- (void)onWSMsgArrived:(id)obj msgType:(PPWebSocketMsgType)msgType;

@end

/** PPCom Initialize Delegate **/
@protocol PPComInitializeDelegate <NSObject>

@required
- (void)onInitSuccess:(PPUser*)user;

@optional
- (void)onGetUserInfo:(PPUser*)user;
- (void)onInitError:(NSError*)error with:(NSDictionary *)errorResponse;

@end

@interface PPCom: NSObject

@property PPAppInfo *appInfo;

@property (nonatomic, weak) id<PPComInitializeDelegate> initDelegate;
@property (nonatomic, weak) id<PPComMessageDelegate> messageDelegate;

@property PPUser *user;

@property (nonatomic) InitializeState initState;

@property (nonatomic) PPTxtLoader *txtLoader;
@property (nonatomic) PPComAPI *api;
@property (nonatomic) PPComUtils *utils;
@property (nonatomic) PPDownloader *downloader;
@property (nonatomic) PPMessageSender *messageSender;
@property (nonatomic) PPMessageReceiver *messageReceiver;
@property (nonatomic) PPUploader *uploader;
@property (nonatomic) PPJSQAvatarLoader *jsqAvatarLoader;

+ (PPCom*)instance;
+ (PPCom*)instanceWithAppUUID:(NSString*)appUUID;

- (void)initilize:(NSString*)email;
- (void)initilize:(NSString *)email withDelegate:(id<PPComInitializeDelegate>)delegate;

- (void)releaseResources;

@end
