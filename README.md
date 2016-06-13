
<!-- Customer             |  Service -->
<!-- :-------------------------:|:-------------------------: -->
<!-- ![](ppmessage/doc/ppcom.gif)  | ![](ppmessage/doc/ppkefu.gif) -->

<img src="ppmessage/doc/ppkefu-ppcom.gif" height=200px></img>

[In Chinese 中文版](ppmessage/doc/zh-cn/README.md)

# PPMessage

With PPMessage, you can chat with visitor or customer via Web or mobile App as open source [Intercom](http://intercom.io) alternative.

PPMessage targets to run on Linux, Mac OS X operation system. And PPMessage includes a clearly API system which could be integrated with any open source Content Management System like Wordpress, Drupal and any commercial system even a e-commerce system.

PPMessage includes a series of frontend SDK named **PPCom** which run on your visitor or customer side, and a series of frontend App named **PPKefu** which run on your service team side.

**PPConsole** is Web admin interface of PPMessage and open sourced as well. After PPMessage backend running, PPConsole provided a Web interface to manager the PPMessage system. 


## SUBPROJECTS

* [PPCom iOS SDK](https://github.com/PPMESSAGE/ppcom-ios-sdk)

* [PPCom Android SDK](https://github.com/PPMESSAGE/ppcom-android-sdk)


## EASY START

> Clone the code

`
git clone https://github.com/PPMESSAGE/ppmessage.git
`

> Install requirements if you are under Debian/Ubuntu


`
bash ppmessage/scripts/set-up-ppmessage-on-linux.sh
`

> Install requirements if you are under macOS


`
bash ppmessage/scripts/set-up-ppmessage-on-mac.sh
`

> Run

`
python ppmessage/backend/main.py
`

> Open your brower to access `http://127.0.0.1:8945`



## DOCOMENTS

> In the following, list some document to use and develope PPMessage. More on [PPMessage Site](https://ppmessage.com).

* [Complete english manual](https://ppmessage.gitbooks.io/ppbook-en/content/)


## LICENSE 

[Apache License](LICENSE.md)

Any change or use must include the license file.

