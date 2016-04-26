# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import DeviceUser

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import REDIS_AMD_KEY
from ppmessage.core.constant import SERVICE_USER_STATUS

import json
import logging

class PPCancelWaitingCreateConversation(BaseHandler):

    def _cancel(self):
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        _device_uuid = _request.get("device_uuid")
        _group_uuid = _request.get("group_uuid")
        
        if _app_uuid == None or _user_uuid == None or _device_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _value = {"user_uuid": _user_uuid, "device_uuid": _device_uuid, "group_uuid": str(_group_uuid)}
        _value = json.dumps(_value)

        _key = REDIS_AMD_KEY + ".app_uuid." + _app_uuid
        _values = self.application.redis.lrange(_key, 0, -1)

        self.application.redis.delete(_key)
        
        for _i in range(len(_values)):
            if _values[_i] != _value:
                self.application.redis.rpush(_key, _values[_i])
        return
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        return

    def _Task(self):
        super(PPCancelWaitingCreateConversation, self)._Task()
        self._cancel()
        return
