//
//  JSQFileMediaItem.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "JSQMediaItem.h"

@interface JSQFileMediaItem : JSQMediaItem <JSQMessageMediaData, NSCoding, NSCopying>

/**
 * 初始化
 */
- (instancetype)initWithFileURL:(NSURL*)fileURL displayName:(NSString*)fileName;

/**
 * 文件URL
 */
@property (nonatomic, strong) NSURL *fileURL;

/**
 * 文件显示名字
 */
@property (nonatomic, strong) NSString *fileName;

@end
