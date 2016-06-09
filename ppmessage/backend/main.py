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

from ppmessage.api.apiapp import ApiWebService
from ppmessage.backend.ppcomapp import PPComWebService
from ppmessage.backend.ppconsoleapp import PPConsoleWebService
from ppmessage.pcsocket.pcsocketapp import PCSocketWebService
from ppmessage.file.uploadapplication import UploadWebService
from ppmessage.file.downloadapplication import DownloadWebService

import os
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

        total_handlers = get_total_handlers()

        handlers = []
        for i in total_handlers:
            handler = ("/" + i["name"].lower() + i["handler"][0], i["handler"][1])
            if len(i["handler"]) == 3:
                handler = ("/" + i["name"].lower() + i["handler"][0], i["handler"][1], i["handler"][2])
            handlers.append(handler)
        logging.info(handlers)
        tornado.web.Application.__init__(self, handlers, **settings)        
        return                

def _main():
    tornado.options.parse_command_line()

    _app = MainApplication()
    _app.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
    
    _http_server = tornado.httpserver.HTTPServer(_app)

    logging.info("Starting PPMessage backend servcie on %d." % tornado.options.options.port)

    _http_server.listen(tornado.options.options.port)
    loop = tornado.ioloop.IOLoop.instance()
    loop.start()

    return

if __name__ == "__main__":
    _main()

