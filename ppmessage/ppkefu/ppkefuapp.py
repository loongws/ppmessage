# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# ppkefu/ppkefuapp.py
# 
from .mainhandler import MainHandler, CordovaHandler
from .uploadhandler import UploadHandler

from ppmessage.core.downloadhandler import DownloadHandler
from ppmessage.core.materialfilehandler import MaterialFileHandler

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.main import AbstractWebService
from ppmessage.core.singleton import singleton

from ppmessage.bootstrap.data import BOOTSTRAP_DATA

from tornado.web import Application
from tornado.web import StaticFileHandler

import os
import redis

@singleton
class PPKefuDelegate():
    def __init__(self, app):
        return
    def run_periodic(self):
        return
    
class PPKefuWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.PPKEFU

    @classmethod
    def get_handlers(cls):

        _root = os.path.abspath(os.path.dirname(__file__)) + "/ppkefu/www"
        _generic_store = BOOTSTRAP_DATA.get("server")
        _generic_store = _generic_store.get("generic_store")
        
        handlers = [
            (r"^/$", MainHandler),
            (r"^/cordova.js$", CordovaHandler),
            (r"/js/(.*)", StaticFileHandler, {"path": _root + "/js"}),
            (r"/css/(.*)", StaticFileHandler, {"path": _root + "/css"}),
            (r"/fonts/(.*)", StaticFileHandler, {"path": _root + "/fonts"}),
            (r"/img/(.*)", StaticFileHandler, {"path": _root + "/img"}),
            
            (r"/download/(.*)", DownloadHandler, {"path": "/"}),
            (r"/icon/([^\/]+)?$", StaticFileHandler, {"path": _generic_store + os.path.sep}),
            (r"/material/([^\/]+)?$", MaterialFileHandler, {"path": _generic_store + os.path.sep}),
            (r"/upload/(.*)", UploadHandler),
        ]

        return handlers

    @classmethod
    def get_delegate(cls, app):
        return PPKefuDelegate(app)

class PPKefuApp(Application):
    
    def __init__(self):
       
        settings = {}
        settings["debug"] = True
        settings["cookie_secret"] = "PzEMu2OLSsKGTH2cnyizyK+ydP38CkX3rhbmGPqrfBs="
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        DownloadHandler.set_cls_redis(self.redis)
        Application.__init__(self, PPKefuWebService.get_handlers(), **settings)

