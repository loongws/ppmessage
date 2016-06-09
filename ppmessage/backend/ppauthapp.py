#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/ppauthapp.py
#

from ppmessage.ppauth.authhandler import AuthHandler
from ppmessage.ppauth.tokenhandler import TokenHandler

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PP_WEB_SERVICE
from ppmessage.core.main import AbstractWebService

import os
import redis
import tornado.web

class PPAuthWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.PPAUTH

    @classmethod
    def get_handlers(cls):
        _a_settings = {
            "path": os.path.join(os.path.dirname(__file__), "../resource/assets/ppcom/static"),
        }
        
        handlers = [
            ("/auth/?.*", AuthHandler),
            ("/token/?.*", TokenHandler),
            ("/static/(.*)", tornado.web.StaticFileHandler, _a_settings)
        ]

        return handlers

class PPAuthApp(tornado.web.Application):
    
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)

        settings = {
            "debug": True,
        }
        
        tornado.web.Application.__init__(self, PPAuthWebService.get_handlers(), **settings)
    

