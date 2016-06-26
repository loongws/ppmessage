# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.singleton import singleton
from ppmessage.core.main import AbstractWebService

from handlers.getwebservicehandlers import getWebServiceHandlers

import os
import sys
import redis
import logging

from geoip2 import database
from tornado.web import Application

@singleton
class ApiDelegate():

    def __init__(self, app):
        return

    def run_periodic(self):
        return

class ApiWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.API

    @classmethod
    def get_handlers(cls):
        return getWebServiceHandlers()

    @classmethod
    def get_delegate(cls, app):
        return ApiDelegate(app)

@singleton
class ApiApp(Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)            
        Application.__init__(self, ApiWebService.get_handlers(), **settings)
        return
        
    def get_delegate(self, name):
        return ApiDelegate(self)
    
