### PPMessage releases
This directory is where we put PPMessage binary installers and robosoft resources.
The directory tree should be as follows.

    .
    |-- v1.1.1
    |   |-- PPMessage-v1.1.1-osx-PAD.xml
    |   |-- PPMessage-v1.1.1-win32-PAD.xml
    |   |-- PPMessage-v1.1.1-win64-PAD.xml
    |   |-- PPMessage-v1.2.0-android-PAD.xml
    |   |-- PPMessage-v1.1.1-osx.dmg
    |   |-- PPMessage-v1.1.1-win32-setup.exe
    |   |-- PPMessage-v1.1.1-win64-setup.exe
    |   |-- PPMessage-v1.2.0.apk
    |
    |-- robosoft-resources
        |-- PPMessage-electron-screenshoot.png
        |-- PPMessage-android-screenshoot.png
        |-- PPMessage-electron-icon.gif
        |-- PPMessage-android-icon.gif
        

Robosoft requires we provide these resources
    
    a icon.gif(32x32) url 
    a screenshoot.png(<=800x600) url
    a target binary file download url
    a PAD.xml file url (not created by us, but by robosoft itself)
    
After a successfull validation , we export a PAD.xml and put it in the right place(must match the url we provided before).

The robosoft-resources directory is added to git respository as it contains only size-limited images and is unlike to change.
