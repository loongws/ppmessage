# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from .policy import AbstractPolicy

from ppmessage.core.constant import APP_POLICY

class GroupPolicy(AbstractPolicy):
    def __init__(self, dis):
        super(GroupPolicy, self).__init__(dis)
        self._name = APP_POLICY.GROUP
        return

    @classmethod
    def name(cls):
        return APP_POLICY.GROUP
    
    def users(self):
        super(GroupPolicy, self).users()
        return

    @classmethod
    def get_service_care_users(cls, _app_uuid, _user_uuid, _redis):
        _a_users = []
        _key = OrgGroupUserData.__tablename__ + ".user_uuid." + _user_uuid
        _group_uuid = _redis.get(_key)
        if _group_uuid != None:
            _key = OrgGroupUserData.__tablename__ + ".group_uuid." + _group_uuid
            _a_users = list(_redis.smembers(_key))
        _b_users = AbstractPolicy.app_users(_app_uuid, False, _redis)    
        return _a_users + _b_users

    @classmethod
    def get_portal_care_users(cls, _app_uuid, _user_uuid, _redis):
        _a_users = AbstractPolicy.app_users(_app_uuid, True, _redis)        
        return _a_users


