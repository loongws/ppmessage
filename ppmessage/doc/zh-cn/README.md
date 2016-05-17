![PPMessage Demo](/ppmessage/doc/ppkefu-ppcom.gif)

[In English](/README.md)

# PPMessage - 皮皮消息，即插即用，在线客服，移动应用内即时通讯，私有的·微信·，自建的·钉钉·，开源，纯Python实现。

PPMessage 是一个开源的在线客服平台。PPMessage能够帮助你在第一时间与你的客户建立联系，开发人员可以非常容易的将 PPMessage 集成到你的网站或者 iOS、Android 的应用中。PPMessage 的前端后端都是开源的，后端全部基于 Python，简洁高效。前端根据不同平台提供原生的SDK。

基于 PPMessage 还能实现私有的·微信·功能，在企业内部或者私有云上建立自主的·微信·服务器；也可以将 PPMessage 与企业业务系统整合，实现自建的·钉钉·系统。

PPMessage 后端建议部署到 Linux 上，推荐使用 Debian 或者 Ubuntu，同时支持 Mac OS X 系统，方便开发者测试。

PPMessage 提供了完整而清晰的 API 和 OAuth 系统，所有前端应用和 SDK 都是通过调用或者封装后端的 API 而实现。PPMessage 能够做到最大程度和最底层的整合开发。

PPMessage 包含由数个 Python 后台应用组成的后端，Python 后端应用通过 Supervisor 统一管理，通过 Nginx 反向代理进行 HTTP 请求的统一分发和负载均衡。PPMessage 的后端使用了 Mysql 数据库，事实上 PPMessage 后端并没有直接操作数据库，直接操作数据库速度不能满足 PPMessage 支持大并发量消息服务，PPMessage 所有的数据操作通过单独的、异步的 Cache 服务完成。 

PPMessage 的前端开发 SDK 称为 PPCom，PPCom 会被集成到你的企业 Web 站点，Android、iOS 应用之中，为你的客户提供建立联系的入口；给客服和企业组织内部人员使用的前端应用叫做 PPKefu，PPKefu 可以运行在 Web 端，Windows、Mac 和 Linux 桌面端，Android、iOS 移动应用端，几乎支持所有的可以运行应用的平台，让你的客服人员随时随地为你的客户提供服务或者建立联系。

PPMessage 同时提供了一个 Web 管理界面，称之为 PPConsole，当然也是开源的，PPConsole 提供一个管理界面去管理配置 PPMessage。PPConsole 同时也集成了一些企业运营所需的常用功能，探索使用 PPConsole 让它为你的企业业务服务。通过使用 PPConsole 上的企业应用，PPMessage 完全成为了一个自主、自建的企业微信，或者是阿里钉钉，但是数据和程序以及安全性却能得到充分的保障。 
 
> 下面是PPMessage提供的一些文档，详细信息及在线体验PPMessage，请访问[PPMessage Site](https://ppmessage.com)。

* [在 Debian 8.4 上安装 PPMessage](/ppmessage/doc/zh-cn/install-ppmessage-on-debian.md)
* [在 Ubuntu Server 16.04 上安装 PPMessage](/ppmessage/doc/zh-cn/install-ppmessage-on-ubuntu.md)

> 完全参考手册，请关注 PPMessage 在 GitBook 上的持续更新

* [PPMessage Book](https://ppmessage.gitbooks.io/ppbook/content/)


<!--

* [在线使用PPMessage](/ppmessage/doc/zh-cn/online-ppmessage-guide.md) 

* [从源码开始](/ppmessage/doc/zh-cn/install.md)

* [使用手册](/ppmessage/doc/zh-cn/user-manual.md)

* [开发手册](/ppmessage/doc/zh-cn/developer-manual.md)

-->


