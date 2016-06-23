# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Yuan Wanshang, wanshang.yuan@yvertical.com.
# Guijin Ding, dingguijin@gmail.com.
#
# All rights are reserved.
#

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.singleton import singleton
from ppmessage.core.main import AbstractWebService

from ppmessage.core.downloadhandler import DownloadHandler

import redis
from tornado.web import Application

@singleton
class DownloadDelegate():
    def __init__(self, app):
        return
    def run_periodic(self):
        return

class DownloadWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.DOWNLOAD

    @classmethod
    def get_handlers(cls):
        return [("/download/([^\/]+)?$", DownloadHandler, {"path": "/"})]

    @classmethod
    def get_delegate(cls, app):
        return DownloadDelegate(app)
    
class DownloadApplication(Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        handlers = []

        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        DownloadHandler.set_cls_redis(self.redis)        
        Application.__init__(self, DownloadWebService.get_handlers(), **settings)

        return

    def get_delegate(self, name):
        return DownloadDelegate(self)
    
