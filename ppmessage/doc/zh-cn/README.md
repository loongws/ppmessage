![PPMessage Demo](/ppmessage/doc/ppkefu-ppcom.gif)

[In English](/README.md)

# PPMessage - 皮皮消息，即插即用，在线客服，移动应用内即时通讯，私有的·微信·，自建的·钉钉·，开源，纯Python实现。

PPMessage 是一个开源的在线客服平台。PPMessage能够帮助你在第一时间与你的客户建立联系，开发人员可以非常容易的将 PPMessage 集成到你的网站或者 iOS、Android 的应用中。PPMessage 的前端后端都是开源的，后端全部基于 Python，简洁高效。前端根据不同平台提供原生的SDK。

基于 PPMessage 还能实现私有的·微信·功能，在企业内部或者私有云上建立自主的·微信·服务器；也可以将 PPMessage 与企业业务系统整合，实现自建的·钉钉·系统。

PPMessage 后端建议部署到 Linux 上，推荐使用 Debian 或者 Ubuntu，同时支持 Mac OS X 系统，方便开发者测试。

PPMessage 提供了完整而清晰的 API 和 OAuth 系统，所有前端应用和 SDK 都是通过调用或者封装后端的 API 而实现。PPMessage 能够做到最大程度和最底层的整合开发。


PPMessage 的前端开发 SDK 称为 PPCom，PPCom 会被集成到你的企业 Web 站点，Android、iOS 应用之中，为你的客户提供建立联系的入口；给客服和企业组织内部人员使用的前端应用叫做 PPKefu，PPKefu 可以运行在 Web 端，Windows、Mac 和 Linux 桌面端，Android、iOS 移动应用端，几乎支持所有的可以运行应用的平台，让你的客服人员随时随地为你的客户提供服务或者建立联系。

PPMessage 同时提供了一个 Web 管理界面，称之为 PPConsole，当然也是开源的，PPConsole 提供一个管理界面去管理配置 PPMessage。PPConsole 同时也集成了一些企业运营所需的常用功能，探索使用 PPConsole 让它为你的企业业务服务。通过使用 PPConsole 上的企业应用，PPMessage 完全成为了一个自主、自建的企业微信，或者是阿里钉钉，但是数据和程序以及安全性却能得到充分的保障。 

# 快速上手

## 下载代码

```bash
git clone https://github.com/PPMESSAGE/ppmessage
cd ppmessage
```

## 安装依赖

> Debian/Ubuntu

```bash
bash ppmessage/scripts/set-up-ppmessage-on-linux.sh
```

> macOS


```bash
bash ppmessage/scripts/set-up-mac-on-linux.sh
```


## 执行


```bash
./ppmessage.py
```

> 就是这些，不工作？请将日志贴到 Github issue 中，谢谢！

 
> 完全参考手册，请关注 PPMessage 在 GitBook 上的持续更新

* [中文手册](https://ppmessage.gitbooks.io/ppbook/content/)


> 应网友之强烈要求，要有个 QQ 群 348015072


![](/ppmessage/doc/348015072.png)

<!--

* [在线使用PPMessage](/ppmessage/doc/zh-cn/online-ppmessage-guide.md) 

* [从源码开始](/ppmessage/doc/zh-cn/install.md)

* [使用手册](/ppmessage/doc/zh-cn/user-manual.md)

* [开发手册](/ppmessage/doc/zh-cn/developer-manual.md)

-->


