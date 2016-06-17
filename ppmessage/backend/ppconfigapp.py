# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/ppconfigapp.py
#

from ppmessage.core.constant import PP_WEB_SERVICE
from ppmessage.core.main import AbstractWebService
from ppmessage.core.singleton import singleton
from ppmessage.core.utils.config import _get_config

import os
import logging

import tornado.web

class PPConfigHandler(tornado.web.RequestHandler):
    def get(self, id=None):
        _dir = os.path.dirname(os.path.abspath(__file__))
        _html_path = _dir + "/../resource/html/ppconfig-index.html" 
        _html_file = open(_html_path, "rb")
        _html = _html_file.read()
        _html_file.close()
        self.write(_html)
        self.finish()

class ConfigStatusHandler(tornado.web.RequestHandler):
    def post(self, id=None):
        _status = {"status": "NONE"}
        if _get_config() == None:
            pass  
        elif _get_config().get("db") and _get_config().get("team") and _get_config().get("apns") and _get_config.get("gcm"):
            _status["status"] = "ANDROID"
        elif _get_config().get("db") and _get_config().get("team") and _get_config().get("apns"):
            _status["status"] = "IOS"
        elif _get_config().get("db") and _get_config().get("team"):
            _status["status"] = "FIRST"
        elif _get_config().get("db"):
            _status["status"] = "DATABASE"
        else:
            _status["status"] = "NONE"
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps(_status))
        return

class DatabaseHandler(tornado.web.RequestHandler):
    def post(self, id=None):
        return

class FirstHandler(tornado.web.RequestHandler):
    def post(self, id=None):
        return

class IOSHandler(tornado.web.RequestHandler):
    def post(self, id=None):
        return

class GCMHandler(tornado.web.RequestHandler):
    def post(self, id=None):
        return

@singleton
class PPConfigDelegate():
    def __init__(self, app):
        return
    def run_periodic(self):
        return
        
class PPConfigWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.PPCONFIG

    @classmethod
    def get_handlers(cls):
        _a_settings = {
            "path": os.path.join(os.path.dirname(__file__), "../resource/assets/ppconfig/static"),
        }
        
        handlers=[
            (r"/", PPConfigHandler),
            (r"/status", ConfigStatusHandler),
            (r"/database", DatabaseHandler),
            (r"/first", FirstHandler),
            (r"/ios", IOSHandler),
            (r"/android", AndroidHandler),
            (r"/static/(.*)", tornado.web.StaticFileHandler, _a_settings),
        ]

        return handlers

    @classmethod
    def get_delegate(cls, app):
        return PPConfigDelegate(app)

class PPConfigApp(tornado.web.Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        settings["cookie_secret"] = "24oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="
        tornado.web.Application.__init__(self, PPConfigWebService.get_handlers(), **settings)

    def get_delegate(self, name):
        return PPConfigDelegate(self)

    
