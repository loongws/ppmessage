# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/iospush.py 
#

from ppmessage.iospush.iospushapp import IOSPushApp
from ppmessage.bootstrap.data import BOOTSTRAP_DATA
from ppmessage.core.constant import IOSPUSH_PORT

import tornado.httpserver
import tornado.ioloop
import tornado.options

import logging
import sys

tornado.options.define("port", default=IOSPUSH_PORT, help="", type=int)  

if __name__ == "__main__":

    tornado.options.parse_command_line()

    # FIXME: support more apns certifcate
    _apns = BOOTSTRAP_DATA.get("apns")

    if len(_apns) == 0:
        logging.info("apns not config, iospush can not start")
        sys.exit()
    
    _app = IOSPushApp()
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)

    # set the periodic check outdated connection
    tornado.ioloop.PeriodicCallback(_app.outdate, 1000*60*5).start()
    
    # set the periodic check push request every second
    tornado.ioloop.PeriodicCallback(_app.push, 1000).start()
    
    logging.info("IOSPush service starting...")
    tornado.ioloop.IOLoop.instance().start()

