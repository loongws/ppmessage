# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.core.singleton import singleton
from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PP_WEB_SERVICE
from ppmessage.core.main import AbstractWebService

from .uploadfilehandler import UploadFileHandler

import os
import redis
from tornado.web import Application

class UploadWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.UPLOAD

    @classmethod
    def get_handlers(cls):
        return [(r"/upload", UploadFileHandler)]

@singleton
class UploadApplication(Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        handlers = []
        handlers.extend(UploadWebService.get_handlers())
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        Application.__init__(self, handlers, **settings)
    
