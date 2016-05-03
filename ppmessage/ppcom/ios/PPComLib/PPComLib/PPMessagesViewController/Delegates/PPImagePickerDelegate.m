//
//  PPImagePickerDelegate.m
//  PPComDemo
//
//  Created by Kun Zhao on 9/29/15.
//  Copyright (c) 2015 Yvertical. All rights reserved.
//

#import "PPImagePickerDelegate.h"
#import <MobileCoreServices/MobileCoreServices.h>

@implementation PPImagePickerDelegate

- (void) imagePickerController: (UIImagePickerController *) picker
 didFinishPickingMediaWithInfo: (NSDictionary *) info {
    
    NSString *mediaType = [info objectForKey: UIImagePickerControllerMediaType];
    UIImage *originalImage, *editedImage, *imageToUse;
    
    // Handle a still image picked from a photo album
    if (CFStringCompare ((CFStringRef) mediaType, kUTTypeImage, 0)
        == kCFCompareEqualTo) {
        
        editedImage = (UIImage *) [info objectForKey:
                                   UIImagePickerControllerEditedImage];
        originalImage = (UIImage *) [info objectForKey:
                                     UIImagePickerControllerOriginalImage];
        
        if (editedImage) {
            imageToUse = editedImage;
        } else {
            imageToUse = originalImage;
        }
        // Do something with imageToUse
    }
    
    [[picker parentViewController] dismissViewControllerAnimated:YES completion:^{
        NSLog(@"UIImagePickerController dismiss.");
    }];
}

@end
