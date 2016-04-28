//
//  JSQTxtMediaItem.h
//  PPComDemo
//
//  Created by Kun Zhao on 10/8/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "JSQMediaItem.h"

@interface JSQTxtMediaItem : JSQMediaItem <JSQMessageMediaData, NSCoding, NSCopying>

-(instancetype)initWithTxtUrl:(NSURL*)txtUrl;
-(instancetype)initWithTxtUrl:(NSURL*)txtUrl placeHolder:(NSString*)placeHolder;

@end
