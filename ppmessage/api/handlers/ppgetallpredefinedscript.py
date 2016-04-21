# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL
from ppmessage.db.models import PredefinedScript
from ppmessage.core.redis import redis_hash_to_dict

import json
import logging

class PPGetAllPredefinedScript(BaseHandler):

    def _get(self):
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _key = PredefinedScript.__tablename__ + ".app_uuid." + _app_uuid
        _scripts = self.application.redis.smembers(_key)
        _ret = self.getReturnData()
        _ret["list"] = []
        for _script in _scripts:
            _ret["list"].append(redis_hash_to_dict(self.application.redis, PredefinedScript, _script))
        return
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return

    def _Task(self):
        super(PPGetAllPredefinedScript, self)._Task()
        self._get()
        return
