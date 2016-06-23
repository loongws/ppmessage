# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/identiconapp.py
#

from ppmessage.core.singleton import singleton
from ppmessage.core.constant import PP_WEB_SERVICE
from ppmessage.core.main import AbstractWebService
from ppmessage.core.identiconhandler import IdenticonHandler

import os
import logging

import tornado.web

@singleton
class IdenticonDelegate():
    def __init__(self, app):
        return
    def run_periodic(self):
        return
        
class IdenticonWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.IDENTICON

    @classmethod
    def get_handlers(cls):        
        handlers=[("/identicon/([^\/]+)?$", IdenticonHandler, {"path": "/"})]
        return handlers

    @classmethod
    def get_delegate(cls, app):
        return IdenticonDelegate(app)

class IdenticonApp(tornado.web.Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        settings["cookie_secret"] = "24oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="
        tornado.web.Application.__init__(self, IdenticonWebService.get_handlers(), **settings)

    def get_delegate(self, name):
        return IdenticonDelegate(self)

    
