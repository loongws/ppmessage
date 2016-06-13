# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/ppconsole.py
#

from ppmessage.core.constant import PPCONSOLE_PORT
from ppmessage.backend.ppconsoleapp import PPConsoleApp

import os
import logging

import tornado.ioloop
import tornado.options
import tornado.httpserver

tornado.options.define("port", default=PPCONSOLE_PORT, help="", type=int)

def _main():
    import sys
    reload(sys)
    sys.setdefaultencoding('utf-8')
    tornado.options.parse_command_line()

    _app = PPConsoleApp()
    http_server = tornado.httpserver.HTTPServer(_app)

    logging.info("Starting ppconsole of user... with port: %d" % tornado.options.options.port)

    http_server.listen(tornado.options.options.port)
    tornado.ioloop.IOLoop.instance().start()
    return

if __name__ == "__main__":
    _main()
