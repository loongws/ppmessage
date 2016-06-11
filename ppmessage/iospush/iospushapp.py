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
        self.apns = {}
        self.request_count = 0
        self.push_key = REDIS_IOSPUSH_KEY
        self.push_thread = PushThreadHandler(self)    
        return

    def outdate(self):
        """
        every 5 five minutes check what connection
        is unused in 5 five minutes
        """
        
        _delta = datetime.timedelta(minutes=5)
        for _i in self.apns:
            _apns = self.apns.get(_i)
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

    def push(self):
        """
        every 200ms check push request
        """
        while True:
            push_request = self.redis.lpop(self.push_key)
            if push_request == None:
                return
            self.push_thread.task(push_request)
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
    
