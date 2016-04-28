//
//  PPConversationsList.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/30/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPConversationsList.h"
#import "PPConversationItem.h"

@interface PPConversationsList ()

@property PPCom *client;

-(void)sort;

@end

@implementation PPConversationsList

#pragma mark - Initialize Methods

+(instancetype)listWithClient:(PPCom*)client listBody:(NSDictionary*)body {
    return [[self alloc] initWithClient:client listBody:body];
}

-(instancetype)init{
    if (self = [super init]) {
        _conversationList = [[NSMutableArray alloc] init];
    }
    return self;
}

-(instancetype)initWithClient:(PPCom*)client listBody:(NSDictionary*)body {
    if (self = [self init]) {
        _client = client;
        NSArray *conversationList = body[@"list"];
        if (conversationList) {
            for (NSDictionary *obj in conversationList) {
                PPConversationItem *conversation = [PPConversationItem itemWithClient:client body:obj];
                [self.conversationList addObject:conversation];
            }
            
            [self sort];

        } else {
            NSLog(@"error");
        }
    }
    return self;
}

#pragma mark - Update Conversation List

-(void)updateConversationList:(PPMessage*)newMessage {
    //更新消息列表
    NSMutableArray *conversationItems = self.conversationList;
    PPConversationItem *conversationItem = [PPConversationItem itemWithClient:self.client withMessageBody:newMessage];
    
    //是否是已经存在的conversation item, 找到之后，进行更新
    int findIndex = -1;
    NSUInteger count = conversationItems.count;
    for (int i=0; i<count; ++i) {
        PPConversationItem *item = conversationItems[i];
        if ([item.uuid isEqualToString:conversationItem.uuid]) {
            findIndex = i;
            break;
        }
    }
    
    //更新数据
    if (findIndex == -1) {
        [conversationItems addObject:conversationItem];
    } else {
        conversationItems[findIndex] = conversationItem;
    }
    
    [self sort];
}

-(void)addConversation:(PPConversationItem*)item {
    if (item != nil) {
        [self.conversationList addObject:item];
        [self sort];
    }
}

-(void)removeConversation:(NSString*)conversationId {
    if (conversationId != nil) {
        int findIndex = -1;
        NSUInteger count = self.conversationList.count;
        for (int i=0; i<count; ++i) {
            if ([((PPConversationItem*)self.conversationList[i]).uuid isEqualToString:conversationId]) {
                findIndex = i;
                break;
            }
        }
        
        if (findIndex != -1) {
            NSLog(@"remove conversation - conversationId - %@", conversationId);
            [self.conversationList removeObjectAtIndex:findIndex];
        }
    }
}

-(void)removeAll {
    [self.conversationList removeAllObjects];
}

#pragma mark - Helper Methods

-(void)sort {
    [self.conversationList sortUsingComparator:^NSComparisonResult(id obj1, id obj2) {
        PPConversationItem *a = (PPConversationItem*)obj1;
        PPConversationItem *b = (PPConversationItem*)obj2;
        return b.messageTimestamp - a.messageTimestamp;
    }];
}

@end
