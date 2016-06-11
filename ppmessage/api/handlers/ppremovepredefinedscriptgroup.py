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
from ppmessage.db.models import PredefinedScriptGroup

import json
import logging

class PPRemovePredefinedScriptGroup(BaseHandler):

    def _remove(self):
        _request = json.loads(self.request.body)
        _group_uuid = _request.get("group_uuid")
        if _group_uuid == None or len(_group_uuid) == 0:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _group = PredefinedScriptGroup(uuid=_group_uuid)
        _group.async_delete(self.application.redis)
        _group.delete_redis_keys(self.application.redis)

        _key = PredefinedScript.__tablename__ + ".group_uuid." + _group_uuid
        _scripts = self.application.redis.smembers(_key)
        self.application.redis.delete(_key)

        _key = PredefinedScript.__tablename__ + ".group_uuid.None"
        for _script in _scripts:
            self.application.redis.sadd(_key, _script)
        return
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPRemovePredefinedScriptGroup, self)._Task()
        self._remove()
        return
