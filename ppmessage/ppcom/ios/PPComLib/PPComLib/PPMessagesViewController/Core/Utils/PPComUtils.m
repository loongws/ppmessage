//
//  PPComUtils.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/21/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <UIKit/UIDevice.h>
#import "PPComUtils.h"
#import "NSString+Crypto.h"

@implementation PPComUtils

- (NSString*) dictionaryToJsonString:(NSDictionary*)dictionary {
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictionary
                                                       options:NSJSONWritingPrettyPrinted
                                                         error:nil];
    return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

- (NSDictionary*) jsonStringToDictionary:(NSString*)jsonString {
    NSError *jsonError;
    NSData *objectData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:objectData
                                                         options:NSJSONReadingMutableContainers
                                                           error:&jsonError];
    if (jsonError) {
        NSLog(@"%@ to dictionary error: %@.", jsonString, jsonError);
        return nil;
    }
    
    return json;
}

- (BOOL) isNull:(NSString*)str {
    return !str || str == (id)[NSNull null];
}

- (BOOL) isNotNull:(NSString*)str {
    return ![self isNull:str];
}

- (NSString*) dataToString:(NSData*)data {
    return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
}

- (NSDate*) timestampToDate:(long)timestamp {
    NSDate *date = [NSDate dateWithTimeIntervalSince1970:timestamp];
    return date;
}

- (NSString*) getDeviceUUID {
    NSString *deviceUUID = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    return deviceUUID;
}

- (NSString*) getRandomUUID {
    return [[NSUUID UUID] UUIDString];
}

- (NSString*) getElapsedTimestampInStr:(long)timestamp {
    NSDate *current = [NSDate date];
    long time = (long)[current timeIntervalSince1970];
    long diff = time - timestamp;
    
    if (diff < 5) {
        return @"just now";
    } else if (diff < 60) {
        return [NSString stringWithFormat:@"%lds ago", diff];
    } else if (diff < 3600) {
        return [NSString stringWithFormat:@"%ldm ago", diff / 60];
    } else if (diff < 86400) {
        return [NSString stringWithFormat:@"%ldh ago", diff / 3600];
    } else if (diff < 604800) {
        return [NSString stringWithFormat:@"%ldd ago", diff / 86400];
    } else if (diff < 31449600) {
        return [NSString stringWithFormat:@"%ldw ago", diff / 604800];
    } else {
        return [NSString stringWithFormat:@"%ldy ago", diff / 31449600];
    }
}

@end
