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

class PPRemovePredefinedScript(BaseHandler):

    def _remove(self):
        _request = json.loads(self.request.body)
        _script_uuid = _request.get("script_uuid")

        if _script_uuid == None or len(_script_uuid) == 0:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _row = PredefinedScript(uuid=_script_uuid)
        _row.async_delete(self.application.redis)
        _row.delete_redis_keys(self.application.redis)
        return
    
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPRemovePredefinedScript, self)._Task()
        self._remove()
        return
