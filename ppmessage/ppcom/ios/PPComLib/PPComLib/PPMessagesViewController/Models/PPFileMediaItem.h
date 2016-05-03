//
//  PPFileMediaItem.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPMediaItem.h"
#import "PPCom.h"

@interface PPFileMediaItem : PPMediaItem

+(instancetype)itemWithClient:(PPCom*)client fileBody:(NSDictionary*)body;

@property NSString *fid;
@property NSString *furl;
@property NSString *fname;

@end
