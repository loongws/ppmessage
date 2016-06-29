# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL

from ppmessage.db.models import OrgGroup

import json
import time
import logging

class PPPageOrgGroupHandler(BaseHandler):
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)        
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return

    def _return_detail(self, _groups):
        _pi = self._redis.pipeline()
        for _group_uuid in _groups:
            _key = OrgGroup.__tablename__ + ".uuid." + _group_uuid
            _pi.hgetall(_key)
        _group_dicts = _pi.execute()

        for _group in _group_dicts:
            _key = OrgGroupUserData.__tablename__ + ".group_uuid." + _group.get("uuid")
            _group["user_count"] = self._redis.scard(_key)
        
        _r = self.getReturnData()
        _r["total_count"] = self._total_count
        _r["return_count"] = len(_groups)
        _r["page_offset"] = self._page_offset
        _r["page_size"] = self._page_size
        _r["list"] = _group_dicts
        return

    def _return_empty(self):
        _rdata = self.getReturnData()
        _rdata["total_count"] = self._total_count
        _rdata["page_offset"] = self._page_offset
        _rdata["page_size"] = self._page_size
        _rdata["return_count"] = 0
        _rdata["list"] = []
        return

    def _return_by_page(self):                
        _offset = self._page_offset * self._page_size
        if _offset >= self._total_count:
            logging.error("page offset: %d > covnersation total: %d" % (_offset, self._total_count))
            return self._return_empty()

        _return_count = self._page_size
        if _offset + self._page_size >= self._total_count:
            _return_count = self._total_count - _offset

        _groups = self._redis.smembers(self._set_key)
        _groups = _groups[_offset:_offset+_return_count]
    
        returun self._return_details(_groups)

    def _Task(self):
        super(PPPageOrgGroupHandler, self)._Task()
        _body = json.loads(self.request.body)
        self._redis = self.application.redis
        
        self._app_uuid = _body.get("app_uuid")
        self._page_size = _body.get("page_size")
        self._page_offset = _body.get("page_offset")

        if self._app_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        self._set_key = OrgGroup.__tablename__ + ".app_uuid." + self._app_uuid
        
        self._total_count = self._redis.zcard(self._set_key)
        if self._total_count == 0:
            logging.info("no group for this app: %s" % self._app_uuid)
            self._return_empty()
            return
        
        if self._page_size == None or self._page_size < 0:
            self._page_size = 30

        if self._page_offset == None or self._page_offset < 0:
            self._page_offset = 0
            return self._return_by_page()

        return self._return_empty()

