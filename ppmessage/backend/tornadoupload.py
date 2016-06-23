# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/tornadoupload.py 
#
# The entry of tornado upload service
#

from ppmessage.core.constant import TORNADO_FILEUPLOAD_PORT
from ppmessage.backend.tornadouploadapplication import TornadoUploadApplication

import tornado.ioloop
import tornado.options
import tornado.httpserver

import logging

tornado.options.define("port", default=TORNADO_FILEUPLOAD_PORT, help="", type=int)  

if __name__ == "__main__":

    tornado.options.parse_command_line()

    _app = TornadoUploadApplication()
    _http_server = tornado.httpserver.HTTPServer(_app)
    logging.info("Starting Tornado Upload servcie with port: %d." % tornado.options.options.port)
    _http_server.listen(tornado.options.options.port)
    loop = tornado.ioloop.IOLoop.instance()
    loop.start()


