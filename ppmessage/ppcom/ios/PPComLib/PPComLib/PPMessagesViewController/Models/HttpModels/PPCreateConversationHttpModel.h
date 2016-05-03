//
//  PPCreateConversationHttpModel.h
//  PPComLib
//
//  Created by PPMessage on 4/13/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPHttpModel.h"

@class PPCom;

@interface PPCreateConversationHttpModel : NSObject

+ (instancetype)modelWithClient:(PPCom*)client;

- (void)createWithGroupUUID:(NSString *)groupUUID
                  completed:(PPHttpModelCompletedBlock)completedBlock;
- (void)createWithUserUUID:(NSString*)userUUID
                 completed:(PPHttpModelCompletedBlock)completedBlock;

@end
