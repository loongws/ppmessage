# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/send.py 
# The entry form send service
#

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.constant import CHECK_SEND_INTERVAL

from ppmessage.core.constant import REDIS_SEND_NOTIFICATION_KEY

from ppmessage.core.singleton import singleton
from ppmessage.core.main import AbstractWebService

from ppmessage.send.sendhandler import SendHandler

import json
import redis
import logging
import tornado.web
import tornado.ioloop
import tornado.options

@singleton
class SendDelegate():
    def __init__(self, app):
        self.redis = app.redis
        self.send_handler = SendHandler(self)
        return
    
    def send_loop(self):
        key = REDIS_SEND_NOTIFICATION_KEY
        while True:
            noti = self.redis.lpop(key)
            if noti == None:
                # no message
                return
            body = json.loads(noti)
            self.send_handler.task(body)
        return

    def run_periodic(self):
        tornado.ioloop.PeriodicCallback(self.send_loop, CHECK_SEND_INTERVAL).start()
        return
    
class SendWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.SEND

    @classmethod
    def get_handlers(cls):
        return []

    @classmethod
    def get_delegate(cls, app):
        return SendDelegate(app)
    
class SendApp(tornado.web.Application):
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        return
    
    def get_delegate(self, name):
        return SendDelegate(self)

def _main():
    tornado.options.parse_command_line()
    
    _app = SendApp()
    _app.get_delegate("").run_periodic()
    
    logging.info("Starting send service......")
    tornado.ioloop.IOLoop.instance().start()
        
if __name__ == "__main__":
    _main()
