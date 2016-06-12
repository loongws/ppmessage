#!/bin/bash

# version: 0.3
# maintainer: Jin He <jin.he@ppmessage.com>
# description: a shell script to deploy PPMessage on Debian and Ubuntu
#
# version: 0.3
# remove ffmpeg/nginx/mysql/scikit
#


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
    sudo \
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
    openssl \
    pkg-config \
    python \
    python-dev \
    python-pip \
    redis-server \
    wget

# nodejs 4.x
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
apt-get install -y nodejs

# install gulp, cnpm and bower
npm install -g cnpm
npm install -g bower
npm install -g gulp

# some python modules need libmaxminddb, install it before run 'pip install ...'
cd /tmp
git clone --recursive https://github.com/maxmind/libmaxminddb
cd libmaxminddb
./bootstrap
./configure
make && make install
cd -

# "pip install -i http://pypi.douban.com/simple xxx" might be faster
pip install \
    StringGenerator \
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
    supervisor \
    sqlalchemy \
    tornado \
    xlrd

pip install hg+https://dingguijin@bitbucket.org/dingguijin/apns-client


echo "Finish install the requirements of PPMessage, next to run dist.sh with different arguments to start PPMessage."
