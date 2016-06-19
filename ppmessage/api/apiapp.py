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

def load_ip2geo():
    _api_path = os.path.dirname(os.path.abspath(__file__))
    _mmdb = "GeoLite2-City.mmdb"
    _mmdb = _api_path + os.path.sep + "geolite2" + os.path.sep + _mmdb
    
    if not os.path.exists(_mmdb):
        logging.error("no geolite2 mmdb, run scripts/download_geolite2.sh to download and restart api.")
        return None
    
    _reader = database.Reader(_mmdb)
    return _reader

@singleton
class ApiApp(Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        self.geoip_reader = load_ip2geo()
        if self.geoip_reader == None:
            sys.exit()
            
        Application.__init__(self, ApiWebService.get_handlers(), **settings)
        return
        
    def get_delegate(self, name):
        return ApiDelegate(self)
    
