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

    def post(self):
        self.application.request_count += 1
        self.redis.rpush(self.push_key, self.request.body)
        logging.info("get ios push request : %d" % self.application.request_count)
        return

class IOSPushApp(Application):
    
    def __init__(self):
        self.apns = {}
        self.request_count = 0
        self.push_key = REDIS_IOSPUSH_KEY + "." + str(uuid.uuid1())
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
            if self.apns[_i] == None: 
                continue
            if self.apns[_i].apns_session == None:
                continue
            self.apns[_i].apns_session.outdate(_delta)
        return

    def push(self):
        """
        every 1 second check push request
        """
        
        if self.request_count == 0:
            return

        push_request = self.redis.lpop(self.push_key)
        if push_request == None:
            return

        self.push_thread.task(push_request)
        return
    
#    def apns_feedback(self):
#        _apns = get_apns(self)
#        _apns.feedback()
#        return

