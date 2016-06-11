# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/iospush.py 
#

from ppmessage.iospush.iospushapp import IOSPushApp
from ppmessage.bootstrap.data import BOOTSTRAP_DATA

import tornado.ioloop
import tornado.options
import tornado.httpserver

import sys
import logging

def _main():    
    tornado.options.parse_command_line()

    # FIXME: support more apns certifcate
    _apns = BOOTSTRAP_DATA.get("apns")

    if _apns == None or len(_apns) == 0:
        logging.info("apns not config, iospush can not start")
        sys.exit()
    
    _app = IOSPushApp()
    _app.get_delegate("").run_periodic()
    
    logging.info("IOSPush service starting...")
    tornado.ioloop.IOLoop.instance().start()
    return

if __name__ == "__main__":
    _main()
    
