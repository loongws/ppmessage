# Install PPMessage on Windows 7


> Clone PPMessage Source or download source [archive](https://github.com/PPMESSAGE/ppmessage/archive/master.zip)


```bash
# git clone https://github.com/PPMESSAGE/ppmessage.git
# cd ppmessage

```

> Install Python, PPMessage support Python 2 so far.

[Python 2.7.11](https://www.python.org/ftp/python/2.7.11/python-2.7.11.msi)


> Redis for windows


[Redis 64bit](https://github.com/MSOpenTech/redis/releases/download/win-3.0.503/Redis-x64-3.0.503.msi)

> Install Python packages (Run Windows cmd with administrator role)

```
pip install -r ppmessage/scripts/requirements.txt
```

> Run PPMessage

```bash
python ppmessage.py
```