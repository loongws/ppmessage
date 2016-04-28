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

import json
import logging

class PPGetAmdQueueLength(BaseHandler):

    def _set(self):
        _request = json.loads(self.request.body)

        _app_uuid = _request.get("app_uuid")
        if _app_uuid == None or len(_app_uuid) == 0:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _key = REDIS_AMD_KEY + ".app_uuid." + _app_uuid
        _len = self.application.redis.llen(_key)
        _r = self.getReturnData()
        _r["length"] = _len
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        return

    def _Task(self):
        super(PPGetAmdQueueLength, self)._Task()
        self._get()
        return
