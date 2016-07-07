# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import OrgGroup
from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL

import json
import logging

class PPRemoveOrgGroupHandler(BaseHandler):

    def _remove(self, _app_uuid, _group_uuid):
        _redis = self.application.redis
        _key = OrgGroup.__tablename__ + ".app_uuid." + _app_uuid
        _is = _redis.sismember(_key, _group_uuid)
        
        if _is != True:
            logging.error("group: %s not belong to app_uuid: %s" % (_group_uuid, _app_uuid))
            return

        _row = OrgGroup(uuid=_group_uuid)
        _row.async_delete(_redis)
        _row.delete_redis_keys(_redis)
        return
        
    def _get(self, _app_uuid, _group_uuid):
        
        if isinstance(_group_uuid, list):
            for _uuid in _group_uuid:
                _remove(_app_uuid, _uuid)
        else:
            _remove(_app_uuid, _group_uuid)
            
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPRemoveOrgGroupHandler, self)._Task()
        _body = json.loads(self.request.body)
        if "app_uuid" not in _body or "group_uuid" not in _body:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        self._get(_body.get("app_uuid"), _body.get("group_uuid"))
        return
    
