//
//  PPPhotoMediaItem.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPMediaItem.h"
#import "PPCom.h"

@interface PPPhotoMediaItem : PPMediaItem <PPMessageMediaData>

+(instancetype)itemWithClient:(PPCom*)client mediaBody:(NSDictionary*)body;

/**
 * Origin file uuid
 */
@property NSString *fid;

/**
 * thumbnail file uuid
 */
@property NSString *thumbFid;

/**
 * mime type
 */
@property NSString *mime;

/**
 * Origin file url
 */
@property NSString *furl;

/**
 * thumb file url
 */
@property NSString *thumbUrl;

@end
