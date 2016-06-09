# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/apiauth.py 
# The entry form auth service

"""
All api request need a token which got from ppauth service

"""

from ppmessage.ppauth.authhandler import AuthHandler
from ppmessage.ppauth.tokenhandler import TokenHandler

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PPAUTH_PORT
from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.main import AbstractWebService

import tornado.web
import tornado.ioloop
import tornado.options
import tornado.httpserver

import os
import redis
import logging
import datetime

tornado.options.define("port", default=PPAUTH_PORT, help="", type=int)

class PPAuthWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.PPAUTH

    @classmethod
    def get_handlers(cls):
        return [("/auth/?.*", AuthHandler), ("/token/?.*", TokenHandler)]

class PPAuthApp(tornado.web.Application):
    
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        settings = {
            "debug": True,
            "static_path": os.path.abspath(os.path.dirname(__file__)) + "/../ppauth/static"
        }
        Application.__init__(self, PPAuthWebService.get_handlers(), **settings)
        
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
