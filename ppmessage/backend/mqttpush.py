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
from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.singleton import singleton
from ppmessage.core.main import AbstractWebService

from ppmessage.mqttpush.pushhandler import PushHandler

import tornado.ioloop
import tornado.options

import sys
import json
import redis
import logging
import datetime


@singleton
class MqttPushDelegate():
    def __init__(self, app):
        self.redis = app.redis
        self.mqtt_client = None
        self.push_handler = PushHandler(self)
        return
        
    def outdate(self):
        _delta = datetime.timedelta(seconds=30)
        if self.mqtt_client == None:
            return
        self.mqtt_client.outdate(_delta)
        return

    def push(self):
        while True:
            _request = self.redis.lpop(REDIS_MQTTPUSH_KEY)
            if _request == None or len(_request) == 0:
                return
            _request = json.loads(_request)
            self.push_handler.task(_request)
        return

    def run_periodic(self):
        tornado.ioloop.PeriodicCallback(self.outdate, 1000*30).start()
        tornado.ioloop.PeriodicCallback(self.push, 1000).start()
        return

class MqttPushWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.MQTTPUSH

    @classmethod
    def get_handlers(cls):
        return []

    @classmethod
    def get_delegate(cls, app):
        return MqttPushDelegate(app)

class MqttPushApp():
    def __init__(self, *args, **kwargs):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        return

    def get_delegate(self, name):
        return MqttPushDelegate(self)
    
def _main():
    tornado.options.parse_command_line()
    _app = MqttPushApp()
    _app.get_delegate("").run_periodic()
    logging.info("Starting mqttpush service......")
    # set the periodic check outdated connection
    tornado.ioloop.IOLoop.instance().start()
    return
    
if __name__ == "__main__":
    _main()
