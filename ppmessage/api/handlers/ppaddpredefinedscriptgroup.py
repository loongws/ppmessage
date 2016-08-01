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
import uuid
import json
import logging

class PPAddPredefinedScriptGroup(BaseHandler):

    def _add(self):
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _group_name = _request.get("group_name")
                
        if _group_name == None or len(_group_name) == 0 or \
           len(_group_name) > PredefinedScriptGroup.group_name.property.columns[0].type.length:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        _uuid = str(uuid.uuid1())
        _row = PredefinedScriptGroup(uuid=_uuid, app_uuid=_app_uuid, group_name=_group_name)
        _row.async_add(self.application.redis)
        _row.create_redis_keys(self.application.redis)
        _ret = self.getReturnData()
        _ret = copy.deepcopy(_request)
        _ret.update({"uuid": _uuid})
        return
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPAddPredefinedScriptGroup, self)._Task()
        self._add()
        return
