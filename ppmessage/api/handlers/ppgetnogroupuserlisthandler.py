# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import OrgGroupUserData
from ppmessage.db.models import AppUserData
from ppmessage.db.models import DeviceUser

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL
import json
import logging

class PPGetNoGroupUserListHandler(BaseHandler):

    def _get_no_group(self, _app_uuid):
        _redis = self.application.redis
        _key = AppUserData.__tablename__ + \
               ".app_uuid." + _app_uuid + \
               ".is_service_user.True"
        _users = list(_redis.smembers(_key))
        _pipe = _redis.pipeline()
        _pre = OrgGroupUserData.__tablename__ + ".user_uuid."
        for _user_uuid in _users:
            _key = _pre + _user_uuid
            _pipe.exists(_key)
        _has = _pipe.execute()

        _all_users = dict(zip(_users, _has))
        _no_group_users = []
        for _user_uuid in _all_users:
            if _all_users[_user_uuid] == True:
                continue
            _no_group_users.append(_user_uuid)

        _pipe = _redis.pipeline()
        _pre = DeviceUser.__tablename__ + ".uuid."
        for _user_uuid in _no_group_users:
            _key = _pre + _user_uuid
            _pipe.hgetall(_key)
        _details = _pipe.execute()
        
        _r = self.getReturnData()
        _r["list"] = _details
        return

    def _get_not_in_group(self, _app_uuid, _group_uuid):
        _redis = self.application.redis
        _all_users_key = AppUserData.__tablename__ + \
               ".app_uuid." + _app_uuid + \
               ".is_service_user.True"
        _group_users_key = OrgGroupUserData.__tablename__ + \
               ".group_uuid." + _group_uuid

        _users = _redis.sdiff(_all_users_key, _group_users_key)
        
        _pipe = _redis.pipeline()
        _pre = DeviceUser.__tablename__ + ".uuid."
        for _user_uuid in _users:
            _key = _pre + _user_uuid
            _pipe.hgetall(_key)
        _details = _pipe.execute()
        
        _r = self.getReturnData()
        _r["list"] = _details
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPGetNoGroupUserListHandler, self)._Task()
        _body = json.loads(self.request.body.decode("utf-8"))
        _app_uuid = _body.get("app_uuid")
        
        if _app_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        _group_uuid = _body.get("group_uuid")
        if _group_uuid == None:
            return self._get_no_group(_app_uuid)
        return self._get_not_in_group(_app_uuid, _group_uuid)


