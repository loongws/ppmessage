//
//  PPConversationItemDataSource.m
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPConversationItemDataSource.h"
#import "PPStoreManager.h"

@interface PPConversationItemDataSource ()

@property (nonatomic) NSArray *items;
@property (nonatomic) NSString *cellIdentifier;
@property (nonatomic, copy) PPConversationItemCellConfigureBlock configureCellBlock;

@end

@implementation PPConversationItemDataSource

- (instancetype)initWithItems:(NSArray *)items
               cellIdentifier:(NSString *)cellIdentifier
           configureCellBlock:(PPConversationItemCellConfigureBlock)configureCellBlock {
    if (self = [super init]) {
        self.items = items;
        self.cellIdentifier = cellIdentifier;
        self.configureCellBlock = [configureCellBlock copy];
    }
    return self;
}

- (id)itemAtIndexPath:(NSIndexPath *)indexPath {
    return self.items[ (NSUInteger) indexPath.row ];
}

- (void)updateAllItems:(NSArray *)items {
    self.items = items;
}

#pragma mark UITableViewDataSource

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.items.count;
}

- (UITableViewCell*)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:self.cellIdentifier forIndexPath:indexPath];
    id item = [self itemAtIndexPath:indexPath];
    self.configureCellBlock(cell, item);
    return cell;
}

@end
