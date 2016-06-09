# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/ppconsoleapp.py
#

from ppmessage.core.constant import PP_WEB_SERVICE
from ppmessage.core.main import AbstractWebService

import os
import logging

import tornado.web

class PPConsoleHandler(tornado.web.RequestHandler):
    # ppcom library load from where
    def get(self, id=None):
        _dir = os.path.dirname(os.path.abspath(__file__))
        _html_path = _dir + "/../resource/html/ppconsole-index.html"        
        _html_file = open(_html_path, "rb")
        _html = _html_file.read()
        _html_file.close()
        self.write(_html)
        self.finish()

class PPConsoleWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.PPCONSOLE

    @classmethod
    def get_handlers(cls):
        _a_settings = {
            "path": os.path.join(os.path.dirname(__file__), "../resource/assets/ppconsole/static"),
        }
        
        handlers=[
            (r"/", PPConsoleHandler),
            (r"/static/(.*)", tornado.web.StaticFileHandler, _a_settings),
        ]

        return handlers

class PPConsoleApp(tornado.web.Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        settings["cookie_secret"] = "24oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="
        tornado.web.Application.__init__(self, PPConsoleWebService.get_handlers(), **settings)

