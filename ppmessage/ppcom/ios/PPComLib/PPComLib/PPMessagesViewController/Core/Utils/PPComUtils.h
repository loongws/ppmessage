//
//  PPComUtils.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/21/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPCom.h"

//#define PP_LOCAL_DEBUG

extern NSString *const PPApiHost;
extern NSString *const PPFileHost;
extern NSString *const PPWebSocketHost;
extern NSString *const PPFileUploadHost;
extern NSString *const PPTxtUploadHost;
extern NSString *const PPAuthHost;
extern NSString *const PPApiKey;
extern NSString *const PPApiSecret;

NSString* PPSafeString(NSString *str);

/**
 * We consider `nil`, `[NSNull null]`, `<null>`, `(null)` as `Null`
 */
BOOL PPIsNull(NSString* str);
BOOL PPIsNotNull(NSString *str);

NSString *PPFileUrl(NSString* fileId);

@interface PPComUtils : NSObject

/**
 * Convert dictionary to json string
 */
- (NSString*) dictionaryToJsonString:(NSDictionary*)dictionary;

/**
 * Convert json string to dictionary
 */
- (NSDictionary*) jsonStringToDictionary:(NSString*)jsonString;

/**
 * Check is str == null
 */
- (BOOL) isNull:(NSString*)str;

/**
 * Check is str != nil
 */
- (BOOL) isNotNull:(NSString*)str;

/**
 * Convert UTF-8 encoded NSData to NSString
 */
- (NSString*) dataToString:(NSData*)data;

/**
 * Convert timestamp to Date
 */
- (NSDate*) timestampToDate:(long)timestamp;

/**
 * @return the unique ios device uuid
 */
- (NSString*) getDeviceUUID;

/**
 * @return a random uuid string
 */
- (NSString*) getRandomUUID;

/**
 * @return timestamp 距离当前时间过去了多长时间的字符串表示
 */
- (NSString*) getElapsedTimestampInStr:(long)timestamp;

/**
 * @return file url
 */
- (NSString*) getFileURL:(NSString*)fileId;

/**
 * @description
 *  将服务器返回的时间格式字符串：`2016-02-20 16:51:43 256237` 解析成对应的 timestamp，最后7位" 256237"将会舍去
 *  字符串长度必须是26，最终生成的timestamp是解析前19位而成的
 *  单位是秒
 */
- (double)timestampFromString:(NSString*)timestampString;

/**
 * @param withHHMMSS 是否带有具体的时间，如果YES: 那么返回 `日期 时间`这样的格式；如果NO: 那么返回`日期`这样的格式
 *                   (如果是同一天，那么不管有没有设置，都会返回`时间`这样的格式）
 */
NSString* PPFormatTimestampToHumanReadableStyle(double timestamp, BOOL withHHMMSS);

/**
 * Fetch image by path
 *
 * @imagePathWithOutSuffix you should provided `aa` instead of `aa.png` when you want to get `aa.png` image
 */
UIImage* PPImageFromAssets(NSString* imagePathWithOutSuffix);
UIImage* PPDefaultAvatarImage();

@end
