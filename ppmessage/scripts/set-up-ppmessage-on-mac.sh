#! /bin/bash

# version: 0.2
# maintainer: Jin He <jin.he@ppmessage.com>
# description: a shell script to deploy PPMessage on Mac
#
# version: 0.3
# remove nginx/mysql/ffmpeg/scikit
#
# version: 0.4
# remove apns-client
#

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

brew install \
     autoconf \
     automake \
     fdk-aac \
     libtool \
     libmagic \
     libjpeg \
     libffi \
     lame \
     nodejs \
     redis

brew tap homebrew/services

# In Mac OS X EI Captain, if your encount below error when install green,

# OSError: [Errno 1] Operation not permitted: '/var/folders/nj/ky4gzkdn0db_wdxxyph3j93h0000gn/T/pip-xoS3tF-uninstall/System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python/six-1.4.1-py2.7.egg-info'

# try this command to install green:

# sudo pip install green --ignore-installed six

# Installing other package might have similar problem. In that case, use '--ignore-installed xxx' should do the trick.

# "pip install -i http://pypi.douban.com/simple xxx" might be faster
sudo pip install \
     apns2 \
     pillow \
     StringGenerator \
     beautifulsoup4 \
     filemagic \
     identicon \
     jieba \
     paramiko \
     paho-mqtt \
     ppmessage-mqtt \
     pypinyin \
     pyparsing \
     python-dateutil \
     python-gcm \
     python-magic \
     qrcode \
     readline \
     redis \
     sqlalchemy \
     tornado \
     xlrd


echo "Finish install the PPMessage requirements successfully, have fun with PPMessage"
