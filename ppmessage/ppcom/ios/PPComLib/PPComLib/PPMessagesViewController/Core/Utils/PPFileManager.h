//
//  PPFileManager.h
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PPFileManager : NSObject

-(NSString*)writeTextToFile:(NSString*)text;
-(void)writeTextToFile:(NSString *)text withDelegate:(void(^)(NSException *exception, NSString *filePath))delegate;

-(NSData*)readFileToBinaryData:(NSString*)fileUrl;

@end
