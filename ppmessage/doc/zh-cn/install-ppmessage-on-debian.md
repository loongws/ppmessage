# 在 Debian Linux 上安装 PPMessage

> 假设你已经安装了Debian Linux 8.4的操作系统，并且已经通过Github clone了PPMessage的源代码。需要注意的是在安装基本的 Debian 系统后，往往需要更改 /etc/apt/sources.list 才能下载 Debian 的软件包。在中国大陆推荐使用 163 镜像。

```python
deb http://mirrors.163.com/debian jessie-updates main non-free contrib
deb http://mirrors.163.com/debian jessie main non-free contrib

```


```bash
# apt-get install git
# git clone https://github.com/PPMESSAGE/ppmessage.git
# cd ppmessage

```

> 以下文档中都假设你现在处于这个ppmessage目录之下，确认在这个目录中，你能看到dist.sh这样的文件。所有的操作都以root身份运行。对于类似AWS的虚拟机没有提供root，只能通过sudo来提升到root权限，如果在部署上出现问题可以联系我们，针对PPMessage我们提供付费的部署和开发培训服务。

```bash
# ls
LICENSE    README.md  dist.sh*   ppmessage/

```

> 执行 deploy-ppmesage-on-linux.sh 这个脚本能够帮助你在 Linux 上安装 PPMessage 所依赖的 Debian 包和 Python 的开发包以及一些必须通过下载源码进行手动编译的过程。这个过程可能需要10分钟甚至更多时间，如果中间出现错误提示，可能意味着某个 PPMessage 所依赖的软件包没有正确安装。

```bash
# bash ppmessage/depoly/deploy-ppmesage-on-linux.sh

```

> 执行 requir.py 这个脚本用来检查 PPMessage 所需要的环境是否 OK？

```bash
# python ppmessage/scripts/require.py

```

> 执行 dist.sh，这个脚本能够帮助你创建数据库和NGINX的配置文件，安装 PPMessage 所需要的 node 的工具和开发包，以及打包、发布、启动、停止 PPMessage 的应用。

```bash
# bash dist.sh bootstrap
# bash dist.sh bower
# bash dist.sh npm
# bash dist.sh gulp
# bash dist.sh start

```




