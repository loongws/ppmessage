//
//  PPComAPI.m
//  OCTest
//
//  Created by Kun Zhao on 9/17/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPComAPI.h"

#define REQUEST_GET_PORTAL_USER_CONVERSATION_LIST @"/PP_GET_PORTAL_USER_CONVERSATION_LIST"
#define REQUEST_GET_USER_UUID @"/PP_GET_USER_UUID"
#define REQUEST_GET_YVOBJECT_DETAIL @"/GET_YVOBJECT_DETAIL"
#define REQUEST_ACK_MESSAGE @"/ACK_MESSAGE"
#define REQUEST_GET_HISTORY_MESSAGE @"/PP_GET_HISTORY_MESSAGE"
#define REQUEST_CREATE_DEVICE @"/PP_CREATE_DEVICE"
#define REQUEST_UPDATE_DEVICE @"/PP_UPDATE_DEVICE"
#define REQUEST_ONLINE @"/PP_ONLINE"
#define REQUEST_OFFLINE @"/PP_OFFLINE"
#define REQUEST_CREATE_ANONYMOUS @"/PP_CREATE_ANONYMOUS"
#define REQUEST_SEND_MESSAGE @"/PP_SEND_MESSAGE"
#define REQUEST_CREATE_CONVERSATION @"/PP_CREATE_CONVERSATION"
#define REQUEST_GET_UNACKED_MESSAGES @"/GET_UNACKED_MESSAGES"
#define REQUEST_GET_APP_INFO @"/PP_GET_APP_INFO"

@interface PPComAPI ()
@property PPCom *client;
@end

@implementation PPComAPI

- (instancetype)initWithClient:(PPCom *)client {
    if (self = [super initWithClient:client]) {
        self.client = client;
    }
    return self;
}

+ (instancetype)apiWithClient:(PPCom*)client {
    return [[PPComAPI alloc] initWithClient:client];
}

// get conversation lists by `user_uuid:xxx`

- (NSDictionary*) getConversationList:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_GET_PORTAL_USER_CONVERSATION_LIST];
}

// get user uuid by `user_email:xxx@xxx.com`

- (NSDictionary*) getUserUuid:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_GET_USER_UUID];
}

// get user detail info by `type:DU`, `uuid:xxx`

- (NSDictionary*) getUserDetailInfo:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_GET_YVOBJECT_DETAIL];
}

// ack message by `uuid:message_push_uuid`

- (NSDictionary*) ackMessage:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_ACK_MESSAGE];
}

// get message history by
// `conversation_uuid: xxx`,
// `page_offset: xxx`,
// `page_size: xxx`,
// `max_id: xxx`,
// `since_id: xxx`,

- (NSDictionary*) getMessageHistory:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_GET_HISTORY_MESSAGE];
}

// create device by `user_uuid:xxx`, `device_id:xxx`

- (NSDictionary*) createDevice:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_CREATE_DEVICE];
}

// update device by `device_ostype:IOS`, `device_uuid:xxx`

- (NSDictionary*) updateDevice:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_UPDATE_DEVICE];
}

// make this user online by `user_uuid:xxx`, `device_uuid:xxx`

- (NSDictionary*) online:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_ONLINE];
}

// make this user offline by `user_uuid:xxx`, `device_uuid:xxx`

- (NSDictionary*) offline:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_OFFLINE];
}

// create an anonymous user by `pp_trace_uuid`

- (NSDictionary*) createAnonymousUser:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_CREATE_ANONYMOUS];
}

// send message to server by ...

- (NSDictionary*) sendMessage:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_SEND_MESSAGE];
}

// create a conversation by `conversation_type:S2P`, `user_uuid:xxx`

- (NSDictionary*) createConversation:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_CREATE_CONVERSATION];
}

// get unacked messages by `from_uuid:xxx`, `device_uuid: xxx`

- (NSDictionary*) getUnackedMessages:(NSDictionary *)params {
    return [self post:params urlSegment:REQUEST_GET_UNACKED_MESSAGES];
}

//------------------------
//async post
//------------------------

// get conversation lists by `user_uuid:xxx`

- (void) getConversationList:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_GET_PORTAL_USER_CONVERSATION_LIST completionHandler:handler];
}

- (void) getUserUuid:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_GET_USER_UUID completionHandler:handler];
}

- (void) getUserDetailInfo:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_GET_YVOBJECT_DETAIL completionHandler:handler];
}

- (void) ackMessage:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_ACK_MESSAGE completionHandler:handler];
}

- (void) getMessageHistory:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_GET_HISTORY_MESSAGE completionHandler:handler];
}

- (void) createDevice:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_CREATE_DEVICE completionHandler:handler];
}

- (void) updateDevice:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_UPDATE_DEVICE completionHandler:handler];
}

- (void) online:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_ONLINE completionHandler:handler];    
}

- (void) offline:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_OFFLINE completionHandler:handler];    
}

- (void) createAnonymousUser:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_CREATE_ANONYMOUS completionHandler:handler];        
}

- (void) sendMessage:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_SEND_MESSAGE completionHandler:handler];            
}

- (void) createConversation:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_CREATE_CONVERSATION completionHandler:handler];
}

- (void) getUnackedMessages:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_GET_UNACKED_MESSAGES completionHandler:handler];    
}

// { app_key: xxx }
- (void) getAppInfo:(NSDictionary*)params completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    return [self asyncPost:params urlSegment:REQUEST_GET_APP_INFO completionHandler:handler];        
}

@end
