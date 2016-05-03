//
//  PPUploader.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPComNet.h"

@interface PPUploader : PPComNet

-(instancetype)initWithClient:(PPCom *)client;

/**
 * upload large txt to server
 */
-(void)uploadTxt:(NSString*)text withDelegate:(void(^)(NSError *error, NSDictionary *response))delegate;

/**
 * upload file to server
 */
-(void)uploadFile:(NSString*)fileUrl withDelegate:(void(^)(NSError *error, NSDictionary *response))delegate;

@end
