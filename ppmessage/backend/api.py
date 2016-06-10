# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#

from ppmessage.api.apiapp import ApiApp
from ppmessage.core.constant import API_PORT

import os
import sys
import logging
import subprocess

import tornado.ioloop
import tornado.options
import tornado.httpserver

tornado.options.define("port", default=API_PORT, help="", type=int)  

def load_ip2geo():
    _api_path = os.path.dirname(os.path.abspath(__file__)) + os.path.sep + ".." + os.path.sep + "api"
    _mmdb = "GeoLite2-City.mmdb"
    _mmdb = _api_path + os.path.sep + "geolite2" + os.path.sep + _mmdb
    
    if not os.path.exists(_mmdb):
        logging.error("no geolite2 mmdb, run scripts/download_geolite2.sh to download and restart api.")
        return None
    
    _reader = database.Reader(_mmdb)
    return _reader

def _main():
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')
    
    tornado.options.parse_command_line()
    
    _app = ApiApp()
    
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)

    logging.info("Starting API servcie.")
    tornado.ioloop.IOLoop.instance().start()
    
    return

if __name__ == "__main__":
    _main()
    

