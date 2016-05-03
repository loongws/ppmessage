//
//  PPMessagesViewController+PPCellTopLabel.m
//  PPComLib
//
//  Created by PPMessage on 4/12/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPMessagesViewController+PPCellTopLabel.h"

#import "JSQMessage.h"
#import "JSQMessagesTimestampFormatter.h"

NSInteger const PPTimestampDelay = 5 * 60; // 5 mins

@implementation PPMessagesViewController (PPCellTopLabel)

- (NSAttributedString *)PPCellTopLabelStringAtIndexPath:(NSIndexPath*)indexPath
                                           jsqMesssages:(NSMutableArray *)jsqMessagesArray {
    
    BOOL showTimestamp = [self PPShowTimstampAtIndexPath:indexPath jsqMessages:jsqMessagesArray];
    if (showTimestamp) {
        JSQMessage *message = [jsqMessagesArray objectAtIndex:indexPath.item];
        return [[JSQMessagesTimestampFormatter sharedFormatter] attributedTimestampForDate:message.date];
    }
    
    return nil;
    
}

- (CGFloat)PPCellTopLabelHeightAtIndexPath:(NSIndexPath *)indexPath
                               jsqMessages:(NSMutableArray *)jsqMessagesArray {
    BOOL showTimestamp = [self PPShowTimstampAtIndexPath:indexPath jsqMessages:jsqMessagesArray];
    if (showTimestamp) {
        return kJSQMessagesCollectionViewCellLabelHeightDefault;
    }
    return 0.0f;
}

#pragma mark - helpers

- (BOOL)PPShowTimstampAtIndexPath:(NSIndexPath*)indexPath
                      jsqMessages:(NSMutableArray*)jsqMessagesArray {
    
    if (!jsqMessagesArray) return NO;
    if (jsqMessagesArray.count < 2) return NO;
    
    JSQMessage *currentJsqMessage = [jsqMessagesArray objectAtIndex:indexPath.row];
    JSQMessage *nextJsqMessage = [self findNextJsqMessageAfterIndexPath:indexPath jsqMessages:jsqMessagesArray];
    
    if (!nextJsqMessage) return NO;
    
    NSTimeInterval currentTimestampInSeconds = currentJsqMessage.date.timeIntervalSince1970;
    NSTimeInterval nextTimestampInSeconds = nextJsqMessage.date.timeIntervalSince1970;
    
    return nextTimestampInSeconds - currentTimestampInSeconds > PPTimestampDelay;

}

- (JSQMessage *)findNextJsqMessageAfterIndexPath:(NSIndexPath*)indexPath
                                     jsqMessages:(NSMutableArray*)jsqMessagesArray {
    if (indexPath.row + 1 >= jsqMessagesArray.count) return nil;
    return jsqMessagesArray[indexPath.row + 1];
}

@end
