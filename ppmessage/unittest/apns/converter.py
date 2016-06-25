from ppmessage.core.p12converter import der2pem

import logging

def _main():
    logging.basicConfig(level=logging.DEBUG)
    _file = "/Users/dingguijin/Desktop/ppkefu-123.p12"
    with open(_file, "r") as _f:
        _s = der2pem(_f.read(), "x")
        if _s == None:
            print "error"
        else:
            print "success"
        print _s
    return

if __name__ == "__main__":
    _main()
