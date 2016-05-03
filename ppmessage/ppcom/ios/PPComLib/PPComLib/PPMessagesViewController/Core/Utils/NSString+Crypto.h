//
//  NSString+SHA1.h
//  OCTest
//
//  Created by Kun Zhao on 9/17/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSString (Crypto)

- (NSString*) SHA1String;

- (NSString*) MD5String;

@end
