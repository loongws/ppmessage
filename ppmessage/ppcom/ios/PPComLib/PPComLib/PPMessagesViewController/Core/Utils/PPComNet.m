//
//  PPComLibNet.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/16/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPComNet.h"
#import "NSString+Crypto.h"
#import "PPCom.h"
#import "PPComUtils.h"
#import "PPFastLog.h"

/*
 ------------------------------------------------------------------------
 Constants
 ------------------------------------------------------------------------
 */

// #define DEV "DEV_MODE"

#define HTTP_SCHEME @"https://"
#define WEBSOCKET_SCHEME @"wss://"
#define DEFAULT_HOST @"ppmessage.cn"

#ifdef DEV
#define HTTP_SCHEME @"http://"
#define WEBSOCKET_SCHEME @"ws://"
#define DEFAULT_HOST @"192.168.0.216:8080"
#endif

#define API @"/api"
#define WS @"/pcsocket/WS"
#define DOWNLOAD @"/download"
#define UPLOAD @"/upload"

@interface PPComNet ()

@property PPCom *client;

@property NSString *host;
@property NSString *appKey;
@property NSString *appSecret;
@property NSString *apiHost;
@property NSString *webSocketHost;
@property NSString *fileDownloadHost;
@property NSString *fileUploadHost;
@property NSString *portalHost;
@property NSMutableURLRequest *request;

- (void) initWithAppKey: (NSString*)appKey withAppSecret:(NSString*)appSecret;
- (void) initWithHost: (NSString*)host withAppKey:(NSString*)appKey withAppSecret:(NSString*)appSecret;
- (void) initHosts;
- (void) initMutableURLRequest;
- (void) addHeaders;
- (NSString*) signature:(NSString*) requestUUID;
- (NSData*) getPostData:(NSDictionary*)data;

@end

@implementation PPComNet

#pragma mark - Inititialize Methods

- (instancetype) initWithClient:(PPCom *)client {
    if (self = [super init]) {
        self.client = client;
        [self initWithAppKey:client.appKey withAppSecret:client.appSecret];
    }
    return self;
}

+ (instancetype) netWithClient:(PPCom *)client {
    return [[self alloc] initWithClient:client];
}

#pragma mark - Post Methods

- (void) asyncPost:(NSDictionary *)data urlSegment:(NSString*)url delegate:(id<PPComNetDelegate>)theDelegate {
    [self initMutableURLRequest];
    NSData *postData = [self getPostData:data];
    if (postData) {
        [self.request setURL:[NSURL URLWithString:[self.apiHost stringByAppendingString:url]]];
        [self.request setHTTPBody:postData];
        [NSURLConnection sendAsynchronousRequest:self.request queue:[NSOperationQueue mainQueue] completionHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
            if (!connectionError && [data length] > 0) {
                if (theDelegate) {
                    [theDelegate onSuccess:[NSJSONSerialization JSONObjectWithData:data options:0 error:nil]];
                }
            } else {
                NSLog(@"connection error:%@.", connectionError.description);
                if (theDelegate) {
                    if ([theDelegate respondsToSelector:@selector(onError:)]) {
                        [theDelegate onError:connectionError];
                    }
                }
            }
        }];
    }
}

- (void) asyncPost:(NSDictionary *)data urlSegment:(NSString *)url completionHandler:(void(^)(NSDictionary* response, NSError* error))handler {
    [self initMutableURLRequest];
    NSData *postData = [self getPostData:data];
    if (postData) {
        
        PPFastLog(@"async post: %@, %@", url, data);
        
        [self.request setURL:[NSURL URLWithString:[self.apiHost stringByAppendingString:url]]];
        [self.request setHTTPBody:postData];
        [NSURLConnection sendAsynchronousRequest:self.request queue:[NSOperationQueue mainQueue] completionHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
            
            NSError *_error = connectionError;
            NSDictionary *_jsonResponse = nil;
            if (!connectionError && [data length] > 0) {
                
                _jsonResponse = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
                if (_jsonResponse == nil) {
                    if (_error == nil) {
                        _error = [[NSError alloc] initWithDomain:@"PPComLibrary" code:10000 userInfo:@{@"reason":@"Response is empty."}];
                    }
                }
            }
            
            if (handler) {
                if (!_error) {
                    PPFastLog(@"async response:%@", _jsonResponse);
                    
                    handler(_jsonResponse, nil);
                } else {
                    PPFastLog(@"async response error:%@.", _error);
                    
                    handler(nil, _error);
                }
            }
            
        }];
    }
}

- (NSDictionary*) post: (NSDictionary*) data urlSegment:(NSString*)url {
    [self initMutableURLRequest];
    NSData *postData = [self getPostData:data];
    if (postData) {
        [self.request setURL:[NSURL URLWithString:[self.apiHost stringByAppendingString:url]]];
        [self.request setHTTPBody:postData];
        NSError *error = [[NSError alloc] init];
        NSHTTPURLResponse *urlResponse = nil;
        NSData *responseData = [NSURLConnection sendSynchronousRequest:self.request returningResponse:&urlResponse error:&error];
        if (responseData) {
            return [NSJSONSerialization JSONObjectWithData:responseData options:0 error:nil];
        }
    }
    return nil;
}

- (NSData*) request:(NSString*)url {
    [self initMutableURLRequest];
    [self.request setURL:[NSURL URLWithString:url]];
    NSError *error = [[NSError alloc] init];
    NSHTTPURLResponse *urlResponse = nil;
    NSData *responseData = [NSURLConnection sendSynchronousRequest:self.request returningResponse:&urlResponse error:&error];
    return responseData;
}

- (void) asyncRequest:(NSString*)url withBlock:(void(^)(NSError *error, NSData *data))handler {
    [self initMutableURLRequest];

    [self.request setURL:[NSURL URLWithString:url]];
    self.request.HTTPMethod = @"GET";
    
    NSLog(@"async request: %@", url);
    [NSURLConnection sendAsynchronousRequest:self.request queue:[NSOperationQueue mainQueue] completionHandler:^(NSURLResponse *response, NSData *responseData, NSError *connectionError) {
        if (!connectionError && [responseData length] > 0) {
            handler(nil, responseData);
        } else {
            NSLog(@"connection error:%@.", connectionError.description);
            handler(connectionError, nil);
        }
    }];

}

/*
 ------------------------------------------------------------------------
 Private methods used only in this file
 ------------------------------------------------------------------------
 */

#pragma mark -
#pragma mark Private methods

- (void) initWithAppKey:(NSString *)appKey withAppSecret:(NSString *)appSecret {
    [self initWithHost:nil withAppKey:appKey withAppSecret:appSecret];
}

- (void) initWithHost: (NSString*)host withAppKey:(NSString*)appKey withAppSecret:(NSString*)appSecret {
    self.appKey = appKey;
    self.appSecret = appSecret;
    
    if (host) {
        self.host = host;
    } else {
        self.host = DEFAULT_HOST;
    }
    
    [self initHosts];
}

// init hosts

- (void) initHosts {
    self.apiHost = [NSString stringWithFormat:@"%@%@%@", HTTP_SCHEME, self.host, API];
    self.webSocketHost = [NSString stringWithFormat:@"%@%@%@", WEBSOCKET_SCHEME, self.host, WS];
    self.fileDownloadHost = [NSString stringWithFormat:@"%@%@%@", HTTP_SCHEME, self.host, DOWNLOAD];
    self.fileUploadHost = [NSString stringWithFormat:@"%@%@%@", HTTP_SCHEME, self.host, UPLOAD];
    self.portalHost = [NSString stringWithFormat:@"%@%@", HTTP_SCHEME, self.host];
}

// init MutableURLRequest

- (void) initMutableURLRequest {
    if (!self.request) {
        self.request = [[NSMutableURLRequest alloc] init];
        self.request.HTTPMethod = @"POST";
        [self addHeaders];
    }
}

// add headers to request

- (void) addHeaders {
    [self.request setValue:@"application/json;charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    [self.request setValue:@"true" forHTTPHeaderField:@"X-If-IMAPP"];
    [self.request setValue:self.appKey forHTTPHeaderField:@"X-App-Key"];
    NSString *requestUUID = [self.client.utils getRandomUUID];
    [self.request setValue:requestUUID forHTTPHeaderField:@"X-Request-UUID"];
    [self.request setValue:[self signature:requestUUID] forHTTPHeaderField:@"X-Request-Signature"];
}

// signature request

- (NSString*) signature:(NSString*) requestUUID {
    NSString *sig = [self.appSecret stringByAppendingString:requestUUID];
    return [sig SHA1String];
}

// convert request params which in dictionary to NSData

- (NSData*) getPostData:(NSDictionary *)data {
    NSData *postData = nil;
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:data
                                                       options:NSJSONWritingPrettyPrinted
                                                         error:&error];
    if (!jsonData) {
        NSLog(@"Got an error: %@", error);
    } else {
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        postData = [jsonString dataUsingEncoding:NSUTF8StringEncoding allowLossyConversion:YES];
    }
    return postData;
}

@end
