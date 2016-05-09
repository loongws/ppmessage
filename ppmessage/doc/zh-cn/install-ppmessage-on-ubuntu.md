# 在 Ubuntu Linux 上安装 PPMessage

> 假设你已经安装了Ubuntu Server 16.04 的操作系统，并且已经通过 Github clone 了 PPMessage 的源代码。安装 Ubuntu 的时候选择基本系统安装即可，同时可能需要 OpenSSH 组件，这样可以通过 ssh 管理这个 Ubuntu。一般来说 安装了 Ubuntu Server 会创建一个普通用户，可以通过 sudo 来临时提升权限进行需要 root权限的操作。 


```bash
$ git clone https://github.com/PPMESSAGE/ppmessage.git
$ cd ppmessage

```

> 以下文档中都假设你现在处于这个ppmessage目录之下，确认在这个目录中，你能看到dist.sh这样的文件。对于不同云服务商的 Ubuntu 可能表现不同，如果在部署上出现问题可以联系我们，针对 PPMessage 我们提供付费的部署和开发培训服务。


```bash
$ ls
LICENSE    README.md  dist.sh*   ppmessage/

```


> 执行 deploy-ppmesage-on-linux.sh 这个脚本能够帮助你在 Linux 上安装 PPMessage 所依赖的 Debian/Ubuntu 包和 Python 的开发包以及一些必须通过下载源码进行手动编译的过程。这个过程可能需要10分钟甚至更多时间，如果中间出现错误提示，可能意味着某个 PPMessage 所依赖的软件包没有正确安装。

```bash
$ sudo bash ppmessage/scripts/set-up-ppmessage-on-linux.sh

```

> 执行 dist.sh，这个脚本根据参数不同能够执行很多 PPMessage 相关的批处理操作。注册 PPMessage 模块到 Python 系统中，建数据库表，生成 nginx 配置文件，安装 PPMessage 所需要的 node 的工具和开发包，以及打包、发布、启动、停止 PPMessage 的应用。

> 注册 Python 模块

```bash
$ sudo bash dist.sh dev
```

> 根据 bootstrap/config.py 创建数据库和 nginx 配置文件，生成 bootstrap/data.py，这里稍微有一点点复杂，bootstrap/config.py 是不存在的，需要自己根据需要配置，经常使用的配置模版文件已经放在 bootstrap/ 目录下，如 config.localhost.py 这个模版文件是指本地测试使用的，config.ppmessage.com.py 是给 ppmessage.com 这个网站使用的。可以复制一个预先定义的模板修改成你需要的。这个步骤以及这个步骤之前的步骤，一旦成功执行成功，不需要再执行。从 Github 上更新代码后不要再执行 bootstrap。因为执行 bootstrap 会重建数据表。

> 执行 bootstrap 过程中，由于使用的是普通用户权限，可能会遇到权限不够的情况，特别是 /usr/local/opt 是用来放置用户上传的文件目录，/usr/local/var/log 是用来放置 PPMessage 运行的日志文件的。确保这两个目录的权限可以被当前用户写访问。 /usr/local/nginx/conf/nginx.conf 是 ngnix 的配置文件 PPMessage 会根据 config.py 生成新的 nginx.conf，也要确保这个文件可写

```bash
$ sudo mkdir -p /usr/local/opt; sudo chmod 777 /usr/local/opt
$ sudo mkdir -p /usr/local/var/log; sudo chmod 777 /usr/local/var/log
$ sudo chmod 777 /usr/local/nginx/conf/nginx.conf

```

```bash
$ bash dist.sh bootstrap
$ nginx -s reload
```

> 下载 node 包，这个过程值得注意的是，nodejs 很多软件包在中国大陆被墙了，我们测试过 taobao 的镜像可以解决问题。[taobao npm 镜像](https://npm.taobao.org/)。这个操作以及紧接着的几个操作是可以反复多次执行的。因为在 PPMessage 开发进程中可能依赖新的 node 软件包。

```bash
$ bash dist.sh npm
```

> 下载 bower 管理的 javascript 组件，这些 javascript 组件用于 PPMessage 的 前端界面。

```bash
$ bash dist.sh bower
```

> 执行 gulp 任务，gulp 任务用来打包 PPMessage 的前端应用

```bash
$ bash dist.sh gulp
```

> 启动 PPMessage 后台服务

```bash
$ bash dist.sh start
```
