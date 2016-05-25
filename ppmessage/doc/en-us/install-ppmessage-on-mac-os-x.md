# Install PPMessage on Mac OS X

### Download PPMessage source code from Github


```bash
$ git clone https://github.com/PPMESSAGE/ppmessage.git
$ cd ppmessage

```

> In the following document, assuming you are under the `ppmessage` directory.

### Download and install the requirements

$ sh ppmessage/scripts/set-up-ppmessage-on-mac.sh

> Make sure everything is ok.

### Config mysql and redis and start them

* Mysql user and password (replace DB_PASSWORD with what you want to set as mysql password)

```Bash
    brew services list
    brew services start mysql
    mysqladmin -uroot password DB_PASSWORD
```

* Redis

  * Start redis
```Bash
    brew services list
    brew services start redis
```

### Config and prepare PPMessage

```bash
    sudo bash dish.sh dev
```

> Register the `ppmessage` python module into system.


```bash
    vim ppmessage/bootstrap/config.py
```

> Edit the config file of PPMessage, config detail is in PPMessage document.

```bash
    sh dist.sh bootstrap
```

> Bootstrap the PPMessage system with the config.py


### Generate PPCom/PPKefu/PPConsole - web version

```bash
    bash dist.sh npm
```

> Install node.js components via npm.


```bash
    bash dist.sh bower
```

> Install Web javascript libraries via bower.


```bash
    bash dist.sh gulp
```

> Use gulp task to generate final PPCom/PPKefu/PPConsole javascript file.


### Start/Stop PPMessage server

```bash
    sh dist.sh start
    sh dist.sh stop
```

### See log

```bash
    sh dist.sh log
```

### Check PPCOM

Use your browser open your url which combined server_name and nginx_listen_port configed in config.py.

> PPCONSOLE, WEB admin of PPMessage.

```bash
http://server_name:nginx_listen_port
```

> PPKEFU, service user use PPKEFU to service the customer which use PPCOM chat with service user.

```bash
http://server_name:nginx_listen_port/ppkefu
```
