# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/main.py 
# The entry of PPMessage


from ppmessage.core.constant import MAIN_PORT
from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from ppmessage.core.main import get_total_handlers
from ppmessage.core.main import get_total_delegates
from ppmessage.core.downloadhandler import DownloadHandler

from ppmessage.api.apiapp import load_ip2geo

from ppmessage.api.apiapp import ApiWebService
from ppmessage.backend.amd import AmdWebService
from ppmessage.backend.send import SendWebService
from ppmessage.cache.cacheapp import CacheWebService
from ppmessage.backend.ppcomapp import PPComWebService
from ppmessage.backend.ppemail import PPEmailWebService
from ppmessage.backend.gcmpush import GcmPushWebService
from ppmessage.backend.ppauthapp import PPAuthWebService
from ppmessage.backend.mqttpush import MqttPushWebService
from ppmessage.iospush.iospushapp import IOSPushWebService
from ppmessage.backend.dispatcher import DispatcherWebService
from ppmessage.backend.ppconsoleapp import PPConsoleWebService
from ppmessage.pcsocket.pcsocketapp import PCSocketWebService
from ppmessage.file.uploadapplication import UploadWebService
from ppmessage.file.downloadapplication import DownloadWebService

from ppmessage.backend.message import mqtt_message_main

import os
import sys
import redis
import logging
import tornado.web
import tornado.ioloop
import tornado.options
import tornado.httpserver

tornado.options.define("port", default=MAIN_PORT, help="", type=int)  

class MainApplication(tornado.web.Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        settings["cookie_secret"] = "24oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="
        settings["template_path"]= os.path.join(os.path.dirname(__file__), "../resource/template")

        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)

        DownloadHandler.set_cls_redis(self.redis)
        
        self.geoip_reader = load_ip2geo()
        if self.geoip_reader == None:
            sys.exit()
            
        self.total_handlers = get_total_handlers()
        self.total_delegates = get_total_delegates(self)
        
        handlers = []
        for i in self.total_handlers:
            handler = ("/" + i["name"].lower() + i["handler"][0], i["handler"][1])
            if len(i["handler"]) == 3:
                handler = ("/" + i["name"].lower() + i["handler"][0], i["handler"][1], i["handler"][2])
            handlers.append(handler)
        
        tornado.web.Application.__init__(self, handlers, **settings)        
        return

    def get_delegate(self, name):
        return self.total_delegates.get(name)

    def run_periodic(self):
        for name in self.total_delegates:
            self.total_delegates[name].run_periodic()
        return

def _main():
    tornado.options.parse_command_line()

    _app = MainApplication()
    
    tornado.httpserver.HTTPServer(_app).listen(tornado.options.options.port)
    _app.run_periodic()

    mqtt_message_main()
    logging.info("Starting PPMessage backend servcie on %d." % tornado.options.options.port)
    
    tornado.ioloop.IOLoop.instance().start()
    return

if __name__ == "__main__":
    _main()

