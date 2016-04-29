//
//  PPViewUtils.m
//  PPComLib
//
//  Created by PPMessage on 4/13/16.
//  Copyright © 2016 Yvertical. All rights reserved.
//

#import "PPViewUtils.h"

UIAlertView* PPMakeWarningAlert(NSString *message) {
    UIAlertView *warnAlertView = [[UIAlertView alloc] initWithTitle:@"错误" message:message delegate:nil cancelButtonTitle:@"好" otherButtonTitles:nil];
    return warnAlertView;
}