# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Yuan Wanshang, wanshang.yuan@yvertical.com
# Guijin Ding, dingguijin@gmail.com
#
# All rights reserved
#

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.main import AbstractWebService

from ppmessage.core.downloadhandler import DownloadHandler
from ppmessage.core.identiconhandler import IdenticonHandler

import redis
from tornado.web import Application

class DownloadWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.DOWNLOAD

    @classmethod
    def get_handlers(cls):
        return [("/download/([^\/]+)?$", DownloadHandler, {"path": "/"}),
                ("/identicon/([^\/]+)?$", IdenticonHandler, {"path": "/"})]

class DownloadApplication(Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        handlers = []

        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        DownloadHandler.set_cls_redis(self.redis)
        
        Application.__init__(self, DownloadWebService.get_handlers(), **settings)

        return
    
