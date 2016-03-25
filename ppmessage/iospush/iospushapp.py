# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import IOSPUSH_SRV
from ppmessage.core.constant import REDIS_IOSPUSH_KEY

from Queue import Queue
from tornado.web import Application
from tornado.web import RequestHandler

import copy
import json
import uuid
import redis
import logging
import datetime

from .pushthreadhandler import PushThreadHandler

class PushHandler(RequestHandler):
    """
    not use the web request for internal message, use redis list instead.
    """
    def post(self):
        #self.application.redis.rpush(self.application.push_key, self.request.body)
        return

class IOSPushApp(Application):
    
    def __init__(self):
        self.apns = {}
        self.request_count = 0
        self.push_key = REDIS_IOSPUSH_KEY
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        self.push_thread = PushThreadHandler(self)
        
        settings = {}
        settings["debug"] = True
        handlers = []
        handlers.append(("/"+IOSPUSH_SRV.PUSH, PushHandler))
        Application.__init__(self, handlers, **settings)
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

