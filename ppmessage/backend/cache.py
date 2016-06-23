# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/cache.py 
# The entry form cache service
#

from ppmessage.cache.cacheapp import CacheApp

import logging
import tornado.ioloop
import tornado.options

def _main():
    tornado.options.parse_command_line()
    _app = CacheApp()
    _app.get_delegate("").run_periodic()
    logging.info("Starting cache service......")
    tornado.ioloop.IOLoop.instance().start()
    return
    
if __name__ == "__main__":
    _main()
