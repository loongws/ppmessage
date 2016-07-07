# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL
from ppmessage.db.dbinstance import BaseModel

from ppmessage.core.redis import redis_hash_to_dict
from ppemssage.core.redis import search_redis_index

import json
import logging

def _class(tablename):
    for c in BaseModel._decl_class_registry.values():
        if hasattr(c, '__tablename__') and c.__tablename__ == tablename:
            return c
    return None

class PPSearchPrefixHandler(BaseHandler):

    def _search(self):
        _request = json.loads(self.request.body.decode("utf-8"))
        _table = _request.get("table")
        _search = _request.get("search")
        _size = _request.get("size")

        _redis = self.application.redis
        
        if _table == None or _search == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _cls = _class(_table)
        if _cls == None:
            self.setErrorCode(API_ERR.NO_TABLE)
            logging.info("no such table class: %s" % _table)
            return
        
        if _size == None:
            _size = 12

        _uuid_list = search_redis_index(_redis, _table, _search)
        _uuid_list = _uuid_list[:_size]

        _list = []
        for _uuid in _uuid_list:
            _list.append(redis_hash_to_dict(_redis, _cls, _uuid))

        _return = self.getReturnData()
        _return["list"] = _list
        return
    
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPSearchPrefixHandler, self)._Task()
        self._search()
        return

