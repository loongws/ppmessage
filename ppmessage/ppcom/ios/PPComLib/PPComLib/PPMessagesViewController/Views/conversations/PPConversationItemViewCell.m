//
//  PPConversationItemViewCell.m
//  PPComLib
//
//  Created by PPMessage on 4/1/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPConversationItemViewCell.h"
#import "PPBadgeSquareImageView.h"
#import "PPLayoutConstraintsUtils.h"

NSString *const PPConversationItemViewCellIdentifier = @"PPConversationItemViewCellIdentifier";

static CGFloat const PPAvatarWidth = 48;
static CGFloat const PPTimestampWidth = 100;
CGFloat const PPConversationItemViewHeight = 64;

@implementation PPConversationItemViewCell

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self pp_init];
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    self = [super initWithCoder:aDecoder];
    if (self) {
        [self pp_init];
    }
    return self;
}

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        [self pp_init];
    }
    return self;
}

- (void)pp_init {
    
    _avatarView = [PPBadgeSquareImageView new];
    _avatarView.contentMode = UIViewContentModeScaleToFill;
    _avatarView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.contentView addSubview:_avatarView];
    
    _displayNameLabel = [UILabel new];
    _displayNameLabel.translatesAutoresizingMaskIntoConstraints = NO;
    [self.contentView addSubview:_displayNameLabel];
    
    _msgSummaryLabel = [UILabel new];
    _msgSummaryLabel.translatesAutoresizingMaskIntoConstraints = NO;
    _msgSummaryLabel.textColor = [UIColor lightGrayColor];
    _msgSummaryLabel.font = [UIFont systemFontOfSize:15];
    [self.contentView addSubview:_msgSummaryLabel];
    
    _msgTimestampLabel = [UILabel new];
    _msgTimestampLabel.translatesAutoresizingMaskIntoConstraints = NO;
    _msgTimestampLabel.textAlignment = NSTextAlignmentRight;
    [self.contentView addSubview:_msgTimestampLabel];
    
    [self configureAvatarLayoutConstraints];
    [self configureDisplayNameLayoutConstraints];
    [self configureMsgTimestampLayoutConstraints];
    [self configureMsgSummaryLayoutConstraints];
    
}

- (void)configureAvatarLayoutConstraints {
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_avatarView attribute:NSLayoutAttributeLeading relatedBy:NSLayoutRelationEqual toItem:self.contentView attribute:NSLayoutAttributeLeading multiplier:1.0 constant:8.0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_avatarView attribute:NSLayoutAttributeCenterY relatedBy:NSLayoutRelationEqual toItem:self.contentView attribute:NSLayoutAttributeCenterY multiplier:1.0 constant:0]];
    
    PPPadding(_avatarView.imageView, self.contentView, PPAvatarWidth, PPPaddingMaskWidth | PPPaddingMaskHeight);
}

- (void)configureDisplayNameLayoutConstraints {
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_displayNameLabel attribute:NSLayoutAttributeTop relatedBy:NSLayoutRelationEqual toItem:self.contentView attribute:NSLayoutAttributeTop multiplier:1.0 constant:8.0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_displayNameLabel attribute:NSLayoutAttributeLeading relatedBy:NSLayoutRelationEqual toItem:_avatarView attribute:NSLayoutAttributeTrailing multiplier:1.0 constant:8.0]];
    
}

- (void)configureMsgTimestampLayoutConstraints {
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_msgTimestampLabel attribute:NSLayoutAttributeLeading relatedBy:NSLayoutRelationEqual toItem:_displayNameLabel attribute:NSLayoutAttributeTrailing multiplier:1.0 constant:8.0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_msgTimestampLabel attribute:NSLayoutAttributeTrailing relatedBy:NSLayoutRelationEqual toItem:self.contentView attribute:NSLayoutAttributeTrailing multiplier:1.0 constant:-8.0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_msgTimestampLabel attribute:NSLayoutAttributeTop relatedBy:NSLayoutRelationEqual toItem:self.contentView attribute:NSLayoutAttributeTop multiplier:1.0 constant:8.0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_msgTimestampLabel attribute:NSLayoutAttributeWidth relatedBy:NSLayoutRelationEqual toItem:nil attribute:NSLayoutAttributeNotAnAttribute multiplier:1.0 constant:PPTimestampWidth]];
    
}

- (void)configureMsgSummaryLayoutConstraints {
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_msgSummaryLabel attribute:NSLayoutAttributeLeading relatedBy:NSLayoutRelationEqual toItem:_avatarView attribute:NSLayoutAttributeTrailing multiplier:1.0 constant:8.0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_msgSummaryLabel attribute:NSLayoutAttributeTop relatedBy:NSLayoutRelationEqual toItem:_displayNameLabel attribute:NSLayoutAttributeBottom multiplier:1.0 constant:8.0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_msgSummaryLabel attribute:NSLayoutAttributeBottom relatedBy:NSLayoutRelationEqual toItem:self.contentView attribute:NSLayoutAttributeBottom multiplier:1.0 constant:-8.0]];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:_msgSummaryLabel attribute:NSLayoutAttributeTrailing relatedBy:NSLayoutRelationEqual toItem:self.contentView attribute:NSLayoutAttributeTrailing multiplier:1.0 constant:-8.0]];
    
}

@end
