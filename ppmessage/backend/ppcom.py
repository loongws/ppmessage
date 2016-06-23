# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights are reserved.
#
# backend/ppcom.py
#

from ppmessage.core.constant import PPCOM_PORT
from ppmessage.backend.ppcomapp import PPComApp

import os
import json
import base64
import urllib
import logging

import tornado.ioloop
import tornado.options
import tornado.httpserver


tornado.options.define("port", default=PPCOM_PORT, help="", type=int)

def _main():
    import sys
    reload(sys)
    sys.setdefaultencoding('utf-8')
    tornado.options.parse_command_line()

    _app = PPComApp()
    http_server = tornado.httpserver.HTTPServer(_app)

    logging.info("Starting PPCOM..")

    http_server.listen(tornado.options.options.port)
    loop = tornado.ioloop.IOLoop.instance()
    loop.start()


if __name__ == "__main__":
    _main()
