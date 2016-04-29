//
//  PPConversationItemDataSource.h
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class PPMessage;

typedef void (^PPConversationItemCellConfigureBlock)(id cell, id item);

@interface PPConversationItemDataSource : NSObject <UITableViewDataSource>

- (instancetype)initWithItems:(NSArray *)items
               cellIdentifier:(NSString *)cellIdentifier
           configureCellBlock:(PPConversationItemCellConfigureBlock)configureCellBlock;

- (id)itemAtIndexPath:(NSIndexPath*)indexPath;

- (void)updateAllItems:(NSArray *)items;

@end
