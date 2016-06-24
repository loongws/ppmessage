# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import IOSPUSH_SRV
from ppmessage.core.constant import PP_WEB_SERVICE
from ppmessage.core.constant import REDIS_IOSPUSH_KEY

from ppmessage.core.singleton import singleton
from ppmessage.core.main import AbstractWebService

from Queue import Queue
from tornado.web import Application
from tornado.web import RequestHandler
from tornado.ioloop import PeriodicCallback

import copy
import json
import uuid
import redis
import logging
import datetime

from .pushthreadhandler import PushThreadHandler

@singleton
class IOSPushDelegate():
    def __init__(self, app):
        self.redis = app.redis
        self.apns_collection = {}
        self.push_key = REDIS_IOSPUSH_KEY
        self.push_thread = PushThreadHandler(self)    
        return
    
    def outdate(self):
        """
        every 5 five minutes check what connection
        is unused in 5 five minutes
        """
        
        _delta = datetime.timedelta(minutes=5)
        for _i in self.apns_collection:
            _apns = self.apns_collection.get(_i)
            if _apns == None:
                continue
            for _j in _apns:
                _apn = _apns.get(_j)
                if _apn == None:
                    continue
                if _apn.apns_session == None:
                    continue
                _apn.apns_session.outdate(_delta)
        return

    def _create_apns(self, _app_uuid):
        from ppmessage.db.models import AppInfo
        _key = AppInfo.__tablename__ + ".uuid." + _app_uuid

        if self.redis.hget(_key, "enable_apns_push") == "False":
            return None

        from ppmessage.db.models import APNSSetting
        _key = APNSSetting.__tablename__ + ".app_uuid." + _app_uuid
        _uuid = self.redis.get(_key)
        if _uuid == None:
            return None

        _key = APNSSetting.__tablename__ + ".uuid." + _uuid
        _combination_pem = self.redis.hget(_key, "combination_pem")
        if _combination_pem == None:
            return None

        _file = os.path.abspath(os.path.join(os.path.dirname(__file__), "../certs/%s-combination.pem" % _app_uuid))
        with open(_file, "w") as _wf:
            _wf.write(_wf, _combination_pem)
            
        _apns = {"combination_pem": _file}
        return _apns
    
    def push(self):
        """
        every 200ms check push request
        """
        while True:
            _request = self.redis.lpop(self.push_key)
            if _request == None:
                return

            _request = json.loads(_request)
            if _request == None:
                continue

            _app_uuid = _request.get("app_uuid")
            _apns = self.apns_collection.get(_app_uuid)
            if _apns == None:
                _apns = self._create_apns(_app_uuid)
                if _apns == None:
                    continue
                else:
                    self.apns_collection[_app_uuid] = _apns
            
            self.push_thread.task(_apns, _request)
        return

    def run_periodic(self):
        
        # set the periodic check outdated connection
        PeriodicCallback(self.outdate, 1000*60*5).start()
        # set the periodic check push request every 200 ms
        PeriodicCallback(self.push, 200).start()
        return

class IOSPushWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.IOSPUSH

    @classmethod
    def get_handlers(cls):
        return []

    @classmethod
    def get_delegate(cls, app):
        return IOSPushDelegate(app)

class IOSPushApp(Application):
    
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)    
        return

    def get_delegate(self, name):
        return IOSPushDelegate(self)
    
