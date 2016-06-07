# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#

from ppmessage.core.singleton import singleton
from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.main import AbstractWebService

from handlers.getwebservicehandlers import getWebServiceHandlers

import os
import redis
from tornado.web import Application


class ApiWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.API

    @classmethod
    def get_handlers(cls):
        return getWebServiceHandlers()

@singleton
class ApiApp(Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        Application.__init__(self, ApiWebService.get_handlers(), **settings)
        
