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

import copy
import json
import uuid
import logging

class PPAddPredefinedScript(BaseHandler):

    def _add(self):
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _group_uuid = _request.get("group_uuid")
        _script_answer = _request.get("script_answer")
        _script_question = _request.get("script_question")

        if _script_answer == None or len(_script_answer) == 0:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        _uuid = str(uuid.uuid1())
        
        _row = PredefinedScript(uuid=_uuid, app_uuid=_app_uuid, group_uuid=_group_uuid,
                                script_question=_script_question, script_answer=_script_answer)
        _row.async_add(self.application.redis)
        _row.create_redis_keys(self.application.redis)
        _ret = self.getReturnData()
        _ret = copy.deepcopy(_request)
        _ret["uuid"] = _uuid
        return
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return

    def _Task(self):
        super(PPAddPredefinedScript, self)._Task()
        self._add()
        return
