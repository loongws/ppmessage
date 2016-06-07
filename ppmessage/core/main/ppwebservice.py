# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# core/main/ppwebservice.py
#

from ppmessage.core.constant import PP_WEB_SERVICE

_registry = {}

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

MetaWebService = Meta("MetaWebService", (object,), {})

class AbstractWebService(MetaWebService):
    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.ABASTRACT


def get_total_handlers():
    handlers = []
    for i in _registry:
        j = _registry[i].get_handlers()
        for k in j:
            handlers.append({"name":_registry[i].name(), "handler":k})
    return handlers

