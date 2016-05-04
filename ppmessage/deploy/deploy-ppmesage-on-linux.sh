#!/bin/bash

# version: 0.2
# maintainer: Jin He <jin.he@ppmessage.com>
# description: a shell script to deploy PPMessage on Debian and Ubuntu

NODE_VERSION="v6.0.0"
NGINX_VERSION="1.8.0"
FFMPEG_VERSION="3.0.2"
MYSQL_CONNECTOR_PYTHON_VERSION="2.1.3"

function ppmessage_err()
{
    echo "EEEE) $1"
    echo
    exit 1
}

function ppmessage_check_path()
{
    if [ ! -f ./dist.sh  ];
    then
        ppmessage_err "you should run under the first-level path of ppmessage!"
    fi
}

function ppmessage_need_root()
{
    if [ $UID -ne 0 ];
    then
        ppmessage_err "you should run in root, or use sudo!"
    fi
}

ppmessage_need_root

apt-get update

# for debian
apt-get install -y libjpeg62-turbo-dev

# for ubuntu
apt-get install -y libjpeg8-dev

apt-get install -y \
    apt-file \
    apt-utils \
    autoconf \
    automake \
    gcc \
    git \
    g++ \
    gfortran \
    libblas-dev \
    liblapack-dev \
    libatlas-base-dev \
    libffi-dev \
    libfdk-aac-dev \
    libfreetype6-dev \
    libmagic1 \
    libmp3lame-dev \
    libncurses5-dev \
    libopencore-amrwb-dev \
    libopencore-amrnb-dev \
    libopus-dev \
    libpng12-dev \
    libpcre3 \
    libpcre3-dev \
    libssl-dev \
    libtool \
    mercurial \
    mysql-server \
    openssl \
    pkg-config \
    python \
    python-dev \
    python-pip \
    redis-server \
    wget

# some python modules need libmaxminddb, install it before run 'pip install ...'
cd /tmp
git clone --recursive https://github.com/maxmind/libmaxminddb
cd libmaxminddb
./bootstrap
./configure
make && make install
cd -

cd /tmp
wget -c http://cdn.mysql.com//Downloads/Connector-Python/mysql-connector-python-$MYSQL_CONNECTOR_PYTHON_VERSION.tar.gz
tar -xzvf mysql-connector-python-$MYSQL_CONNECTOR_PYTHON_VERSION.tar.gz
cd mysql-connector-python-$MYSQL_CONNECTOR_PYTHON_VERSION
python setup.py install
cd -

cd /tmp
wget -c http://nginx.org/download/nginx-$NGINX_VERSION.tar.gz
git clone https://github.com/vkholodkov/nginx-upload-module.git
cd nginx-upload-module && git checkout 2.2 && cd ../
tar -xzvf nginx-$NGINX_VERSION.tar.gz
cd nginx-$NGINX_VERSION
./configure --with-http_ssl_module --add-module=../nginx-upload-module 
make && make install 
ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx
cd -

cd /tmp 
wget -c http://ffmpeg.org/releases/ffmpeg-$FFMPEG_VERSION.tar.bz2 
tar -xjvf ffmpeg-$FFMPEG_VERSION.tar.bz2 
cd ffmpeg-$FFMPEG_VERSION 
./configure --enable-libopencore-amrnb \
            --enable-libopencore-amrwb \
            --enable-version3 \
            --enable-nonfree \
            --disable-yasm \
            --enable-libmp3lame \
            --enable-libopus \
            --enable-libfdk-aac
make && make install 
cd -

# install nodejs
cd /tmp
wget -c https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION.tar.gz
tar -zxvf node-$NODE_VERSION.tar.gz
cd node-$NODE_VERSION
./configure
make && make install
cd -

# install gulp and bower
npm install -g bower
npm install -g gulp

# "pip install -i http://pypi.douban.com/simple xxx" might be faster
pip install \
    axmlparserpy \
    beautifulsoup4 \
    biplist \
    cffi \
    cryptography \
    evernote \
    filemagic \
    geoip2 \
    green \
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
    xlrd \
    numpy \
    matplotlib \
    scipy \
    scikit-learn

pip install git+https://github.com/senko/python-video-converter.git \
    hg+https://dingguijin@bitbucket.org/dingguijin/apns-client


echo "Finish install the requirements of PPMessage, next to run dist.sh with different arguments to start PPMessage."
