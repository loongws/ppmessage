//
//  PPPhotoMediaItem.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPPhotoMediaItem.h"
#import "PPComUtils.h"
#import "PPDownloader.h"

@interface PPPhotoMediaItem ()

@property PPCom *client;

-(instancetype)initWithClient:(PPCom*)client mediaBody:(NSDictionary*)body;

@end

@implementation PPPhotoMediaItem

+(instancetype)itemWithClient:(PPCom*)client mediaBody:(NSDictionary*)body {
    return [[self alloc] initWithClient:client mediaBody:body];
}

-(instancetype)initWithClient:(PPCom*)client mediaBody:(NSDictionary*)body {
    if (self = [super init]) {
        _client = client;
        _fid = body[@"orig"];
        _mime = body[@"mime"];
        _thumbFid = body[@"thum"];
        _furl = [_client.downloader getResourceDownloadUrl:_fid];
        _thumbUrl = [_client.downloader getResourceDownloadUrl:_thumbFid];
        NSLog(@"furl:%@, thumbUrl:%@", _furl, _thumbUrl);
    }
    return self;
}

@end
