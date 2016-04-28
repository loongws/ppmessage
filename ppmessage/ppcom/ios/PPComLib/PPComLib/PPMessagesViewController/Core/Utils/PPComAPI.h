//
//  PPComAPI.h
//  OCTest
//
//  Created by Kun Zhao on 9/17/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPComNet.h"
@class PPCom;

@interface PPComAPI : PPComNet

+ (instancetype)apiWithClient:(PPCom*)client;

//------------------------
//sync post
//------------------------

- (NSDictionary*) getConversationList:(NSDictionary*)params;
- (NSDictionary*) getUserUuid:(NSDictionary*)params;
- (NSDictionary*) getUserDetailInfo:(NSDictionary*)params;
- (NSDictionary*) ackMessage:(NSDictionary*)params;
- (NSDictionary*) getMessageHistory:(NSDictionary*)params;
- (NSDictionary*) createDevice:(NSDictionary*)params;
- (NSDictionary*) updateDevice:(NSDictionary*)params;
- (NSDictionary*) online:(NSDictionary*)params;
- (NSDictionary*) offline:(NSDictionary*)params;
- (NSDictionary*) createAnonymousUser:(NSDictionary*)params;
- (NSDictionary*) sendMessage:(NSDictionary*)params;
- (NSDictionary*) createConversation:(NSDictionary*)params;
- (NSDictionary*) getUnackedMessages:(NSDictionary*)params;

//------------------------
//async post
//------------------------

- (void) getConversationList:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) getUserUuid:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) getUserDetailInfo:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) ackMessage:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) getMessageHistory:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) createDevice:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) updateDevice:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) online:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) offline:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) createAnonymousUser:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) sendMessage:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) createConversation:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) getUnackedMessages:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;
- (void) getAppInfo:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler;

@end
