
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

> Clone and change directory into ppmessage project

```bash
git clone https://github.com/PPMESSAGE/ppmessage.git
cd ppmessage
```

> Requirements under Debian/Ubuntu


```bash
bash ppmessage/scripts/set-up-ppmessage-on-linux.sh
```

> Requirements under macOS


```bash
bash ppmessage/scripts/set-up-ppmessage-on-mac.sh
```

> Build 

```bash
bash dist.sh bootstrap
bash dist.sh npm
bash dist.sh bower
bash dist.sh gulp
```

> Run

```bash
python ppmessage/backend/main.py
```

> Access

`
Open your browser to access `http://127.0.0.1:8945`

`


## DOCOMENTS

> In the following, list some document to use and develope PPMessage. More on [PPMessage Site](https://ppmessage.com).

* [Complete english manual](https://ppmessage.gitbooks.io/ppbook-en/content/)


## LICENSE 

[Apache License](LICENSE.md)

Copyright (c) 2010-2016, PPMESSAGE team and contributors - https://www.ppmessage.com and https://github.com/PPMESSAGE/ppmessage

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

