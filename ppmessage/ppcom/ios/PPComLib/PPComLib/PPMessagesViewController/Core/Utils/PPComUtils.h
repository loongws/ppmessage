//
//  PPComUtils.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/21/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPCom.h"

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

@end
