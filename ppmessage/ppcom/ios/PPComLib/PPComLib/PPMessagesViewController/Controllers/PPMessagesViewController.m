//
//  PPMessagesViewController.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/24/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPMessagesViewController.h"

#import "PPImagePickerDelegate.h"
#import "PPCameraViewDelegate.h"

#import "PPCom.h"

#import "PPUser.h"
#import "PPMessageList.h"
#import "PPPhotoMediaItem.h"
#import "PPTxtMediaItem.h"

#import "PPDataCache.h"
#import "PPMessageSender.h"
#import "PPTxtLoader.h"

#import "PPConstants.h"
#import "PPFastLog.h"

#import "JSQMessagesBubbleImage.h"

NSString *const PPVersionString = @"0.0.2";

#define MESSAGE_PAGE_SIZE @20
#define TIMESTAMP_DELAY @5 // 5 * 60 s => 5 mins

@interface PPMessagesViewController () <UIActionSheetDelegate, PPComMessageDelegate, PPComInitializeDelegate>

@property NSString *conversationId;
@property PPCom *client;
@property NSMutableArray *jsqMessageArray;
@property NSMutableArray *ppMessageArray;
@property (nonatomic, strong) NSMutableDictionary *imageDownloadsInProgress;
@property UIActivityIndicatorView *activityIndicator;
@property NSInteger nextPageOffset;
@property (strong, nonatomic) JSQMessagesBubbleImage *outgoingBubbleImageData;
@property (strong, nonatomic) JSQMessagesBubbleImage *incomingBubbleImageData;

- (void)configure;
- (void)loadHistory:(NSNumber*)pageOffset withBlock:(void(^)(NSDictionary *response))handler;
- (void)prepareLoadData;
- (void)notifyLoadDataFinish;

/** 设置MediaItem的气泡应该是左面还是右面 **/
- (void)appliesMediaViewMaskAsOutgoing:(JSQMediaItem*)jsqMediaItem message:(PPMessage*)message;
/** 加载Photo数据 **/
- (void)loadPhotoItemData:(JSQMessagesCollectionViewCell *)cell mediaData:(id)mediaData indexPath:(NSIndexPath *)indexPath;
/** 加载大文本数据 **/
- (void)loadTxtMediaData:(id)mediaData cell:(JSQMessagesCollectionViewCell *)cell indexPath:(NSIndexPath*)indexPath;

/** 选择图片 **/
- (BOOL) startMediaBrowserFromViewController: (UIViewController*) controller
                               usingDelegate: (id <UIImagePickerControllerDelegate,
                                               UINavigationControllerDelegate>) delegate;
/** 拍照 **/
- (BOOL) startCameraControllerFromViewController: (UIViewController*) controller
                                   usingDelegate: (id <UIImagePickerControllerDelegate,
                                                   UINavigationControllerDelegate>) delegate;

/** 播放右上角开始转圈动画 **/
- (void) startAnimateLoadingUI;
/** 关闭右上角转圈动画 **/
- (void) stopAnimateLoadingUI;

/** 显示加载EarlierMessage按钮 **/
- (void) showLoadEarlierMessageButton;
- (void) hideLoadEarlierMessageButton;

@end

/////////////////////////
/// Resources Release ///
/////////////////////////
@interface PPMessagesViewController (ReleaseResources)

/**
 * Release resources
 */
- (void)releaseResources;

@end

@implementation PPMessagesViewController (ReleaseResources)

- (void)releaseResources {
    if (self.client) {
        [self.client releaseResources];
    }
}

@end

#pragma mark - Data Related Methods

@interface PPMessagesViewController (MessageData)

-(void)updateLocalMessageFromCache: (NSString*) conversationId ;

@end

@implementation PPMessagesViewController (MessageData)

-(void)updateLocalMessageFromCache: (NSString*) conversationId {
    PPMessageList *cachedList = [self.client.dataStorage getCachedMessagesList:conversationId autoCreate:YES];
    self.jsqMessageArray = cachedList.jsqMessageArray;
    self.ppMessageArray = cachedList.ppMessageArray;
}

@end

#pragma mark - Message Send Methods

@interface PPMessagesViewController (MessageSend)

-(void)sendMessage:(PPMessage*)message;
-(void)onSendMessageError:(PPMessage*)message withError:(NSError*)error;

@end

@implementation PPMessagesViewController (MessageSend)

-(void)sendMessage:(PPMessage *)message {
    [self.client.messageSender sendMessage:message complectionHandler:^(NSError *error, NSDictionary *response) {
            
            if ( error != nil || // can not connect to server
                 ( response != nil && [response[@"error_code"] integerValue] != 0 ) || // `error_code` != 0
                 [self.senderId isEqual:unknownUserId]) { // `init` failed
                
                [self onSendMessageError:message withError:error];
                
            }
        }];
}

-(void)onSendMessageError:(PPMessage*)message withError:(NSError*)error {
    [message markError];
    [self.collectionView reloadData];
}

@end

@implementation PPMessagesViewController

#pragma mark - Public Api Methods

- (void) initialize {
    [self initializeWithUserEmail:nil];
}

// 初始化 !!!
- (void) initializeWithUserEmail:(NSString *)email {
    NSParameterAssert(self.appKey != nil && self.appKey.length > 0);
    NSParameterAssert(self.appSecret != nil && self.appSecret.length > 0);

    [self startAnimateLoadingUI];    
    
    self.imageDownloadsInProgress = [NSMutableDictionary dictionary];
    self.client = [PPCom instanceWithAppKey:self.appKey withSecret:self.appSecret];
    
    [self.client initilize:email withDelegate:self];
}

- (void)setInputViewPlaceHolder:(NSString *)hintText {
    if ( hintText && hintText.length > 0 ) {
        self.inputToolbar.contentView.textView.placeHolder = hintText;
    }
}

#pragma mark - Controller LifeCycle

- (void)viewDidLoad {
    [super viewDidLoad];
    [self configure];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    self.activityIndicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
    UIBarButtonItem * barButton = [[UIBarButtonItem alloc] initWithCustomView:self.activityIndicator];
    self.navigationItem.rightBarButtonItem = barButton;
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];

    [self releaseResources];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

#pragma mark - Private Methods

- (void)configure {
    self.client = [PPCom instance];
    self.client.messageDelegate = self;
    
    self.senderId = self.client.user.uuid;
    self.senderDisplayName = self.client.user.fullName;
    self.conversationId = self.client.conversationId;

    self.imageDownloadsInProgress = [NSMutableDictionary dictionary];
    
    //create bubble Image
    JSQMessagesBubbleImageFactory *bubbleFactory = [[JSQMessagesBubbleImageFactory alloc] init];
    self.outgoingBubbleImageData = [bubbleFactory outgoingMessagesBubbleImageWithColor:[UIColor jsq_messageBubbleLightGrayColor]];
    self.incomingBubbleImageData = [bubbleFactory incomingMessagesBubbleImageWithColor:[UIColor jsq_messageBubbleGreenColor]];

    //user avatar
    self.collectionView.collectionViewLayout.outgoingAvatarViewSize = CGSizeZero;
    
    //hide left bar button, so can not send photo current
    self.inputToolbar.contentView.leftBarButtonItem = nil;
}

- (void)closePressed:(UIBarButtonItem *)sender
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)prepareLoadData {
    [self startAnimateLoadingUI];
    [self hideLoadEarlierMessageButton];
}

- (void)notifyLoadDataFinish {
    [self stopAnimateLoadingUI];
    [self showLoadEarlierMessageButton];
}

- (void)loadHistory:(NSNumber*)pageOffset withBlock:(void(^)(NSDictionary *response))handler {
    [self prepareLoadData];
    PPComAPI *api = self.client.api;
    NSDictionary *params = @{
        @"conversation_uuid":self.conversationId,
        @"page_offset":@([pageOffset intValue]),
        @"page_size":MESSAGE_PAGE_SIZE,
    };
    [api getMessageHistory:params completionHandler:^(NSDictionary *response, NSError *error) {
            if (!error) {

                if ( [response[@"error_code"] integerValue] == 0 ) {
                    if ( handler ) handler ( response );
                } else {
                    if ( handler ) handler ( nil );
                }
                
            } else {
                PPFastError(@"error:%@", error);
                if ( handler ) handler ( nil );
            }
            [self notifyLoadDataFinish];
        }];
}

#pragma mark - JSQMessageDataSource

- (id<JSQMessageData>)collectionView:(JSQMessagesCollectionView *)collectionView messageDataForItemAtIndexPath:(NSIndexPath *)indexPath {
    return self.jsqMessageArray[indexPath.item];
}

- (id<JSQMessageBubbleImageDataSource>)collectionView:(JSQMessagesCollectionView *)collectionView messageBubbleImageDataForItemAtIndexPath:(NSIndexPath *)indexPath
{
    JSQMessage *message = self.jsqMessageArray[indexPath.item];
    
    if ([message.senderId isEqualToString:self.senderId]) {
        return self.outgoingBubbleImageData;
    }
    
    return self.incomingBubbleImageData;
}

- (id<JSQMessageAvatarImageDataSource>)collectionView:(JSQMessagesCollectionView *)collectionView avatarImageDataForItemAtIndexPath:(NSIndexPath *)indexPath {
    JSQMessage *message = self.jsqMessageArray[indexPath.item];
    if ([message.senderId isEqualToString:self.senderId]) {
        return nil;
    }
    
    PPMessage *ppMessage = self.ppMessageArray[indexPath.item];
    NSString *imageUrl = ppMessage.fromUser != nil ? ppMessage.fromUser.avatarUrl : nil;
    
    return [self.client.jsqAvatarLoader getJSQAvatarImage:ppMessage.fromId withImageUrlString:imageUrl];
}

#pragma mark - UICollectionView DataSource

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.jsqMessageArray.count;
}

- (UICollectionViewCell *)collectionView:(JSQMessagesCollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    /**
     *  Override point for customizing cells
     */
    JSQMessagesCollectionViewCell *cell = (JSQMessagesCollectionViewCell *)[super collectionView:collectionView cellForItemAtIndexPath:indexPath];
    JSQMessage *msg = [self.jsqMessageArray objectAtIndex:indexPath.item];
    
    if (!msg.isMediaMessage) {
        
        if ([msg.senderId isEqualToString:self.senderId]) {
            cell.textView.textColor = [UIColor blackColor];
        }
        else {
            cell.textView.textColor = [UIColor whiteColor];
        }
        
        cell.textView.linkTextAttributes = @{ NSForegroundColorAttributeName : cell.textView.textColor,
                                              NSUnderlineStyleAttributeName : @(NSUnderlineStyleSingle | NSUnderlinePatternSolid) };
        
        PPMessage *message = self.ppMessageArray[indexPath.item];
        id<PPMessageMediaData> mediaData = message.media;
        if (mediaData != nil) {
            [self loadTxtMediaData:mediaData cell:cell indexPath:indexPath];
        }
    } else {
        id<JSQMessageMediaData> mediaData = msg.media;
        
        if ([mediaData isKindOfClass:[JSQPhotoMediaItem class]]) {
            [self loadPhotoItemData:cell mediaData:mediaData indexPath:indexPath];
        } else if ([mediaData isKindOfClass:[JSQFileMediaItem class]]) {
            PPMessage *ppFileMessage = self.ppMessageArray[indexPath.item];
            JSQFileMediaItem *jsqFileItem = (JSQFileMediaItem*)mediaData;
            
            [self appliesMediaViewMaskAsOutgoing:jsqFileItem message:ppFileMessage];

        }
    }
    
    return cell;
}

#pragma mark - JSQMessagesViewController method overrides

- (void)didPressSendButton:(UIButton *)button
           withMessageText:(NSString *)text
                  senderId:(NSString *)senderId
         senderDisplayName:(NSString *)senderDisplayName
                      date:(NSDate *)date {
    
    //首先在界面上显示出来消息
    PPMessage *textMessage = [PPMessage messageWithClient:self.client conversationId:self.conversationId text:text];
    [self.client.dataStorage updateCache:textMessage withClient:self.client];
    
    PPMessageList *messageList = [self.client.dataStorage getCachedMessagesList:self.conversationId autoCreate:YES];
    self.jsqMessageArray = messageList.jsqMessageArray;
    self.ppMessageArray = messageList.ppMessageArray;
    
    [self finishSendingMessageAnimated:YES];
    
    //发送消息
    [self sendMessage:textMessage];
}

- (void)didPressAccessoryButton:(UIButton *)sender
{
    UIActionSheet *sheet = [[UIActionSheet alloc] initWithTitle:nil
                                                       delegate:self
                                              cancelButtonTitle:@"Cancel"
                                         destructiveButtonTitle:nil
                                              otherButtonTitles:@"Photo Library", @"Take Photo", nil];
    
    [sheet showFromToolbar:self.inputToolbar];
}

- (void)collectionView:(JSQMessagesCollectionView *)collectionView
                header:(JSQMessagesLoadEarlierHeaderView *)headerView didTapLoadEarlierMessagesButton:(UIButton *)sender
{
    CGFloat oldOffset = self.collectionView.contentSize.height - self.collectionView.contentOffset.y;
    
    [self loadHistory:[NSNumber numberWithInteger:self.nextPageOffset] withBlock:^(NSDictionary *response) {

            // Duplicate Messages Bug
            
            // NSIndexSet *indexes = [NSIndexSet indexSetWithIndexesInRange:NSMakeRange(0, [response.jsqMessageArray count])];
            // [self.jsqMessageArray insertObjects:response.jsqMessageArray atIndexes:indexes];
            // [self.ppMessageArray insertObjects:response.ppMessageArray atIndexes:indexes];

            if ( response != nil ) {

                PPMessageList *list = [PPMessageList listWithClient:self.client messageListBody:response];
                NSInteger pageOffset = self.nextPageOffset;
                
                //缓存数据
                PPMessageList *cachedList = [self.client.dataStorage getCachedMessagesList:self.conversationId autoCreate:YES];
                [cachedList addPPMessageListToHead:list];
                cachedList.pageOffset = pageOffset;
                [self.client.dataStorage cacheMessagesList:cachedList withConversationId:self.conversationId];
            
                //更新nextPageOffset
                self.nextPageOffset = pageOffset + 1;
                
                [self.collectionView reloadData];
                [self.collectionView layoutIfNeeded];
                self.collectionView.contentOffset = CGPointMake(0.0, self.collectionView.contentSize.height - oldOffset);        
            }
        
        }];
}

- (void)collectionView:(JSQMessagesCollectionView *)collectionView didTapMessageBubbleAtIndexPath:(NSIndexPath *)indexPath
{
    JSQMessage *message = self.jsqMessageArray[indexPath.row];
    if (message.isMediaMessage) {
        id<JSQMessageMediaData> mediaData = (id<JSQMessageMediaData>)message.media;
        if ([mediaData isKindOfClass:[JSQFileMediaItem class]]) {
            if (self.delegate) {
                if ([self.delegate respondsToSelector:@selector(onFileMessageTapped:)]) {
                    JSQFileMediaItem *fileItem = (JSQFileMediaItem*)mediaData;
                    [self.delegate onFileMessageTapped:fileItem.fileURL];
                }
            }
        } else if ([mediaData isKindOfClass:[JSQPhotoMediaItem class]]) {
            if (self.delegate) {
                if ([self.delegate respondsToSelector:@selector(onImageMessageTapped:image:)]) {
                    PPMessage *ppMessage = self.ppMessageArray[indexPath.row];
                    PPPhotoMediaItem *photoItem = (PPPhotoMediaItem*)ppMessage.media;
                    
                    JSQMessage *jsqMessage = self.jsqMessageArray[indexPath.row];
                    JSQPhotoMediaItem *jsqPhotoItem = (JSQPhotoMediaItem*)jsqMessage.media;
                    
                    [self.delegate onImageMessageTapped:[NSURL URLWithString:photoItem.furl] image:jsqPhotoItem.image];
                }
            }
        }
    }
}

- (NSAttributedString *)collectionView:(JSQMessagesCollectionView *)collectionView attributedTextForCellBottomLabelAtIndexPath:(NSIndexPath *)indexPath {
    
    PPMessage *message = self.ppMessageArray[indexPath.row];
    if (message.error) {
        UIColor *color = [UIColor redColor];
        NSDictionary *attrs = @{ NSForegroundColorAttributeName : color};
        return [[NSAttributedString alloc] initWithString:message.errorDescription attributes:attrs];
    }
    
    return nil;
}

// 什么时候显示时间戳
- (NSAttributedString *)collectionView:(JSQMessagesCollectionView *)collectionView attributedTextForCellTopLabelAtIndexPath:(NSIndexPath *)indexPath
{
    JSQMessage *oldMessage = nil;
    JSQMessage *message = [self.jsqMessageArray objectAtIndex:indexPath.item];
    
    if ( self.jsqMessageArray.count > 0 ) {
        oldMessage = [ self.jsqMessageArray objectAtIndex:(self.jsqMessageArray.count - 1) ];
    }
    
    if ( oldMessage != nil ) {
        
        if ( (int)message.date.timeIntervalSince1970 - (int)oldMessage.date.timeIntervalSince1970 >= (int)TIMESTAMP_DELAY ) {
            return [[JSQMessagesTimestampFormatter sharedFormatter] attributedTimestampForDate:message.date];
        }
            
    } else {
        // current message is the first one message that user send or received
        // show timestamp
        return [[JSQMessagesTimestampFormatter sharedFormatter] attributedTimestampForDate:message.date];    
    }
    
    return nil;
}

- (CGFloat)collectionView:(JSQMessagesCollectionView *)collectionView
                   layout:(JSQMessagesCollectionViewFlowLayout *)collectionViewLayout heightForCellTopLabelAtIndexPath:(NSIndexPath *)indexPath {
    JSQMessage *oldMessage = nil;
    JSQMessage *message = [self.jsqMessageArray objectAtIndex:indexPath.item];
    
    if ( self.jsqMessageArray.count > 0 ) {
        oldMessage = [ self.jsqMessageArray objectAtIndex:(self.jsqMessageArray.count - 1) ];
    }
    
    if ( oldMessage != nil ) {

        if ( (int)message.date.timeIntervalSince1970 - (int)oldMessage.date.timeIntervalSince1970 >= (int)TIMESTAMP_DELAY ) {
            return kJSQMessagesCollectionViewCellLabelHeightDefault;
        }
            
    } else {
        // current message is the first one message that user send or received
        // show timestamp
        return kJSQMessagesCollectionViewCellLabelHeightDefault;    
    }
    
    return 0.0f;
}

- (CGFloat)collectionView:(JSQMessagesCollectionView *)collectionView
                   layout:(JSQMessagesCollectionViewFlowLayout *)collectionViewLayout heightForCellBottomLabelAtIndexPath:(NSIndexPath *)indexPath
{
    PPMessage *message = self.ppMessageArray[indexPath.row];
    if (message.error) {
        return kJSQMessagesCollectionViewCellLabelHeightDefault;
    }
    return 0.0f;
}

#pragma mark - Load Media Data

- (void)appliesMediaViewMaskAsOutgoing:(JSQMediaItem*)jsqMediaItem message:(PPMessage*)message {
    if (![message.fromId isEqual:self.client.user.uuid]) {
        jsqMediaItem.appliesMediaViewMaskAsOutgoing = NO;
    }
}

- (void)loadPhotoItemData:(JSQMessagesCollectionViewCell *)cell mediaData:(id)mediaData indexPath:(NSIndexPath *)indexPath
{
    JSQPhotoMediaItem *mediaItem = (JSQPhotoMediaItem*)mediaData;
    
    if (mediaItem.image) {
        return;
    }
    
    PPMessage *ppMessage = self.ppMessageArray[indexPath.item];
    PPPhotoMediaItem *ppPhotoMediaItem = (PPPhotoMediaItem*)ppMessage.media;
    [self appliesMediaViewMaskAsOutgoing:mediaItem message:ppMessage];
    
    ImageDownloader *downloader = self.imageDownloadsInProgress[indexPath];
    if (downloader == nil) {
        downloader = [[ImageDownloader alloc] init];
        self.imageDownloadsInProgress[indexPath] = downloader;
    }
    
    [downloader startDownload:ppPhotoMediaItem.furl completionHandler:^(UIImage *image) {
            mediaItem.image = image;
            [self.collectionView reloadData];
        }];
}

- (void)loadTxtMediaData:(id)mediaData cell:(JSQMessagesCollectionViewCell *)cell indexPath:(NSIndexPath*)indexPath
{
    PPTxtMediaItem *txtMediaData = (PPTxtMediaItem*)mediaData;
    if (txtMediaData) {
        if (txtMediaData.state == PPTxtMediaItemLoadStateDone || txtMediaData.state == PPTxtMediaItemLoadStateLoading) {
            return;
        }
        
        txtMediaData.state = PPTxtMediaItemLoadStateLoading;
        [self.client.txtLoader loadTxt:txtMediaData.txtUrl withBlock:^(NSError *error, NSString *content) {
                //更新state
                txtMediaData.state = PPTxtMediaItemLoadStateDone;
                // 通知刷新
                JSQMessage *jsqMessage = self.jsqMessageArray[indexPath.row];
                jsqMessage.text = content;
                [self.collectionView reloadData];
            }];
    }
}

#pragma mark - UIActionSheetDelegate

- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex {
    if (buttonIndex == actionSheet.cancelButtonIndex) {
        return;
    }
    
    switch (buttonIndex) {
    case 0:{
        PPImagePickerDelegate *delegate = [[PPImagePickerDelegate alloc] init];
        [self startMediaBrowserFromViewController:[self navigationController] usingDelegate:delegate];
        break;
    }
    case 1:{
        PPCameraViewDelegate *delegate = [[PPCameraViewDelegate alloc] init];
        [self startCameraControllerFromViewController:self usingDelegate:delegate];
        break;
    }
    }
}

- (BOOL) startMediaBrowserFromViewController: (UIViewController*) controller
                               usingDelegate: (id <UIImagePickerControllerDelegate,
                                               UINavigationControllerDelegate>) delegate {
    if (([UIImagePickerController isSourceTypeAvailable:
                                      UIImagePickerControllerSourceTypeSavedPhotosAlbum] == NO)
        || (delegate == nil)
        || (controller == nil))
        return NO;
    
    UIImagePickerController *mediaUI = [[UIImagePickerController alloc] init];
    mediaUI.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
    
    // Displays saved pictures and movies, if both are available, from the
    // Camera Roll album.
    mediaUI.mediaTypes =
        [UIImagePickerController availableMediaTypesForSourceType:
                                     UIImagePickerControllerSourceTypePhotoLibrary];
    
    // Hides the controls for moving & scaling pictures, or for
    // trimming movies. To instead show the controls, use YES.
    mediaUI.allowsEditing = NO;
    
    mediaUI.delegate = delegate;
    
    [controller presentViewController:mediaUI animated:YES completion:^{
            NSLog(@"present view controller completion.");
        }];
    return YES;
}

- (BOOL) startCameraControllerFromViewController: (UIViewController*) controller
                                   usingDelegate: (id <UIImagePickerControllerDelegate,
                                                   UINavigationControllerDelegate>) delegate {
    
    if (([UIImagePickerController isSourceTypeAvailable:
                                      UIImagePickerControllerSourceTypeCamera] == NO)
        || (delegate == nil)
        || (controller == nil))
        return NO;
    
    
    UIImagePickerController *cameraUI = [[UIImagePickerController alloc] init];
    cameraUI.sourceType = UIImagePickerControllerSourceTypeCamera;
    
    // Displays a control that allows the user to choose picture or
    // movie capture, if both are available:
    cameraUI.mediaTypes =
        [UIImagePickerController availableMediaTypesForSourceType:
                                     UIImagePickerControllerSourceTypeCamera];
    
    // Hides the controls for moving & scaling pictures, or for
    // trimming movies. To instead show the controls, use YES.
    cameraUI.allowsEditing = NO;
    
    cameraUI.delegate = delegate;
    
    [controller presentViewController:cameraUI animated:YES completion:^{
        }];
    return YES;
}

#pragma mark - Animate Loading UI

- (void)startAnimateLoadingUI {
    [self.activityIndicator startAnimating];
}

- (void)stopAnimateLoadingUI {
    [self.activityIndicator stopAnimating];
}

- (void)showLoadEarlierMessageButton {
    self.showLoadEarlierMessagesHeader = YES;
}

- (void)hideLoadEarlierMessageButton {
    self.showLoadEarlierMessagesHeader = NO;
}

#pragma mark - PP Message Arrived Delegate

-(void)onNewMessageArrived:(PPMessage *)message {
    if (message != nil) {
        //更新缓存
        if ([self.client.dataStorage updateCache:message withClient:self.client]) {
            //更新本地数据
            PPMessageList *messageList = [self.client.dataStorage getCachedMessagesList:self.conversationId autoCreate:YES];
            self.jsqMessageArray = messageList.jsqMessageArray;
            self.ppMessageArray = messageList.ppMessageArray;
            //通知接受消息完毕
            [self finishReceivingMessageAnimated:YES];
        }
    }
}

-(void)createConversation {
    NSLog(@"PPMessagesViewController - create Conversation");
}

#pragma mark - PPCom Delegate Methods

- (void)onInitSuccess:(PPUser*)user conversationId:(NSString *)conversationId {
    PPFastLog(@"Initialize success");

    self.senderId = user.uuid;
    self.senderDisplayName = user.fullName;
    self.conversationId = conversationId;

    [self updateLocalMessageFromCache:conversationId];
    [self.collectionView reloadData];
    [self stopAnimateLoadingUI];
    [self showLoadEarlierMessageButton];
    
}

- (void)onGetUserInfo:(PPUser *)user {
    PPFastLog(@"Initialize get user:%@", user);

    if ( user ) {
        self.senderId = user.uuid;
        self.senderDisplayName = user.fullName;
    }
}

- (void) onInitError:(NSError *)error with:(NSDictionary *)errorResponse {
    PPFastError(@"Initialize error: %@", error ? error : ( errorResponse ? errorResponse : @"unknown error" ));
    
    [self updateLocalMessageFromCache:self.conversationId];
    [self.collectionView reloadData];
    [self stopAnimateLoadingUI];
    [self showLoadEarlierMessageButton];
}

@end
