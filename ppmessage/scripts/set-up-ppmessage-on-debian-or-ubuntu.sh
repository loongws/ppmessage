#!/bin/bash

# version: 0.4
# maintainer: Jin He <jin.he@ppmessage.com>
# description: a shell script to deploy PPMessage on Debian and Ubuntu
#
# version: 0.3
# remove ffmpeg/nginx/mysql/scikit
#
# version 0.4
# remove apns-client
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

function download_geolite2() 
{
    #SCRIPT=$(readlink -f "$0")
    #BASEDIR=$(dirname "${SCRIPT}")
    BASEDIR=$(dirname "$BASH_SOURCE")
    APIDIR="${BASEDIR}"/../api/geolite2
    wget --directory-prefix="${APIDIR}" -c http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz
    GEOFILE=GeoLite2-City.mmdb.gz
    GEOPATH="${APIDIR}"/GeoLite2-City.mmdb.gz
    
    echo "${GEOPATH}"
    echo $(readlink -e "${GEOPATH}")
    AGEOPATH=$(readlink -e "${GEOPATH}")
    STEM=$(basename "${GEOFILE}" .gz)
    gunzip -c "${AGEOPATH}" > "${APIDIR}"/"${STEM}"
}
    
download_geolite2

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
    apns2 \
    StringGenerator \
    beautifulsoup4 \
    paramiko \
    cryptography \
    filemagic \
    geoip2 \
    identicon \
    paho-mqtt \
    pillow \
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

# to support mysql/postgresql needs more installation
# apt-get install mysql-server postgresql libpq-dev
# pip install psycopg2
echo "Finish install the requirements of PPMessage, next to run ppmessage.py to start PPMessage."
