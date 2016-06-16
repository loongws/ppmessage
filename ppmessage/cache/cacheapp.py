# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights are reserved.
#
# cahce/cacheapp.py
#

from .createhandler import CreateHandler
from .updatehandler import UpdateHandler
from .deletehandler import DeleteHandler

from ppmessage.core.constant import CACHE_TYPE
from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PP_WEB_SERVICE
from ppmessage.core.constant import REDIS_CACHE_KEY

from ppmessage.core.utils.config import get_config_db

from ppmessage.core.singleton import singleton
from ppmessage.core.main import AbstractWebService

import os
import json
import redis
import base64
import urllib
import logging

import tornado.web

@singleton
class CacheDelegate():
    def __init__(self, app):
        self.redis = app.redis
        return

    def _handler(self, _type, _data):
        _handlers = {
            CACHE_TYPE.CREATE: CreateHandler(),
            CACHE_TYPE.UPDATE: UpdateHandler(),
            CACHE_TYPE.DELETE: DeleteHandler()
        }
        if _type not in _handlers:
            logging.error("not support type: %s with data: %s" % (_type, _data))
            return
        _handlers[_type].task(_data)
        return

    def run_periodic(self):
        if get_config_db() == None:
            logging.error("Cache not run for PPMessage not configed.")
            return
        
        tornado.ioloop.PeriodicCallback(self.task_loop, 1000).start()
        return

    def task_loop(self):
        _key = REDIS_CACHE_KEY
        while True:
            _request = self.redis.lpop(_key)
            if _request == None:
                break
            _request = json.loads(_request)
            _type = _request.get("type")
            _data = _request.get("data")
            self._handler(_type, _data)
        return
            
class CacheWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.CACHE

    @classmethod
    def get_handlers(cls):        
        return []

    @classmethod
    def get_delegate(cls, app):
        return CacheDelegate(app)
    
class CacheApp(tornado.web.Application):
    
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        settings = {}
        settings["debug"] = True
        tornado.web.Application.__init__(self, [], **settings)

    def get_delegate(self, name):
        return CacheDelegate(self)
    

