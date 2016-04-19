# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/send.py 
# The entry form send service
#
from ppmessage.send.sendhandler import SendHandler
from ppmessage.core.constant import REDIS_SEND_NOTIFICATION_KEY

import logging
import tornado.web
import tornado.ioloop
import tornado.options

class SendApp(tornado.web.Application):
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        self.send_handler = SendHandler(self)
        return
    
    def send_loop(self):
        """
        every 50ms check send notification
        """
        key = REDIS_SEND_NOTIFICATION_KEY
        while True:
            noti = self.redis.lpop(key)
            if noti == None:
                # no message
                return
            body = json.loads(noti)
            self.send_handler.task(body)
        return

if __name__ == "__main__":
    tornado.options.parse_command_line()
    _app = SendApp()

    # set the periodic check send every 50 ms
    tornado.ioloop.PeriodicCallback(_app.send_loop, 50).start()

    logging.info("Starting send service......%d" % SEND_PORT)
    tornado.ioloop.IOLoop.instance().start()
    
