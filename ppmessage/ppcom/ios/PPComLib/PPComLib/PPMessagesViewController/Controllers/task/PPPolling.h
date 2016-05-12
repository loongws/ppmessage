//
//  PPPolling.h
//  PPComLib
//
//  Created by PPMessage on 5/4/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>

@class PPCom;

typedef void (^PPPollingExecutingBlock)();

@interface PPPolling : NSObject

- (instancetype)initWithClient:(PPCom*)client
              withTimeInterval:(NSTimeInterval)timeInterval;

- (void)runWithExecutingCode:(PPPollingExecutingBlock)block;
- (void)cancel;

@end
