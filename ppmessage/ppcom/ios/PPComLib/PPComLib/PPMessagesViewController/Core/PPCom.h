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

@class PPTxtLoader;
@class PPUser;
@class PPComUtils;
@class PPDownloader;
@class PPMessageSender;
@class PPMessage;
@class PPMessageReceiver;
@class PPUploader;
@class PPDataCache;
@class PPAppInfo;

/** PPCom Message Delegate **/

@protocol PPComMessageDelegate <NSObject>

/**
 * OnNewMessageArrived Callback
 */
-(void)onNewMessageArrived:(PPMessage*)message;

@end

/** PPCom Initialize Delegate **/
@protocol PPComInitializeDelegate <NSObject>

@required
- (void)onInitSuccess:(PPUser*)user conversationId:(NSString *)conversationId;

@optional
- (void)onGetUserInfo:(PPUser*)user;
- (void)onInitError:(NSError*)error with:(NSDictionary *)errorResponse;

@end

@interface PPCom: NSObject

@property PPAppInfo *appInfo;

@property (nonatomic, weak) id<PPComInitializeDelegate> initDelegate;
@property (nonatomic, weak) id<PPComMessageDelegate> messageDelegate;

@property NSString *appKey;
@property NSString *appSecret;
@property PPUser *user;
@property NSString *conversationId;

@property (nonatomic) PPTxtLoader *txtLoader;
@property (nonatomic) PPComAPI *api;
@property (nonatomic) PPComUtils *utils;
@property (nonatomic) PPDownloader *downloader;
@property (nonatomic) PPMessageSender *messageSender;
@property (nonatomic) PPUploader *uploader;
@property (nonatomic) PPDataCache *dataStorage;
@property (nonatomic) PPJSQAvatarLoader *jsqAvatarLoader;

+ (PPCom*)instance;
+ (PPCom*)instanceWithAppKey:(NSString*)key withSecret:(NSString*)secret;

- (void)initilize:(NSString*)email;
- (void)initilize:(NSString *)email withDelegate:(id<PPComInitializeDelegate>)delegate;

- (void)releaseResources;

@end
