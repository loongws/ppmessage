# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/iospush2.py
#

from ppmessage.iospush2.iospushapp import IOSPushApp

import tornado.ioloop
import tornado.options
import tornado.httpserver

import sys
import logging

def _main():    
    tornado.options.parse_command_line()
    
    _app = IOSPushApp()
    _app.get_delegate("").run_periodic()

    logging.info("IOSPush2 service starting...")
    tornado.ioloop.IOLoop.instance().start()
    return

if __name__ == "__main__":
    _main()
    
