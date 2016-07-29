# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import MessagePush
from ppmessage.db.models import MessagePushTask

from ppmessage.core.constant import API_LEVEL

import traceback
import logging
import json
import copy

class PPPageUnackedMessageHandler(BaseHandler):

    def _detail(self, _pushs):
        _redis = self.application.redis

        if _pushs == None or len(_pushs) == 0:
            return
        
        _pi = _redis.pipeline()
        for _push in _pushs:
            _key = MessagePush.__tablename__ + ".uuid." + _push
            _pi.hget(_key, "task_uuid")
        _tasks = _pi.execute()
        
        _pi = _redis.pipeline()
        for _task in _tasks:
            _key = MessagePushTask.__tablename__ + ".uuid." + _task
            _pi.hget(_key, "message_body")
        _messages = _pi.execute()

        _messages = dict(zip(_pushs, _messages))
        _return = self.getReturnData()
        _return["list"] = copy.deepcopy(_pushs)
        _return["message"] = copy.deepcopy(_messages)
        return
    
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)        
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return

    def _return_by_page(self, _key, _page_offset, _page_size, _total_count):
        _redis = self.application.redis
        
        _r = self.getReturnData()
        _r["total_count"] = _total_count
        _r["return_count"] = 0
        _r["page_size"] = _page_size
        _r["page_offset"] = _page_offset
        _r["list"] = []
        _r["message"] = {}

        if _total_count == 0:
            logging.info("no unacked messages of user: %s" % self._user_uuid)
            return
        
        _offset = _page_offset * _page_size
        if _offset >= _total_count:
            logging.error("page offset: %d > total: %d" % (_offset, _total_count))
            return
                
        _return_count = _page_size
        if _offset + _page_size >= _total_count:
            _return_count = _total_count - _offset

        _task_list = _redis.zrange(_key, _offset, _offset+_return_count-1)

        if _task_list == None or len(_task_list) == 0:
            return
        
        self._detail(_task_list)
        return

    def _return_by_max(self, _key, _max_uuid, _page_size):
        _redis = self.application.redis
        
        _r = self.getReturnData()
        _r["return_count"] = 0
        _r["max_uuid"] = _max_uuid
        _r["list"] = []
        _r["message"] = {}

        _max_score = _redis.zscore(_key, _max_uuid)
        if _max_score == None:
            logging.error("no max_core for the uuid: %s" % _max_uuid)
            return

        _pushs = _redis.zrevrangebyscore(_key, _max_score, "-inf", start=0, num=_page_size).reverse()
        if len(_pushs) == 0:
            logging.info("no pushs lower than %s" % _max_score)
            return

        if _max_uuid in _pushs:
            _pushs.remove(_max_uuid)
        
        self._detail(_pushs)
        return

    def _return_by_min(self, _key, _min_uuid, _page_size):
        _redis = self.application.redis
        
        _r = self.getReturnData()
        _r["return_count"] = 0
        _r["min_uuid"] = _min_uuid
        _r["list"] = []
        _r["message"] = {}

        _min_score = _redis.zscore(_key, _min_uuid)
        if _min_score == None:
            logging.error("no min_core for the uuid: %s" % _min_uuid)
            return

        _pushs = _redis.zrangebyscore(_key, _min_score, "+inf", start=0, num=_page_size)
        if len(_pushs) == 0:
            logging.info("no pushs lower than %s" % _max_score)
            return

        if _min_uuid in _pushs:
            _pushs.remove(_min_uuid)
        
        self._detail(_pushs)
        return
    
    def _Task(self):
        super(PPPageUnackedMessageHandler, self)._Task()

        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")

        if _user_uuid == None or _app_uuid == None:
            logging.error("not enough parameters.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        self._app_uuid = _app_uuid
        self._user_uuid = _user_uuid
        
        _redis = self.application.redis
        _key = MessagePush.__tablename__ + ".app_uuid." + _app_uuid + ".user_uuid." + _user_uuid
        _total_count = _redis.zcard(_key)

        _page_offset = _request.get("page_offset")
        if _page_offset == None or _page_offset < 0:
            _page_offset = 0
            
        _page_size = _request.get("page_size")
        if _page_size == None or _page_size < 0:
            _page_size = 30

        _max_uuid = _request.get("max_uuid")
        if _max_uuid != None:
            logging.info("return by max: %s" % _max_uuid)
            self._return_by_max(_key, _max_uuid, _page_size)
            return

        _min_uuid = _request.get("max_uuid")
        if _min_uuid != None:
            self._return_by_min(_key, _min_uuid, _page_size)
            return
        
        if _max_uuid == None and _min_uuid == None:
            self._return_by_page(_key, _page_offset, _page_size, _total_count)
            return

        return
