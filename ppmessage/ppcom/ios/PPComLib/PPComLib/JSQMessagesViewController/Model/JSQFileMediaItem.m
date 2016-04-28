//
//  JSQFileMediaItem.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/28/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "JSQFileMediaItem.h"

#import "JSQMessagesMediaPlaceholderView.h"
#import "JSQMessagesMediaViewBubbleImageMasker.h"

#import "UIColor+JSQMessages.h"
#import "UIImage+JSQMessages.h"
#import "UIView+JSQMessages.h"

#import <UIKit/UIKit.h>

@interface JSQFileMediaItem ()

@property UIView *cachedfileContainerView;

@end

@implementation JSQFileMediaItem

#pragma mark - Initizlize Methods

- (instancetype)initWithFileURL:(NSURL*)fileURL displayName:(NSString*)fileName {
    if (self = [super init]) {
        _fileURL = fileURL;
        _fileName = fileName;
        _cachedfileContainerView = nil;
    }
    return self;
}

- (void)dealloc {
    _fileURL = nil;
    _fileName = nil;
    _cachedfileContainerView = nil;
}

- (void)clearCachedMediaViews
{
    [super clearCachedMediaViews];
    _cachedfileContainerView = nil;
}

#pragma mark - Setters

- (void)setAppliesMediaViewMaskAsOutgoing:(BOOL)appliesMediaViewMaskAsOutgoing
{
    [super setAppliesMediaViewMaskAsOutgoing:appliesMediaViewMaskAsOutgoing];
    _cachedfileContainerView = nil;
}

#pragma mark - JSQMessageMediaData protocol

- (UIView *)mediaView
{
    if (self.fileURL == nil) {
        return nil;
    }
    
    if (self.cachedfileContainerView == nil) {
        UIView *fileContainer = [UIView autolayoutView];
        CGSize size = [self mediaViewDisplaySize];
        fileContainer.frame = CGRectMake(0.0f, 0.0f, size.width, size.height);
        fileContainer.backgroundColor = [UIColor jsq_messageBubbleGreenColor];
        
        UIImageView *attachment = [UIImageView autolayoutView];
        attachment.image = [UIImage jsq_defaultFileAttachmentImage];
        [fileContainer addSubview:attachment];
        
        UIView *separator = [UIView autolayoutView];
        separator.backgroundColor = [UIColor whiteColor];
        [fileContainer addSubview:separator];
        
        UILabel *label = [UILabel autolayoutView];
        label.textColor = [UIColor whiteColor];
        NSMutableAttributedString *attributeString = [[NSMutableAttributedString alloc] initWithString:self.fileName];
        [attributeString addAttribute:NSUnderlineStyleAttributeName value:[NSNumber numberWithInt:1] range:(NSRange){0, [attributeString length]}];
        label.attributedText = attributeString;
        label.userInteractionEnabled = YES;
        [fileContainer addSubview:label];
        
        NSDictionary *metrics = @{@"spacing":@10.0, @"leftSpacing":@15.0, @"attachmentSize":@24.0, @"height":@30.0};
        NSDictionary *views = NSDictionaryOfVariableBindings(attachment, separator, label);
        [fileContainer addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"|-leftSpacing-[attachment(attachmentSize)]-[separator(2.0)]-[label]-<=spacing-|" options:NSLayoutFormatAlignAllTop|NSLayoutFormatAlignAllBottom metrics:metrics views:views]];
        [fileContainer addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:|-spacing-[separator]->=spacing-|" options:0 metrics:metrics views:views]];
        
        [JSQMessagesMediaViewBubbleImageMasker applyBubbleImageMaskToMediaView:fileContainer isOutgoing:self.appliesMediaViewMaskAsOutgoing];
        self.cachedfileContainerView = fileContainer;
    }
    
    return self.cachedfileContainerView;
}

- (NSUInteger)mediaHash
{
    return self.hash;
}

- (CGSize)mediaViewDisplaySize
{
    return CGSizeMake(210.0f, 42.0f);
}

#pragma mark - NSCoding

- (instancetype)initWithCoder:(NSCoder *)aDecoder
{
    self = [super initWithCoder:aDecoder];
    if (self) {
        _fileURL = [aDecoder decodeObjectForKey:NSStringFromSelector(@selector(fileURL))];
    }
    return self;
}

- (void)encodeWithCoder:(NSCoder *)aCoder
{
    [super encodeWithCoder:aCoder];
    [aCoder encodeObject:self.fileURL forKey:NSStringFromSelector(@selector(fileURL))];
}

#pragma mark - NSObject

- (BOOL)isEqual:(id)object
{
    if (![super isEqual:object]) {
        return NO;
    }
    
    JSQFileMediaItem *fileItem = (JSQFileMediaItem*)object;
    return [self.fileName isEqual:fileItem.fileName] && [self.fileURL isEqual:fileItem.fileURL];
}

- (NSUInteger)hash
{
    return super.hash ^ self.fileURL.hash ^ self.fileName.hash;
}

#pragma mark - NSCopying

- (instancetype)copyWithZone:(NSZone *)zone
{
    JSQFileMediaItem *copy = [[JSQFileMediaItem allocWithZone:zone] initWithFileURL:self.fileURL displayName:self.fileName];
    copy.appliesMediaViewMaskAsOutgoing = self.appliesMediaViewMaskAsOutgoing;
    return copy;
}

@end
