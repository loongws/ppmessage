# The important things you should note in making `PPComDemo Framework`

## Framework

### Tutorial:

[How to create your own iOS framework](http://www.cocoachina.com/ios/20150127/11022.html)

### Public headers:

JSQMessagesCollectionViewFlowLayout.h
JSQMessagesCollectionView.h
JSQMessagesViewController.h
JSQMessagesInputToolbar.h
JSQMessagesKeyboardController.h
JSQMessagesCollectionViewDelegateFlowLayout.h
JSQMessagesToolbarContentView.h
JSQMessagesComposerTextView.h
JSQMessagesCollectionViewDataSource.h
JSQMessagesBubbleSizeCalculating.h
JSQMessagesLabel.h
JSQMessagesCollectionViewCell.h
JSQMessagesCellTextView.h

PPMessagesViewController.h
PPComLib.h

### Generate Framework And Bundle Resources

You should select `iOS Device` which located in the left top corner in Xcode to 
build Framework, instead of other devices.

## `PPComLibDev` Project

### add `-ObjC -all_load` link flag

Select `TARGETS`-->`Build Settings`, add `-ObjC -all_load` link flag to the key `Other Linker Flags` which in `Linking` section.

### add `libicucore.dylib`

## `PPComDemo` Project

### add `libicucore.dylib`
### add `-ObjC -all_load` link flag
