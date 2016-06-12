#! /bin/bash

# version: 0.2
# maintainer: Jin He <jin.he@ppmessage.com>
# description: a shell script to deploy PPMessage on Mac
#
# version: 0.3
# remove nginx/mysql/ffmpeg/scikit
#

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

brew install \
     autoconf \
     automake \
     fdk-aac \
     hg \
     libtool \
     libmagic \
     libjpeg \
     libffi \
     lame \
     mercurial \
     nodejs \
     redis

brew tap homebrew/services

# install cnpm, bower and gulp
sudo npm install -g cnpm
sudo npm install -g bower
sudo npm install -g gulp

# some python modules need libmaxminddb, install it before run 'pip install ...'
cd /tmp
git clone --recursive https://github.com/maxmind/libmaxminddb
cd libmaxminddb
./bootstrap
./configure
make && sudo make install

# In Mac OS X EI Captain, if your encount below error when install green,

# OSError: [Errno 1] Operation not permitted: '/var/folders/nj/ky4gzkdn0db_wdxxyph3j93h0000gn/T/pip-xoS3tF-uninstall/System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python/six-1.4.1-py2.7.egg-info'

# try this command to install green:

# sudo pip install green --ignore-installed six

# Installing other package might have similar problem. In that case, use '--ignore-installed xxx' should do the trick.

# "pip install -i http://pypi.douban.com/simple xxx" might be faster
sudo pip install \
     StringGenerator \
     axmlparserpy \
     beautifulsoup4 \
     biplist \
     evernote \
     filemagic \
     geoip2 \
     green \
     hg+https://dingguijin@bitbucket.org/dingguijin/apns-client \
     identicon \
     ipython \
     jieba \
     paramiko \
     paho-mqtt \
     pillow \
     ppmessage-mqtt \
     pyipa \
     pypinyin \
     pyparsing \
     python-dateutil \
     python-gcm \
     python-magic \
     qiniu \
     qrcode \
     readline \
     redis \
     rq \
     supervisor \
     sqlalchemy \
     tornado \
     xlrd

echo "Finish install the PPMessage requirements successfully, have fun with PPMessage"
