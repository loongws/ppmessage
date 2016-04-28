//
//  main.m
//  SyntaxTest
//
//  Created by Kun Zhao on 12/25/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        // insert code here...
        NSLog(@"Hello, World!");
        
        NSDictionary *dict = @{
            @"abc": @123
        };
        
//        if (dict[@"abc"] && [dict[@"abc"] isEqual:@123]) {
//            NSLog(@"---1---");
//        } else if ([dict[@"def"] isEqual:@456]) {
//            NSLog(@"---2---");
//        }
//
//        if (dict[@"def"]) {
//            NSLog(@"---3---");
//        }
        
        NSLog(@"%@", dict);
        NSLog(@"%@", [NSString stringWithFormat:@"Error: %@", dict]);
        
    }
    return 0;
}
