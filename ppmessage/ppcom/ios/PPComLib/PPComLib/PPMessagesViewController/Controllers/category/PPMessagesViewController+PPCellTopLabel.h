//
//  PPMessagesViewController+PPCellTopLabel.h
//  PPComLib
//
//  Created by PPMessage on 4/12/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import <PPComLib/PPComLib.h>

FOUNDATION_EXPORT NSInteger const PPTimestampDelay; // default time delay to decide whether or not to show timestamp

@interface PPMessagesViewController (PPCellTopLabel)

/**
 * Cell top label text at the specified `indexPath`
 *
 * @param indexPath
 * @param jsqMessagesArray exist messages in memory
 *
 * @return NSAttributedString if show timestamp; else nil
 */
- (NSAttributedString *)PPCellTopLabelStringAtIndexPath:(NSIndexPath*)indexPath
                                           jsqMesssages:(NSMutableArray*)jsqMessagesArray;

/**
 * Cell top label height at the specified `indexPath`
 *
 * @param indexPath
 * @param jsqMessagesArray exit messages in memory
 *
 * @return if show timestamp, return height which > 0; else return .0f;
 */
- (CGFloat)PPCellTopLabelHeightAtIndexPath:(NSIndexPath*)indexPath
                               jsqMessages:(NSMutableArray*)jsqMessagesArray;

@end
