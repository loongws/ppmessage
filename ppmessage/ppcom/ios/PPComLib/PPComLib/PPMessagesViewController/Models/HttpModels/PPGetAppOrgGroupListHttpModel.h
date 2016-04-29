//
//  PPGetAppOrgGroupListHttpModel.h
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPHttpModel.h"

@class PPCom;

@interface PPGetAppOrgGroupListHttpModel : NSObject

+ (instancetype)modelWithClient:(PPCom*)client;

- (instancetype)initWithClient:(PPCom*)client;

- (void)getAppOrgGroupListWithBlock:(PPHttpModelCompletedBlock)block;

@end
