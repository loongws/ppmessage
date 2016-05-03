//
//  PPConversationItem.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/25/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "PPCom.h"

typedef NS_ENUM(NSInteger, PPConversationItemType) {
    PPConversationItemTypeUnknown,
    PPConversationItemTypeGroup,
    PPConversationItemTypeS2P,
    PPConversationITemTypeP2S
};

@interface PPConversationItem : NSObject

@property (nonatomic) NSString *uuid;
@property (nonatomic) NSString *groupUUID;

@property (nonatomic) NSString *userAvatar;
@property (nonatomic) NSString *userName;
@property (nonatomic) long messageTimestamp;
@property (nonatomic) NSString *messageSummary;

@property (nonatomic) UIImage *userAvatarImage;
@property (nonatomic) NSString *userAvatarUrl;
@property (nonatomic) NSString *assignedUUID;

@property (nonatomic) PPConversationItemType conversationItemType;

+ (instancetype)itemWithClient:(PPCom*)client body:(NSDictionary*)conversationBody;
+ (instancetype)itemWithClient:(PPCom*)client withMessageBody:(PPMessage*)message;

/**
 * 该方法用来解析由`/PP_GET_USER_CONVERSATION_LIST`接口返回的结果，暂不清楚其余接口返回的数据格式是否能够正确解析
 *
 * 数据形式如下(其余字段已经选择性忽略)：
 * {
 *     conversation_icon: xxx,
 *     conversation_name: xxx,
 *     conversation_type: P2S,
 *     assigned_uuid: xxx,
 *     createtime: '2016-03-31 19:02:20 001627',
 *     updatetime: '2016-03-31 19:32:36 195771',
 *     user_uuid: xxx,
 *     uuid: xxx,
 *     from_user: { 后台显示这个就是创建者的信息,并不是最后一条信息的用户
 *         user_fullname: xxx,
 *         user_icon: xxx,
 *         uuid: xxx
 *     },
 *     latest_message: {
 *         message_body: xxx
 *     }
 * }
 *
 */
+ (instancetype)itemWithClient:(PPCom*)client content:(NSDictionary*)contentBody;

/**
 * 该方法用来解析由`/PP_GET_APP_ORG_GROUP_LIST`生成的结果，暂不清楚是否可以解析其它的
 * 数据形式如下：
 * {
 "app_uuid" = "7c144f63-f728-11e5-9b10-acbc327f19e9";
 "conversation_uuid" = "<null>";
 createtime = "2016-04-12 19:11:38 781310";
 "group_desc" = 123;
 "group_icon" = "http://192.168.0.206:8080/identicon/6737e3e5068c84afa96c9e5664078c6537f396ec.png";
 "group_name" = "\U5206\U7ec41";
 "group_route_algorithm" = broadcast;
 "group_visible_for_ppcom" = True;
 "group_visible_order_for_ppcom" = 1;
 "group_work_time_str" = "09:00-18:00";
 updatetime = "2016-04-12 19:11:49 673076";
 "user_count" = 2;
 uuid = "53d20747-009f-11e6-87fb-acbc327f19e9";
 }
 *
 */
+ (instancetype)itemWithClient:(PPCom*)client group:(NSDictionary*)groupBody;

//解析由/PP_CREATE_CONVERSATION返回的response:
//
//{
//    "app_uuid" = "7c144f63-f728-11e5-9b10-acbc327f19e9";
//    "assigned_uuid" = "<null>";
//    "conversation_icon" = "http://192.168.0.206:8080/identicon/f26c895179b41edad150f9fe0a516c160b9f843c.png";
//    "conversation_name" = "\U5206\U7ec41";
//    "conversation_type" = P2S;
//    createtime = "2016-04-13 10:47:57 691236";
//    "error_code" = 0;
//    "error_string" = "success.";
//    "group_uuid" = "53d20747-009f-11e6-87fb-acbc327f19e9";
//    status = NEW;
//    updatetime = "2016-04-13 10:47:57 691231";
//    uri = "/PP_CREATE_CONVERSATION";
//    "user_list" = (
//        "41c0ac2e-009f-11e6-a12b-acbc327f19e9",
//        "7c11ec6b-f728-11e5-9dbf-acbc327f19e9"
//    );
//    "user_uuid" = "0e615f61-ffd3-11e5-b692-acbc327f19e9";
//    uuid = "211216c5-0122-11e6-84b4-acbc327f19e9";
//}
+ (instancetype)itemWithClient:(PPCom*)client contentFromCreateConversation:(NSDictionary*)body;

- (instancetype)initWithClient:(PPCom*)client conversationId:(NSString*)conversationId;
- (instancetype)initWithClient:(PPCom*)client conversationId:(NSString*)conversationId date:(NSDate*)date;

/**
 * 万能方法：所有构造函数最终都会调用这个
 */
- (instancetype)initWithClient:(PPCom*)client
                      withUUID:(NSString*)conversationUUID
                   withIconUrl:(NSString*)conversationIconUrl
                      withName:(NSString*)conversationName
                 withTimestamp:(long)timestamp
                   withSummary:(NSString*)messageSummary
                      withType:(PPConversationItemType)conversationType
                withAssignUUID:(NSString*)assignUUID;

- (NSComparisonResult)compare:(PPConversationItem*)other;

@end
