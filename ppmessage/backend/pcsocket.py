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
from ppmessage.pcsocket.getthread import getThread

from ppmessage.core.srv.backendio import BackendIO
from ppmessage.core.constant import PCSOCKET_PORT

import tornado.httpserver
import tornado.ioloop
import tornado.options

import logging

tornado.options.define("port", default=PCSOCKET_PORT, help="", type=int)  

if __name__ == "__main__":

    tornado.options.parse_command_line()
    _port = tornado.options.options.port
    _app = PCSocketApp()

    _app.register_service(str(_port))
    _io = BackendIO(getThread(), _app)
    
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(_port)

    # set the periodic check online every 1000 ms
    tornado.ioloop.PeriodicCallback(_app.online_loop, 1000).start()

    # set the periodic check typing every 1000 ms
    tornado.ioloop.PeriodicCallback(_app.typing_loop, 1000).start()

    # set the periodic check logout every 1000 ms
    tornado.ioloop.PeriodicCallback(_app.logout_loop, 1000).start()

    # set the periodic check ack every 100 ms
    tornado.ioloop.PeriodicCallback(_app.ack_loop, 100).start()

    # set the periodic check push every 50 ms
    tornado.ioloop.PeriodicCallback(_app.push_loop, 50).start()

    logging.info("Starting pcsocket service......")
    tornado.ioloop.IOLoop.instance().start()
    

