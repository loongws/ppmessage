//
//  PPTxtMediaData.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPMediaItem.h"
#import "PPCom.h"

typedef NS_ENUM(NSInteger, PPTxtMediaItemLoadState) {
    PPTxtMediaItemLoadStateNull, //Error or null
    PPTxtMediaItemLoadStateLoading, //Loading
    PPTxtMediaItemLoadStateDone, //Load success
};

@interface PPTxtMediaItem : PPMediaItem

+(instancetype)itemWithClient:(PPCom*)client txtBody:(NSDictionary*)body;

@property PPTxtMediaItemLoadState state;
@property NSString *text;
@property NSString *txtFid;
@property NSString *txtUrl;

@end
