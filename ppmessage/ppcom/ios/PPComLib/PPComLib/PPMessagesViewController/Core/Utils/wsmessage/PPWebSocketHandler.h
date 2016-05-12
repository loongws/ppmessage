//
//  PPWebSocketHandler.h
//  PPComLib
//
//  Created by PPMessage on 5/5/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol PPWebSocketHandler <NSObject>

- (void)handle:(NSDictionary *)obj;

@end
