# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/dispatcher.py 
# The entry form Dispatcher service
#
#

from ppmessage.core.constant import REDIS_DISPATCHER_NOTIFICATION_KEY
from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from ppmessage.dispatcher.task import TaskHandler

import tornado.web
import tornado.ioloop
import tornado.options

import json
import redis
import logging
import datetime

class DisApp(tornado.web.Application):
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        self.task_handler = TaskHandler(self)
        return
    
    def task_loop(self):
        """
        every 20ms check task notification
        """
        key = REDIS_DISPATCHER_NOTIFICATION_KEY
        while True:
            noti = self.redis.lpop(key)
            if noti == None:
                # no message
                return
            body = json.loads(noti)
            self.task_handler.task(body)
        return

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')
    tornado.options.parse_command_line()
    _app = DisApp()
    # every 20ms check dispatcher task
    tornado.ioloop.PeriodicCallback(_app.task_loop, 20).start()
    logging.info("Starting dis service......")
    tornado.ioloop.IOLoop.instance().start()
    
