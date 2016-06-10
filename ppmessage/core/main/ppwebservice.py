# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# core/main/ppwebservice.py
#

from ppmessage.core.constant import PP_WEB_SERVICE
import logging

_registry = {}

class MetaDelegate():
    def __init__(self, app):
        return
    
    def run_periodic(self):
        return

class Meta(type):
    def __init__(cls, name, bases, dict_):
        _registry[name] = cls
        type.__init__(cls, name, bases, dict_)
        return

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.META

    @classmethod
    def get_handlers(cls):
        return []

    @classmethod
    def get_delegate(cls, app):
        return MetaDelegate(app)
    
MetaWebService = Meta("MetaWebService", (object,), {})

class AbstractWebService(MetaWebService):
    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.ABSTRACT

def get_total_handlers():
    handlers = []
    for i in _registry:
        j = _registry[i].get_handlers()
        for k in j:
            handlers.append({"name":_registry[i].name(), "handler":k})
    return handlers

def get_total_delegates(app):
    delegates = {}
    for i in _registry:
        logging.info(_registry[i].name())
        delegates[_registry[i].name()] = _registry[i].get_delegate(app)
    return delegates
    

