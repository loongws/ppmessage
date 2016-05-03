//
//  PPStoreManager.m
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPStoreManager.h"

#import "PPMessagesStore.h"
#import "PPConversationsStore.h"
#import "PPGroupMembersStore.h"
#import "PPCom.h"

@implementation PPStoreManager

+ (instancetype)instanceWithClient:(PPCom *)client {
    static dispatch_once_t onceToken;
    static PPStoreManager *storeManager;
    dispatch_once(&onceToken, ^{
        storeManager = [[PPStoreManager alloc] initWithClient:client];
    });
    return storeManager;
}

- (instancetype)initWithClient:(PPCom*)client {
    if (self = [super init]) {
        self.conversationStore = [PPConversationsStore storeWithClient:client];
        self.messagesStore = [PPMessagesStore storeWithClient:client];
        self.groupMembersStore = [PPGroupMembersStore storeWithClient:client];
    }
    return self;
}

@end
