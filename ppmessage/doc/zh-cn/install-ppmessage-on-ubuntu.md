# 在 Debian Linux 上安装 PPMessage

> 假设你已经安装了Ubuntu Server 16.04 的操作系统，并且已经通过 Github clone 了 PPMessage 的源代码。安装 Ubuntu 的时候选择基本系统安装即可，同时可能需要 OpenSSH 组件，这样可以通过 ssh 管理这个 Ubuntu。


```bash
$ git clone https://github.com/PPMESSAGE/ppmessage.git
$ cd ppmessage

```

> 以下文档中都假设你现在处于这个ppmessage目录之下，确认在这个目录中，你能看到dist.sh这样的文件。对于不同云服务商的 Ubuntu 可能表现不同，如果在部署上出现问题可以联系我们，针对 PPMessage 我们提供付费的部署和开发培训服务。

```bash
# ls
LICENSE    README.md  dist.sh*   ppmessage/

```

> 执行 deploy-ppmesage-on-linux.sh 这个脚本能够帮助你在 Linux 完成依赖的软件包安装以及一些必须通过下载源码进行手动编译的过程。这个过程可能需要10分钟甚至更多时间，如果中间出现错误提示，可能意味着某个 PPMessage 所依赖的软件包没有正确安装。你可以将这个错误截屏，或者将这个错误输出的文字复制下来，在 Github 上详细描述你所遇到的问题，我们会尽快回复。

```bash
# bash ppmessage/depoly/deploy-ppmesage-on-linux.sh

```

> 执行 dist.sh，这个脚本能够帮助你创建数据库和NGINX的配置文件，安装 PPMessage 所需要的 node 的工具和开发包，以及打包、发布、启动、停止 PPMessage 的应用。

```bash
# bash dist.sh bootstrap
# bash dist.sh bower
# bash dist.sh npm
# bash dist.sh gulp
# bash dist.sh start

```




