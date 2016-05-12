//
//  PPWebSocketBaseHandler.h
//  PPComLib
//
//  Created by PPMessage on 5/5/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "PPWebSocketHandler.h"

#import "PPCom.h"

@interface PPWebSocketBaseHandler : NSObject <PPWebSocketHandler>

@property (nonatomic) PPCom *client;

- (instancetype)initWithClient:(PPCom*)client;

@end
