//
//  PPTxtMediaData.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPTxtMediaItem.h"
#import "PPDownloader.h"

@interface PPTxtMediaItem ()

-(instancetype)initWithClient:(PPCom*)client txtBody:(NSDictionary*)body;

@end

@implementation PPTxtMediaItem

#pragma mark - Initialize Methods

+(instancetype)itemWithClient:(PPCom*)client txtBody:(NSDictionary*)body {
    return [[self alloc] initWithClient:client txtBody:body];
}

-(instancetype)initWithClient:(PPCom*)client txtBody:(NSDictionary*)body {
    if (self = [super init]) {
        _state = PPTxtMediaItemLoadStateNull;
        _txtFid = body[@"fid"];
        _txtUrl = [client.downloader getResourceDownloadUrl:_txtFid];
    }
    return self;
}

@end
