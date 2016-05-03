//
//  PPComImageCache.m
//  OCTest
//
//  Created by Kun Zhao on 9/17/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPComImageCache.h"
#import "NSString+Crypto.h"

@interface PPComImageCache ()

@property NSString* dataPath;

- (void) initDiskCache;
- (id) getFromDisk:(id)key;
- (void) putToDisk:(id)obj forKey:(id)key;

@end

@implementation PPComImageCache

/*
 ------------------------------------------------------------------------
 Private methods used only in this file
 ------------------------------------------------------------------------
 */

- (void) initDiskCache {
    /* create path to cache directory inside the application's Documents directory */
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    self.dataPath = [[paths objectAtIndex:0] stringByAppendingPathComponent:@"URLCache"];
    
    /* check for existence of cache directory */
    if ([[NSFileManager defaultManager] fileExistsAtPath:self.dataPath]) {
        return;
    }
    
    /* create a new cache directory */
    if (![[NSFileManager defaultManager] createDirectoryAtPath:self.dataPath
                                   withIntermediateDirectories:NO
                                                    attributes:nil
                                                         error:nil]) {
        //TODO Alert Error
        return;
    }
}

// get from disk

- (id) getFromDisk:(id)key {
    NSString *strKey = (NSString*)key;
    NSString *filePath = [self.dataPath stringByAppendingPathComponent:[strKey MD5String]];
    if ([[NSFileManager defaultManager] fileExistsAtPath:filePath]) {
        return filePath;
    }
    return nil;
}

// set obj to disk

- (void) putToDisk:(id)obj forKey:(id)key {
    NSString *strKey = (NSString*)key;
    NSString *filePath = [self.dataPath stringByAppendingPathComponent:[strKey MD5String]];
    
    /* file exist, return */
    if ([[NSFileManager defaultManager] fileExistsAtPath:filePath] == YES) {
        return;
    }
    
    /* file doesn't exist, so create it */
    if ([[NSFileManager defaultManager] fileExistsAtPath:filePath] == NO) {
        [[NSFileManager defaultManager] createFileAtPath:filePath contents:(NSData*)obj attributes:nil];
    }
}

@end
