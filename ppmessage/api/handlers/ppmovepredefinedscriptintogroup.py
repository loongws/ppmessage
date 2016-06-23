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

import json
import logging

class PPMovePredefinedScriptIntoGroup(BaseHandler):

    def _move(self):
        _request = json.loads(self.request.body)
        _group_uuid = str(_request.get("group_uuid"))
        _script_uuid = _request.get("script_uuid")
        if _script_uuid == None or len(_script_uuid) == 0:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _script = redis_hash_to_dict(self.application.redis, PredefinedScript, _script_uuid)
        if _script == None:
            logging.error("No such script: %s" % _script_uuid)
            return
        
        _old_group_uuid = str(_script.get("group_uuid"))
        _key = PredefinedScript.__tablename__ + ".group_uuid." + _old_group_uuid
        self.application.redis.srem(_key, _script_uuid)

        _row = PredefinedScript(uuid=_script_uuid, group_uuid=_group_uuid)
        _row.async_update(self.application.redis)
        _row.update_redis_keys(self.application.redis)
        return
    
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPMovePredefinedScriptIntoGroup, self)._Task()
        self._move()
        return
