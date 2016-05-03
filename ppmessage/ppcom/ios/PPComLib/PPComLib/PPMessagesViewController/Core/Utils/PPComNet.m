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

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#define ENABLE_DEBUG 1

@interface PPComNet ()

@property PPCom *client;

@property NSMutableURLRequest *request;

- (void) initMutableURLRequest;
- (void) addHeaders;
- (NSData*) getPostData:(NSDictionary*)data;

@end

@implementation PPComNet

#pragma mark - Inititialize Methods

- (instancetype) initWithClient:(PPCom *)client {
    if (self = [super init]) {
        self.client = client;
    }
    return self;
}

+ (instancetype) netWithClient:(PPCom *)client {
    return [[self alloc] initWithClient:client];
}

#pragma mark - Post Methods

- (void)baseAsyncPost:(NSString *)url
            withParam:(id)params
               config:(void (^)(NSMutableURLRequest *))configBlock
            completed:(void (^)(NSDictionary *, NSError *))completedBlock {
    
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    request.HTTPMethod = @"POST";
    NSData *postData = nil;
    
    if (params) {
        if ([params isKindOfClass:[NSString class]]) {
            NSString *str = (NSString*)params;
            postData = [str dataUsingEncoding:NSUTF8StringEncoding];
        } else if ([params isKindOfClass:[NSDictionary class]]) {
            postData = [self getPostData:((NSDictionary*)params)];
        }
    }
    
    if (!postData) {
        if (ENABLE_DEBUG) PPFastLog(@"Post data can not be empty, cancelled");
        return;
    }
    
    [request setURL:[NSURL URLWithString:url]];
    [request setHTTPBody:postData];
    
    if (configBlock) {
        configBlock(request);
    }
    
    if (ENABLE_DEBUG) PPFastLog(@"async post: %@, %@", url, params);
    
    [NSURLConnection sendAsynchronousRequest:request
                                       queue:[NSOperationQueue mainQueue]
                           completionHandler:^(NSURLResponse * _Nullable response, NSData * _Nullable data, NSError * _Nullable connectionError) {
                               
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
        
        if (completedBlock) {
            if (!_error) {
                PPFastLog(@"async response:%@, url:%@", _jsonResponse, url);
                
                completedBlock(_jsonResponse, nil);
            } else {
                PPFastLog(@"async response error:%@, url:%@", _error, url);
                
                completedBlock(nil, _error);
            }
        }
                               
    }];
    
}

- (void) asyncPost:(NSDictionary *)data urlSegment:(NSString*)url delegate:(id<PPComNetDelegate>)theDelegate {
    [self initMutableURLRequest];
    NSData *postData = [self getPostData:data];
    if (postData) {
        [self.request setURL:[NSURL URLWithString:[PPApiHost stringByAppendingString:url]]];
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
    
    NSString *requestURLString = [PPApiHost stringByAppendingString:url];
    [self baseAsyncPost:requestURLString withParam:data config:^(NSMutableURLRequest *request) {
        
        [self addHeadersForRequest:request];
        
    } completed:handler];
    
}

- (NSDictionary*) post: (NSDictionary*) data urlSegment:(NSString*)url {
    [self initMutableURLRequest];
    NSData *postData = [self getPostData:data];
    if (postData) {
        [self.request setURL:[NSURL URLWithString:[PPApiHost stringByAppendingString:url]]];
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
    [self addHeadersForRequest:self.request];
}

- (void) addHeadersForRequest:(NSMutableURLRequest*)request {
    [request setValue:@"application/json;charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    [request setValue:[NSString stringWithFormat:@"OAuth %@", self.accessToken] forHTTPHeaderField:@"Authorization"];
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
