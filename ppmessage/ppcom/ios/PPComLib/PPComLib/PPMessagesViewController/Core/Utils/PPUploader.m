//
//  PPUploader.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPUploader.h"
#import "PPFileManager.h"
#import "PPComUtils.h"

@interface PPUploader ()

@property PPCom *client;
@property (nonatomic) PPFileManager *fileManager;

-(NSString*)uploadFile:(NSString*)fileUrl host:(NSString*)hostUrl;

@end

@implementation PPUploader

#pragma mark - Initiazlie Methods

-(instancetype)initWithClient:(PPCom *)client {
    if (self = [super initWithClient:client]) {
        _client = client;
    }
    return self;
}

#pragma mark - Getter Methods

-(PPFileManager*)fileManager {
    if (_fileManager == nil) {
        _fileManager = [[PPFileManager alloc] init];
    }
    return _fileManager;
}

#pragma mark - Upload Methods

-(void)uploadTxt:(NSString *)text withDelegate:(void (^)(NSError *, NSDictionary *))delegate {
    [self.fileManager writeTextToFile:text withDelegate:^(NSException *exception, NSString *filePath) {
        if (!exception) {
            [self uploadFile:filePath withDelegate:delegate];
        } else {
            if (delegate != nil) {
                NSError *error = [[NSError alloc] init];
                delegate(error, nil);
            }
        }
    }];
}

-(void)uploadFile:(NSString *)fileUrl withDelegate:(void (^)(NSError *, NSDictionary *))delegate {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSString *jsonResponse = [self uploadFile:fileUrl host:PPFileUploadHost];
        dispatch_async(dispatch_get_main_queue(), ^{
            if (delegate) {
                delegate(nil, [self.client.utils jsonStringToDictionary:jsonResponse]);
            }
        });
    });
}

-(NSString*)uploadFile:(NSString*)fileUrl host:(NSString*)hostUrl {
    NSString *urlString = hostUrl;
    NSString *filename = fileUrl;
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL:[NSURL URLWithString:urlString]];
    [request setHTTPMethod:@"POST"];
    NSString *boundary = @"---------------------------14737809831466499882746641449";
    NSString *contentType = [NSString stringWithFormat:@"multipart/form-data; boundary=%@",boundary];
    [request addValue:contentType forHTTPHeaderField: @"Content-Type"];
    NSMutableData *postbody = [NSMutableData data];
    [postbody appendData:[[NSString stringWithFormat:@"\r\n--%@\r\n",boundary] dataUsingEncoding:NSUTF8StringEncoding]];
    [postbody appendData:[[NSString stringWithFormat:@"Content-Disposition: form-data; name=\"file\"; filename=\"%@\"\r\n", filename] dataUsingEncoding:NSUTF8StringEncoding]];
    [postbody appendData:[@"Content-Type: application/octet-stream\r\n\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
    [postbody appendData:[NSData dataWithData:[self.fileManager readFileToBinaryData:fileUrl]]];
    [postbody appendData:[[NSString stringWithFormat:@"\r\n--%@--\r\n",boundary] dataUsingEncoding:NSUTF8StringEncoding]];
    [request setHTTPBody:postbody];
    
    NSData *returnData = [NSURLConnection sendSynchronousRequest:request returningResponse:nil error:nil];
    NSString *returnString = [[NSString alloc] initWithData:returnData encoding:NSUTF8StringEncoding];
    return returnString;
}

@end
