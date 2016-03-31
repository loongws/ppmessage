# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/mqttpush.py 
# The entry form mqttpush service
#

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import REDIS_MQTTPUSH_KEY
from ppmessage.mqttpush.pushhandler import PushHandler

import tornado.ioloop
import tornado.options

import sys
import redis
import logging
import datetime

class MqttPushApp():
    def __init__(self, *args, **kwargs):
        self._mqtt_client = None
        self.push_handler = PushHandler(self)
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        return

    def outdate(self):
        _delta = datetime.timedelta(seconds=30)
        if self._mqtt_client == None:
            return
        self._mqtt_client.outdate(_delta)
        return

    def push(self):
        while True:
            _request = self.redis.lpop(REDIS_MQTTPUSH_KEY)
            if _request == None or len(_request) == 0:
                return
            _request = json.loads(_request)
            self.push_handler.task(_request)
        return

if __name__ == "__main__":
    tornado.options.parse_command_line()
    _app = MqttPushApp()
    logging.info("Starting mqttpush service......")
    # set the periodic check outdated connection
    tornado.ioloop.PeriodicCallback(_app.outdate, 1000*30).start()
    tornado.ioloop.PeriodicCallback(_app.push, 1000).start()
    tornado.ioloop.IOLoop.instance().start()
    
