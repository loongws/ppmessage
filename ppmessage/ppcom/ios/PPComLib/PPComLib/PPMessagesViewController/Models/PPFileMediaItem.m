//
//  PPFileMediaItem.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPFileMediaItem.h"
#import "PPDownloader.h"

@interface PPFileMediaItem ()

-(instancetype)initWithClient:(PPCom*)client fileBody:(NSDictionary*)body;

@end

@implementation PPFileMediaItem

#pragma mark - Initalize Methods

+(instancetype)itemWithClient:(PPCom*)client fileBody:(NSDictionary*)body {
    return [[self alloc] initWithClient:client fileBody:body];
}

-(instancetype)initWithClient:(PPCom*)client fileBody:(NSDictionary*)body {
    if (self = [super init]) {
        _fid = body[@"fid"];
        _fname = body[@"name"];
        _furl = [client.downloader getResourceDownloadUrl:_fid];
    }
    return self;
}

@end
