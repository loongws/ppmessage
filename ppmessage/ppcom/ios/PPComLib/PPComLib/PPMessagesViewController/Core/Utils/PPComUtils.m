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

#ifdef PP_LOCAL_DEBUG

NSString *const PPApiHost = @"http://192.168.0.206:8080/api";
NSString *const PPFileHost = @"http://192.168.0.206:8080/download/";
NSString *const PPWebSocketHost = @"ws://192.168.0.206:8080/pcsocket/WS";
NSString *const PPFileUploadHost = @"http://192.168.0.206:8080/upload";
NSString *const PPTxtUploadHost = @"http://192.168.0.206:8080/upload";
NSString *const PPAuthHost = @"http://192.168.0.206:8080/ppauth";
NSString *const PPApiKey = @"M2IzMzVjNTAzZTIyYjJkZGQ2YmMxODFjN2E1ZGExMGQyNDY1MDc5NA==";
NSString *const PPApiSecret = @"NjYwMTU5MzYzMTg0NGVjZGU5YmYyZWM3OWYwMWNmNGM3YWJmOWYyMg==";

#else

NSString *const PPApiHost = @"https://ppmessage.com/api";
NSString *const PPFileHost = @"https://ppmessage.com/download/";
NSString *const PPWebSocketHost = @"wss://ppmessage.com/pcsocket/WS";
NSString *const PPFileUploadHost = @"https://ppmessage.com/upload";
NSString *const PPTxtUploadHost = @"https://ppmessage.com/upload";
NSString *const PPAuthHost = @"https://ppmessage.com/ppauth";
NSString *const PPApiKey = @"M2E2OTRjZTQ5Mzk4ZWUxYzRjM2FlZDM2NmE4MjA4MzkzZjFjYWQyOA==";
NSString *const PPApiSecret = @"ZThmMTM1ZDM4ZmI2NjE1YWE0NWEwMGM3OGNkMzY5MzVjOTQ2MGU0NQ==";

#endif

#pragma mark - Private

NSTimeZone* pp_timeZone() {
    static dispatch_once_t onceToken;
    static NSTimeZone *timeZone;
    dispatch_once(&onceToken, ^{
        timeZone = [NSTimeZone localTimeZone];
    });
    return timeZone;
}

NSDateFormatter* pp_dateFormatter(NSString *formatStyle) {
    static dispatch_once_t onceToken;
    static NSDateFormatter *dateFormatter;
    dispatch_once(&onceToken, ^{
        dateFormatter = [NSDateFormatter new];
    });
    dateFormatter.timeZone = pp_timeZone();
    dateFormatter.dateFormat = formatStyle;
    return dateFormatter;
}

NSCalendar* pp_calendar() {
    static dispatch_once_t onceToken;
    static NSCalendar *calendar;
    dispatch_once(&onceToken, ^{
        calendar = [[NSCalendar alloc]initWithCalendarIdentifier:NSCalendarIdentifierGregorian];
    });
    calendar.timeZone = pp_timeZone();
    return calendar;
}

BOOL pp_isCurrentYear(NSCalendar *calendar, NSDate *date) {
    NSInteger currentYear = [calendar component:NSCalendarUnitYear fromDate:[NSDate date]];
    NSInteger otherYear = [calendar component:NSCalendarUnitYear fromDate:date];
    return otherYear == currentYear;
}

#pragma mark -

static NSDateFormatter *PPDateFormatter = nil;

BOOL pp_validateUrl(NSString *candidate) {
    NSString *urlRegEx =
    @"^(http|https)://.*";
    NSPredicate *urlTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", urlRegEx];
    return [urlTest evaluateWithObject:candidate];
}

NSDateFormatter* getDateFormatter() {
    if (!PPDateFormatter) {
        PPDateFormatter = [[NSDateFormatter alloc] init];
    }
    return PPDateFormatter;
}

NSString* PPSafeString(NSString *str) {
    if (PPIsNull(str)) {
        return @"";
    }
    return str;
}

BOOL PPIsNull(NSString* str) {
    return !str || str == (id)[NSNull null] || ( [str isKindOfClass:[NSString class]] && ([str isEqualToString:@"(null)"] || [str isEqualToString:@"<null>"] || [str isEqualToString:@""] ) );
}

BOOL PPIsNotNull(NSString *str) {
    return !PPIsNull(str);
}

NSString* PPFileUrl(NSString *fileId) {
    if (PPIsNull(fileId)) return nil;
    if (pp_validateUrl(fileId)) return fileId;
    
    return [NSString stringWithFormat:@"%@%@", PPFileHost, fileId];
}

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
    return PPIsNull(str);
}

- (BOOL) isNotNull:(NSString*)str {
    return PPIsNotNull(str);
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

- (NSString*) getFileURL:(NSString *)fileId {
    return PPFileUrl(fileId);
}

- (double)timestampFromString:(NSString *)timestampString {
    NSDateFormatter *dateFormatter = getDateFormatter();
    dateFormatter.dateFormat = @"yyyy-MM-dd HH:mm:ss";
    
    NSString *removeLast7CharsString = [timestampString substringToIndex:19];
    NSDate *date = [PPDateFormatter dateFromString:removeLast7CharsString];
    
    long timestamp = (long)(date.timeIntervalSince1970);
    return timestamp;
}

NSString* PPFormatTimestampToHumanReadableStyle(double timestamp, BOOL withHHMMSS) {
    NSDate *otherDate = [NSDate dateWithTimeIntervalSince1970:(NSTimeInterval)timestamp];
    
    NSDateFormatter *dateFormatter = pp_dateFormatter(@"HH:mm:ss");
    
    NSCalendar *calendar = pp_calendar();
    if ([calendar isDateInToday:otherDate]) {
        return [dateFormatter stringFromDate:otherDate];
    }
    
    BOOL isSameYear = pp_isCurrentYear(calendar, otherDate);
    
    if (!withHHMMSS) {
        dateFormatter = pp_dateFormatter(isSameYear ? @"MM-dd" : @"yyyy-MM-dd");
    } else {
        dateFormatter = pp_dateFormatter(isSameYear ? @"MM-dd HH:mm" : @"yyyy-MM-dd HH:mm");
    }
    
    return [dateFormatter stringFromDate:otherDate];
}

UIImage* PPImageFromAssets(NSString* imagePathWithOutSuffix) {
    return [UIImage imageNamed:[NSString stringWithFormat:@"PPComLib.bundle/%@", imagePathWithOutSuffix]];
}

UIImage* PPDefaultAvatarImage() {
    return PPImageFromAssets(@"pp_icon_avatar");
}

BOOL PPIsApiResponseEmpty(NSDictionary* apiResponse) {
    if (!apiResponse) return YES;
    if ([apiResponse[@"error_code"] integerValue] != 0) return NO;
    
    NSMutableDictionary *copied = [NSMutableDictionary dictionaryWithDictionary:[apiResponse copy]];
    [copied removeObjectForKey:@"error_code"];
    [copied removeObjectForKey:@"error_string"];
    [copied removeObjectForKey:@"uri"];
    
    return copied.count == 0;
}

@end
