//
//  PPConversationsViewControllerTableViewController.m
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPConversationsViewController.h"
#import "PPConversationItemDataSource.h"
#import "PPConversationItem.h"
#import "PPConversationItemViewCell.h"
#import "PPConversationItemViewCell+PPConfigureForConversationItem.h"

#import "PPCom.h"

#import "PPFastLog.h"
#import "PPViewUtils.h"
#import "PPLoadingView.h"
#import "PPLayoutConstraintsUtils.h"

#import "PPStoreManager.h"
#import "PPConversationsStore.h"
#import "PPMessagesStore.h"

#import "PPMessagesViewController.h"
#import "PPPolling.h"

#import "PPCreateConversationHttpModel.h"
#import "PPGetWaitingQueueLengthHttpModel.h"

@interface PPConversationsViewController () <PPComInitializeDelegate, PPComMessageDelegate>

@property (nonatomic) PPConversationItemDataSource *conversationItemDataSource;
@property (nonatomic) PPCom *client;

@property (nonatomic) UIActivityIndicatorView *activityIndicator;
@property (nonatomic) PPLoadingView *loadingView;

@end

@implementation PPConversationsViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self setupTableView];
    
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    // 设置消息Delegate
    [PPCom instance].messageDelegate = self;
    
}

- (void)viewWillDisappear:(BOOL)animated {
    if ([self.navigationController.viewControllers indexOfObject:self] == NSNotFound) {
        // back button was pressed
        [self releaseResources];
    }
    [super viewWillDisappear:animated];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
    [self.loadingView removeFromSuperview];
    self.loadingView = nil;
}

- (void)setupTableView {
    
    PPConversationItemCellConfigureBlock configureCell = ^(PPConversationItemViewCell *cell, PPConversationItem *conversationItem) {
        [cell configureForConversationItem:conversationItem];
    };
    
    self.conversationItemDataSource = [[PPConversationItemDataSource alloc] initWithItems:nil cellIdentifier:PPConversationItemViewCellIdentifier configureCellBlock:configureCell];
    
    self.tableView.dataSource = self.conversationItemDataSource;
    
    [self.tableView registerClass:[PPConversationItemViewCell class] forCellReuseIdentifier:PPConversationItemViewCellIdentifier];
    
    [self removeTableViewEmptySeparator];
}

- (void)removeTableViewEmptySeparator {
    self.tableView.tableFooterView = [UIView new];
}

#pragma mark - Initialize

- (void) initialize {
    [self initializeWithUserEmail:nil];
}

- (void) initializeWithUserEmail:(NSString *)email {
    NSParameterAssert(self.appUUID != nil && self.appUUID.length > 0);
    
    [self startAnimating];
    self.client = [PPCom instanceWithAppUUID:self.appUUID];
    [self.client initilize:email withDelegate:self];
    
}

- (void)onFailedGetDefaultConversation:(__weak PPConversationsViewController *)wself {
    PPPolling *pollingConversation = [[PPPolling alloc] initWithClient:wself.client withTimeInterval:5];
    [pollingConversation runWithExecutingCode:^{
        PPGetWaitingQueueLengthHttpModel *getWaitingQueueLengthTask = [PPGetWaitingQueueLengthHttpModel modelWithClient:wself.client];
        [getWaitingQueueLengthTask getWaitingQueueLengthWithCompletedBlock:^(NSNumber *waitingQueueLength, NSDictionary *response, NSError *error) {
            [[NSOperationQueue mainQueue] addOperationWithBlock:^ {
                wself.loadingView.loadingText = [NSString stringWithFormat:@"当前等待人数:%@", waitingQueueLength];
            }];
        }];
    }];
}

- (void)onGetDefaultConversation:(__weak PPConversationsViewController *)wself storeManager:(PPStoreManager *)storeManager {
    [storeManager.conversationStore sortedConversationsWithBlock:^(NSArray *conversations, NSError *error) {
        
        [wself.conversationItemDataSource updateAllItems:conversations];
        [wself.tableView reloadData];
        [wself stopAnimating];
        
    }];
}

- (void)onInitSuccess:(PPUser*)user {
    
    PPStoreManager *storeManager = [PPStoreManager instanceWithClient:self.client];
    __weak PPConversationsViewController *wself = self;
    [storeManager.conversationStore asyncGetDefaultConversationWithCompletedBlock:^(PPConversationItem *conversation) {
        if (!conversation) {
            [wself.view addSubview:wself.loadingView];
            [self onFailedGetDefaultConversation:wself];
        } else {
            [self onGetDefaultConversation:wself storeManager:storeManager];
        }
    }];
    
}

- (void)onInitError:(NSError *)error with:(NSDictionary *)errorResponse {
    [self stopAnimating];
}

#pragma mark - Message Delegate

- (void)onWSPPMessageObjArrived:(id)obj {
    [[PPStoreManager instanceWithClient:self.client].messagesStore updateWithNewMessage:obj];
    NSArray *sortConversations = [[PPStoreManager instanceWithClient:self.client].conversationStore sortedConversations];
    [self.conversationItemDataSource updateAllItems:sortConversations];
    [self.tableView reloadData];
}

- (void)onWSConversationObjArrived:(id)obj {
    PPConversationsStore *conversationStore = [PPStoreManager instanceWithClient:self.client].conversationStore;
    if (![conversationStore isDefaultConversationAvaliable]) {
        [conversationStore addDefaultConversation:obj];
        [self onGetDefaultConversation:self storeManager:[PPStoreManager instanceWithClient:self.client]];
        [self.loadingView removeFromSuperview];
    } else {
        [conversationStore addConversation:obj];
        [self gotoMessagesViewControllerWithConversation:obj];
    }
}

- (void)onWSMsgArrived:(id)obj msgType:(PPWebSocketMsgType)msgType {
    if (self.client) {
        if (msgType == PPWebSocketMsgTypeMsg) {

            [self onWSPPMessageObjArrived:obj];
            
        } else if (msgType == PPWebSocketMsgTypeConversation) {
            
            [self onWSConversationObjArrived:obj];
            
        }
    }
}

#pragma mark - Table View Delegate

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return PPConversationItemViewHeight;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if ([self isAnimating]) return;
    
    PPConversationItem *conversation = [self.conversationItemDataSource itemAtIndexPath:indexPath];
    if (conversation.conversationItemType == PPConversationItemTypeGroup) {
        [self startAnimating];
        
        [[PPStoreManager instanceWithClient:self.client].conversationStore asyncFindConversationWithGroupUUID:conversation.groupUUID completedBlock:^(PPConversationItem *find, BOOL success) {
            
            [self stopAnimating];
            
            if (success) {
                [self gotoMessagesViewControllerWithConversation:find];
            } else {
                [PPMakeWarningAlert(@"创建会话失败") show];
            }
            
        }];
        
    } else {
        [self gotoMessagesViewControllerWithConversation:conversation];
    }

}

#pragma mark - helpers

- (void)releaseResources {
    if (self.client) {
        [self.client releaseResources];
    }
}

- (void)gotoMessagesViewControllerWithConversation:(PPConversationItem*)conversation {
    PPMessagesViewController *messagesViewController = [[PPMessagesViewController alloc] init];
    messagesViewController.conversationName = conversation.userName;
    messagesViewController.conversationUUID = conversation.uuid;
    [self.navigationController pushViewController:messagesViewController animated:YES];
}

#pragma mark -

- (BOOL)isAnimating {
    if (!self.activityIndicator) return NO;
    return [self.activityIndicator isAnimating];
}

- (void)startAnimating {
    if (!self.activityIndicator) {
        self.activityIndicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
        UIBarButtonItem * barButton = [[UIBarButtonItem alloc] initWithCustomView:self.activityIndicator];
        self.navigationItem.rightBarButtonItem = barButton;
    }
    [self.activityIndicator startAnimating];
}

- (void)stopAnimating {
    if (self.activityIndicator) {
        [self.activityIndicator stopAnimating];
    }
}

#pragma mark - getter setter

- (PPLoadingView*)loadingView {
    if (!_loadingView) {
        _loadingView = [[PPLoadingView alloc] init];
        _loadingView.center = CGPointMake([UIScreen mainScreen].bounds.size.width / 2, [UIScreen mainScreen].bounds.size.height / 2);
    }
    return _loadingView;
}

#pragma mark - helper

@end
