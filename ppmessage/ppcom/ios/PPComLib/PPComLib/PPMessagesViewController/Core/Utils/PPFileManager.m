//
//  PPFileManager.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPFileManager.h"
#import "NSString+Crypto.h"

@implementation PPFileManager

#pragma mark - Write Methods

-(NSString*)writeTextToFile:(NSString *)text {
    //get the documents directory:
    NSArray *paths = NSSearchPathForDirectoriesInDomains
    (NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    
    //make a file name to write the data to using the documents directory:
    NSString *md5FileName = [[[NSDate date] description] MD5String];
    NSString *fileName = [NSString stringWithFormat:@"%@/%@.txt",
                          documentsDirectory, md5FileName];
    //create content - four lines of text
    NSString *content = text;
    //save content to the documents directory
    [content writeToFile:fileName
              atomically:NO
                encoding:NSUTF8StringEncoding
                   error:nil];
    return fileName;
}

-(void)writeTextToFile:(NSString *)text withDelegate:(void (^)(NSException *, NSString *))delegate {
    dispatch_async(dispatch_queue_create("My Queue", NULL), ^{
        NSString *filePath = nil;
        NSException *_exception = nil;
        @try {
            filePath = [self writeTextToFile:text];
        }
        @catch (NSException *exception) {
            _exception = exception;
        }
        @finally {
            
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            if (delegate) {
                delegate(_exception, filePath);
            }
        });
    });
}

#pragma mark - Read Methods

-(NSData*)readFileToBinaryData:(NSString*)fileUrl {
    
    //make a file name to write the data to using the documents directory:
    NSString *filePath = fileUrl;
    NSString *content = [[NSString alloc] initWithContentsOfFile:filePath
                                                    usedEncoding:nil
                                                           error:nil];
    return [content dataUsingEncoding:NSUTF8StringEncoding];
}

@end
