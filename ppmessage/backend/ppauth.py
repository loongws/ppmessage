# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/ppauth.py 
# The entry form auth service
#

"""
All api request need a token which got from ppauth service

"""

from ppmessage.backend.ppauthapp import PPAuthApp

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PPAUTH_PORT

import tornado.web
import tornado.ioloop
import tornado.options
import tornado.httpserver

import os
import redis
import logging
import datetime

tornado.options.define("port", default=PPAUTH_PORT, help="", type=int)
        
def _main():
    tornado.options.parse_command_line()
    _app = PPAuthApp()
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)
    logging.info("Starting ppauth service......%d" % tornado.options.options.port)
    tornado.ioloop.IOLoop.instance().start()
    return

if __name__ == "__main__":
    _main()
