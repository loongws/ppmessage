# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import REDIS_AMD_KEY

from ppmessage.db.models import ConversationInfo
from ppmessage.db.models import ConversationUserData

import json
import logging

class PPGetAmdQueueLength(BaseHandler):

    def _get(self):
        _request = json.loads(self.request.body)

        _app_uuid = _request.get("app_uuid")
        if _app_uuid == None or len(_app_uuid) == 0:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _user_uuid = _request.get("user_uuid")
        if _user_uuid == None or len(_user_uuid) == 0:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _redis = self.application.redis
        _conversation_uuid = None
        _key = ConversationUserData.__tablename__ + ".app_uuid." + _app_uuid + ".user_uuid." + _user_uuid
        _conversations = _redis.smembers(_key)
        if len(_conversations) > 0:
            _pi = _redis.pipeline()
            for _conversation_uuid in _conversations:
                _key = ConversationInfo.__tablename__ + ".uuid." + _conversation_uuid
                _pi.hget(_key, "updatetime")
            _updatetime = _pi.execute()
            
            _unsorted = zip(_conversations, _updatetime)
            _sorted = sorted(_unsorted, lambda x,y: cmp(x[1], y[1]), reverse=True)
            _conversation_uuid = _sorted[0][0]

        _key = REDIS_AMD_KEY + ".app_uuid." + _app_uuid
        _len = self.application.redis.scard(_key)
        _r = self.getReturnData()
        _r.update({"length": _len, "conversation_uuid": _conversation_uuid, "user_uuid": _user_uuid})
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        return

    def _Task(self):
        super(PPGetAmdQueueLength, self)._Task()
        self._get()
        return
