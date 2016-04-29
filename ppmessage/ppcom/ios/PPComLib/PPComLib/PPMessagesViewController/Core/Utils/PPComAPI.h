//
//  PPComAPI.h
//  OCTest
//
//  Created by Kun Zhao on 9/17/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPComNet.h"

@class PPCom;

typedef void (^PPComAPICompletedResponse)(NSDictionary* response, NSError* error);

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
- (NSDictionary*) createAnonymousUser:(NSDictionary*)params;
- (NSDictionary*) sendMessage:(NSDictionary*)params;
- (NSDictionary*) createConversation:(NSDictionary*)params;
- (NSDictionary*) getUnackedMessages:(NSDictionary*)params;

//------------------------
//async post
//------------------------

- (void) getConversationList:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) getUserUuid:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) getUserDetailInfo:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) ackMessage:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) getMessageHistory:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) createDevice:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) updateDevice:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) createAnonymousUser:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) sendMessage:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) createConversation:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) getUnackedMessages:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) getAppInfo:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) getDefaultConversation:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) getAppOrgGroupList:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;
- (void) getConversationUserList:(NSDictionary*)params completionHandler:(PPComAPICompletedResponse)handler;

@end
