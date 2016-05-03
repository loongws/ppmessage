//
//  PPGroupMembersViewController.m
//  PPComLib
//
//  Created by PPMessage on 4/14/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPGroupMembersViewController.h"
#import "PPMessagesViewController.h"

#import "PPCom.h"
#import "PPUser.h"

#import "PPGroupMembersCollectionViewLayout.h"
#import "PPGroupMembersDataSource.h"
#import "PPGroupMemberViewCell.h"

#import "PPStoreManager.h"
#import "PPGroupMembersStore.h"
#import "PPConversationsStore.h"

#import "PPViewUtils.h"

@interface PPGroupMembersViewController ()

@property (nonatomic) NSString *conversationUUID;
@property (nonatomic) PPCom *client;
@property (nonatomic) PPGroupMembersDataSource *groupMemberDataSource;
@property (nonatomic) PPGroupMembersStore *groupMembersStore;
@property (nonatomic) PPConversationsStore *conversationsStore;

@property (nonatomic) BOOL animating;
@property (nonatomic) UIBarButtonItem *animatingButton;
@property (nonatomic) UIActivityIndicatorView *activityIndicator;

@end

@implementation PPGroupMembersViewController

#pragma mark - Constructor

- (instancetype)initWithConversationUUID:(NSString *)conversationUUID {
    if (self = [super initWithCollectionViewLayout:[PPGroupMembersCollectionViewLayout new]]) {
        self.conversationUUID = conversationUUID;
        self.client = [PPCom instance];
    }
    return self;
}

#pragma mark - Setup

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.collectionView registerClass:[PPGroupMemberViewCell class] forCellWithReuseIdentifier:PPGroupMemberViewCellIdentifier];
    self.collectionView.alwaysBounceVertical = YES;
    self.collectionView.backgroundColor = [UIColor whiteColor];
    self.collectionView.contentInset = UIEdgeInsetsMake(0, 5.0, 0, 5.0);
    
    [self updateTitleWithGroupMembersCount:0];
    self.navigationItem.rightBarButtonItem = self.animatingButton;
    
    [self setUpCollectionView];
}

#pragma mark - private

- (void)setUpCollectionView {
    
    NSMutableArray *cachedGroupMembers = [self.groupMembersStore groupMembersInConversation:self.conversationUUID];
    self.groupMemberDataSource = [[PPGroupMembersDataSource alloc] initWithGroupMembers:cachedGroupMembers cellIdentifier:PPGroupMemberViewCellIdentifier withClient:self.client configurationBlock:^(id cell, id item) {
        ((PPGroupMemberViewCell*)cell).groupMember = item;
    }];
    [self updateTitleWithGroupMembersCount:(cachedGroupMembers ? cachedGroupMembers.count : 0)];
    
    self.collectionView.dataSource = self.groupMemberDataSource;
    
    self.animating = YES;
    [self.groupMembersStore groupMembersInConversation:self.conversationUUID findCompleted:^(NSMutableArray *members, BOOL success) {
        if (success) {
            [self updateTitleWithGroupMembersCount:members.count];
            [self.groupMemberDataSource updateGroupMembers:members];
            [self.collectionView reloadData];
        }
        self.animating = NO;
    }];
    
}

//- (NSMutableArray*)mockGroupMembers {
//    NSMutableArray *array = [NSMutableArray array];
//    for (int i=0; i < 14; ++i) {
//        PPUser *user = [[PPUser alloc] initWithClient:self.client uuid:@"xxx" fullName:@"PPMessage" avatarId:nil];
//        [array addObject:user];
//    }
//    return array;
//}

#pragma mark - 

- (CGSize)collectionView:(UICollectionView *)collectionView
                  layout:(UICollectionViewLayout*)collectionViewLayout
  sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    return CGSizeMake(PPGroupMemberViewCellWidth, PPGroupMemberViewCellHeight);
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    
    PPUser *user = [self.groupMemberDataSource itemAtIndexPath:indexPath];
    if (!user.uuid) return; // user.uuid not exist
    if ([user.uuid isEqualToString:self.client.user.uuid]) return; // self
    
    self.animating = YES;
    [self.conversationsStore findConversationAssociatedWithUserUUID:user.uuid findCompleted:^(PPConversationItem *conversationItem, BOOL success) {
        
        if (success) {
            [self moveToMessagesViewControllerWithConversation:conversationItem];
        } else {
            PPMakeWarningAlert(@"Can not find conversation");
        }
        
        self.animating = NO;
        
    }];
    
}

#pragma mark - helpers

- (void)moveToMessagesViewControllerWithConversation:(PPConversationItem*)conversationItem {
    
    PPMessagesViewController *messagesViewController = [self messagesViewControllerFromHistoryStack];
    if (messagesViewController) {
        messagesViewController.conversationName = conversationItem.userName;
        messagesViewController.conversationUUID = conversationItem.uuid;
        
        [self.navigationController popToViewController:messagesViewController animated:YES];
    }
}

- (PPMessagesViewController*)messagesViewControllerFromHistoryStack {
    NSMutableArray *navigationArray = [[NSMutableArray alloc] initWithArray: self.navigationController.viewControllers];
    __block PPMessagesViewController *messagesViewControllerFromHistory = nil;
    [navigationArray enumerateObjectsWithOptions:NSEnumerationReverse usingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        if ([obj isKindOfClass:[PPMessagesViewController class]]) {
            messagesViewControllerFromHistory = obj;
            *stop = YES;
        }
    }];
    return messagesViewControllerFromHistory;
}

#pragma mark - getter setter
- (PPGroupMembersStore*)groupMembersStore {
    if (!_groupMembersStore) {
        _groupMembersStore = [PPStoreManager instanceWithClient:self.client].groupMembersStore;
    }
    return _groupMembersStore;
}

- (PPConversationsStore*)conversationsStore {
    if (!_conversationsStore) {
        _conversationsStore = [PPStoreManager instanceWithClient:self.client].conversationStore;
    }
    return _conversationsStore;
}

- (void)updateTitleWithGroupMembersCount:(NSInteger)count {
    if (count > 0) {
        self.title = [NSString stringWithFormat:@"Group(%@)", [NSNumber numberWithInteger:count]];
    } else {
        self.title = @"Group";
    }
}

- (void)setAnimating:(BOOL)animating {
    _animating = animating;
    if (_animating) {
        [self.activityIndicator startAnimating];
    } else {
        [self.activityIndicator stopAnimating];
    }
}

- (UIBarButtonItem*)animatingButton {
    if (!_animatingButton) {
        _animatingButton = [[UIBarButtonItem alloc] initWithCustomView:self.activityIndicator];
    }
    return _animatingButton;
}

- (UIActivityIndicatorView*)activityIndicator {
    if (!_activityIndicator) {
        _activityIndicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
    }
    return _activityIndicator;
}

@end
