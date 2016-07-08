# PPMessage
#
# VERSION           0.2

FROM debian:latest

MAINTAINER Jin He <jin.he@ppmessage.com>

ENV FFMPEG_VERSION=2.8.5 \
    NGINX_VERSION=1.8.0 \
    MYSQL_CONNECTOR_PYTHON_VERSION=2.1.3

# copy sources.list
# use 163 debian repository, you can use other repository by edit sources.list
COPY ["sources.list", "/etc/apt/sources.list"]

# apt-get install
# set noninteractive to prevent mysql from promting setting root-password,
# which freeze the install process.
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
apt-file \
apt-utils \
autoconf \
automake \
gcc \
git \
g++ \
libblas-dev \
liblapack-dev \
libatlas-base-dev \
gfortran \
libffi-dev \
libfdk-aac-dev \
libfreetype6-dev \
libjpeg62-turbo-dev \
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
wget \
&& apt-get clean

# pip install
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple \
axmlparserpy \
beautifulsoup4 \
biplist \
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

# wget install
# mysql-connector-python, nginx, ffmpeg, libmaxmindb
WORKDIR /tmp

RUN wget http://cdn.mysql.com//Downloads/Connector-Python/mysql-connector-python-$MYSQL_CONNECTOR_PYTHON_VERSION.tar.gz \
&& tar -xzvf mysql-connector-python-$MYSQL_CONNECTOR_PYTHON_VERSION.tar.gz \
&& cd mysql-connector-python-$MYSQL_CONNECTOR_PYTHON_VERSION \
&& python setup.py install \

&& cd /tmp \
&& wget http://nginx.org/download/nginx-$NGINX_VERSION.tar.gz \
&& git clone https://github.com/vkholodkov/nginx-upload-module.git \
&& cd nginx-upload-module && git checkout 2.2 && cd ../ \
&& tar -xzvf nginx-$NGINX_VERSION.tar.gz \
&& cd nginx-$NGINX_VERSION \
&& ./configure --with-http_ssl_module \
--add-module=../nginx-upload-module \
&& make && make install \
&& ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx \

&& cd /tmp \
&& wget http://ffmpeg.org/releases/ffmpeg-$FFMPEG_VERSION.tar.bz2 \
&& tar -xjvf ffmpeg-$FFMPEG_VERSION.tar.bz2 \
&& cd ffmpeg-$FFMPEG_VERSION \
&& ./configure --enable-libopencore-amrnb \
--enable-libopencore-amrwb \
--enable-version3 \
--enable-nonfree \
--disable-yasm \
--enable-libmp3lame \
--enable-libopus \
--enable-libfdk-aac \
&& make && make install \

&& cd /tmp \
&& git clone --recursive https://github.com/maxmind/libmaxminddb \
&& cd libmaxminddb \
&& ./bootstrap \
&& ./configure \
&& make && make install \

&& rm -fr /tmp/*

# to use docker cache, don't edit above lines.
# If you want to intall new packages, put it here.
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple \
stringgenerator

# others
EXPOSE 8080 80

VOLUME ["/ppmessage"]

COPY ["docker-entrypoint.sh", "/.entrypoint.sh"]

ENTRYPOINT ["/.entrypoint.sh"]
