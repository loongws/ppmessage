# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/ppkefu.py
# 

from ppmessage.backend.ppkefuapp import PPKefuApp
from ppmessage.core.constant import PPKEFU_PORT

import tornado.ioloop
import tornado.options
import tornado.httpserver

import logging

tornado.options.define("port", default=PPKEFU_PORT, help="", type=int)

def _main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(PPKefuApp(), max_body_size=64*1024*1024)
    http_server.listen(tornado.options.options.port)

    logging.info("Starting PPKEFU...")
    tornado.ioloop.IOLoop.instance().start()
    return

if __name__ == "__main__":
    _main()
    
