# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import OrgGroup
from ppmessage.db.models import OrgGroupUserData

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.api.handlers.ppaddorggroupuserhandler import update_group_icon

import json
import logging

class PPRemoveOrgGroupUserHandler(BaseHandler):
    """
    """

    def _remove(self, _group_uuid, _user_uuid):
        _redis = self.application.redis
        _key = OrgGroupUserData.__tablename__ + ".group_uuid." + _group_uuid
        if _redis.sismember(_key, _user_uuid) == False:
            self.setErrorCode(API_ERR.NOT_GROUP_USER)
            logging.error("user: %s not in group:%s" % (_user_uuid, _group_uuid))
            return False

        _key = OrgGroupUserData.__tablename__ + ".group_uuid." + _group_uuid + \
               ".user_uuid." + _user_uuid
        _data_uuid = _redis.get(_key)
        if _data_uuid == None:
            self.setErrorCode(API_ERR.NOT_GROUP_USER)
            logging.error("user: %s group:%s not bind." % (_user_uuid, _group_uuid))
            return False
        
        _row = OrgGroupUserData(uuid=_data_uuid)
        _row.async_delete(_redis)
        _row.delete_redis_keys(_redis)
        return True
    
    def _get(self, _app_uuid, _group_uuid, _user_list):        
        _redis = self.application.redis
        
        for _user_uuid in _user_list:
            _r = self._remove(_group_uuid, _user_uuid)

        update_group_icon(_redis, _group_uuid)
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPRemoveOrgGroupUserHandler, self)._Task()
        _body = json.loads(self.request.body)
        _app_uuid = _body.get("app_uuid")
        _group_uuid = _body.get("group_uuid")
        _user_list = _body.get("user_list")

        if _app_uuid == None or _group_uuid == None or _user_list == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        if not isinstance(_user_list, list):
            self.setErrorCode(API_ERR.NOT_LIST)
            return

        self._get(_app_uuid, _group_uuid, _user_list)
        return
