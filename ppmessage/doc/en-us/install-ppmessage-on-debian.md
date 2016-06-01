# Install PPMessage on Debian Linux

> Assuming you have a Debian Linux 8.4 box, and the following commnads help you install `git` and clone PPMessage source code from [Github](https://github.com/PPMESSAGE/ppmessage).


```bash
# apt-get install git
# git clone https://github.com/PPMESSAGE/ppmessage.git
# cd ppmessage

```

> The following document will assume you are under `ppmessage` directory, and under this directory you can see:

```bash
# ls
LICENSE    README.md  dist.sh*   ppmessage/

```

> Run download_geolite2.sh, this will help you download database of geolite2，this database maintain the maping of IP address and geography location.


```bash
ppmessage/scripts/download_geolite2.sh
```

> Run set-up-ppmesage-on-linux.sh, this will help you install all requirements of PPMessage on Debian Linux. It will install some dpkgs and pips. It will needs ten minutes or more depends on your network performance.

```bash
# bash ppmessage/scripts/set-up-ppmesage-on-linux.sh

```

> dist.sh，this scripts has lots of parameter, which can execute many operation of PPMessage.

> Register python module of PPMessage.

```bash
# bash dist.sh dev
```

> Based on bootstrap/config.py to create database table and initialization data. Copy a template such as config.ppmessage.com.py to config.py and change anything you want. `dist.sh bootstrap` will regenerate the database tables so that it will flush all data of PPMessage and recreate it.

```bash
# bash dist.sh bootstrap
```

> Download node packages 

```bash
# bash dist.sh npm
```

> Download bower packages

```bash
# bash dist.sh bower
```

> Run gulp tasks

```bash
# bash dist.sh gulp
```

> Start PPMessage services

```bash
# bash dist.sh start
```
