# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights are reserved.
#
# backend/ppcomapp.py
#

from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.main import AbstractWebService
from ppmessage.core.singleton import singleton

import os
import json
import base64
import urllib
import logging

import tornado.web

class EnterpriseHandler(tornado.web.RequestHandler):
    def get(self, enterprise_string):
        _enterprise = base64.b64decode(enterprise_string)
        _enterprise = json.loads(_enterprise)
        _enterprise["app_uuid"] = _enterprise["uuid"]
        _enterprise["app_name"] = urllib.unquote(str(_enterprise["app_name"]))
        self.render("enterprise.html", **_enterprise)
        return

@singleton
class PPComDelegate():
    def __init__(self, app):
        return
    def run_periodic(self):
        return
    
class PPComWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.PPCOM

    @classmethod
    def get_handlers(cls):
        _a_settings = {
            "path": os.path.join(os.path.dirname(__file__), "../resource/assets/ppcom/assets"),
        }
        
        handlers=[
            (r"/enterprise/(.*)", EnterpriseHandler),
            (r"/assets/(.*)", tornado.web.StaticFileHandler, _a_settings),
        ]
        
        return handlers

    @classmethod
    def get_delegate(cls, app):
        return PPComDelegate(app)
    
class PPComApp(tornado.web.Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        settings["cookie_secret"] = "24oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="
        settings["template_path"]= os.path.join(os.path.dirname(__file__), "../resource/template")
        tornado.web.Application.__init__(self, PPComWebService.get_handlers(), **settings)

    def get_delegate(self, name):
        return PPComDelegate(self)
    
