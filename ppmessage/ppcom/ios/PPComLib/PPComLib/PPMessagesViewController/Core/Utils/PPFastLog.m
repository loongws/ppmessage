//
//  PPFastLog.m
//  PPComLib
//
//  Created by Kun Zhao on 12/26/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPFastLog.h"

#define PP_ENABLE_LOG

void PPFastLog(NSString *format, ...)  {
#ifdef PP_ENABLE_LOG
    __block va_list arg_list;
    va_start (arg_list, format);
    
    NSString *formattedString = [[NSString alloc] initWithFormat:format arguments:arg_list];
    
    va_end(arg_list);
    
    NSLog(@"[PP] %@", formattedString);
#endif
}

void PPFastError(NSString *format, ...)  {
    __block va_list arg_list;
    va_start (arg_list, format);
    
    NSString *formattedString = [[NSString alloc] initWithFormat:format arguments:arg_list];
    
    va_end(arg_list);
    
    NSLog(@"[PP] %@", formattedString);
}
