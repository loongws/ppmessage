# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/pcsocket.py 
# The entry form pcsocket service
#
#

from ppmessage.pcsocket.pcsocketapp import PCSocketApp
from ppmessage.core.constant import PCSOCKET_PORT

import logging
import tornado.ioloop
import tornado.options
import tornado.httpserver

tornado.options.define("port", default=PCSOCKET_PORT, help="", type=int)  

if __name__ == "__main__":

    tornado.options.parse_command_line()
    _app = PCSocketApp()

    _app.get_delegate("").run_periodic()
    _http_server = tornado.httpserver.HTTPServer(_app)
    _port = tornado.options.options.port
    _http_server.listen(_port)

    logging.info("Starting pcsocket service......")
    tornado.ioloop.IOLoop.instance().start()
    

