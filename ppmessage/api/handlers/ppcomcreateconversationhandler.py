# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import OrgGroup
from ppmessage.db.models import AppInfo
from ppmessage.db.models import FileInfo
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import ConversationInfo
from ppmessage.db.models import ConversationUserData

from ppmessage.core.redis import redis_hash_to_dict

from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.core.constant import CONVERSATION_STATUS

from ppmessage.dispatcher.policy.policy import AbstractPolicy
from ppmessage.dispatcher.policy.policy import BroadcastPolicy

from ppmessage.core.utils.createicon import create_group_icon
from ppmessage.core.utils.datetimestring import datetime_to_microsecond_timestamp

import copy
import uuid
import json
import time
import logging
import datetime

class PPComCreateConversationHandler(BaseHandler):
    """
    For the member_list length == 1, if the conversation has been created 
    return the existed conversation

    For the group_uuid != None, if the conversation has been created
    return the existed conversation
    
    """
    def _return(self, _conversation_uuid, _request):
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")

        _conversation = redis_hash_to_dict(self.application.redis, ConversationInfo, _conversation_uuid)
        if _conversation == None:
            self.setErrorCode(API_ERR.NO_CONVERSATION)
            return
        _r = self.getReturnData()
        _r.update(_conversation)
        
        _key = ConversationUserData.__tablename__ + ".app_uuid." + _app_uuid + \
               ".user_uuid." + _user_uuid + ".conversation_uuid." + _conversation_uuid
        _data_uuid = _redis.get(_key)
        if _data_uuid != None:
            _key = ConversationUserData.__tablename__ + ".uuid." + _data_uuid
            _data = _redis.hmget(_key, ["conversation_name", "conversation_icon"])
            if _data[0] != None:
                _r["conversation_name"] = _data[0]
            if _data[1] != None:
                _r["conversation_icon"] = _data[1]
        return

    def _create(self, _member_uuid, _request):
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        _redis = self.application.redis

        _key = DeviceUser.__tablename + ".uuid." + _user_uuid
        _portal_user_name = _redis.hget(_key, "user_name")
        _portal_user_icon = _redis.hget(_key, "user_icon")

        _key = DeviceUser.__tablename + ".uuid." + _member_uuid
        _member_user_name = _redis.hget(_key, "user_name")
        _member_user_icon = _redis.hget(_key, "user_icon")
        
        _conversation_uuid = str(uuid.uuid1())
        _values = {
            "uuid": _conversation_uuid,
            "app_uuid": _app_uuid,
            "user_uuid": _user_uuid,
            "assigned_uuid": _member_uuid,
            "conversation_type": CONVERSATION_TYPE.P2S,
            "status": CONVERSATION_STATUS.NEW,
        }
        # create it
        _row = ConversationInfo(**_values)
        _row.async_add()
        _row.create_redis_keys(_redis)

        _row = ConversationUserData(uuid=str(uuid.uuid1()),
                                    user_uuid=_user_uuid,
                                    conversation_uuid=_conversation_uuid,
                                    conversation_type=CONVERSATION_TYPE.P2S,
                                    conversation_name=_member_user_name,
                                    conversation_icon=_member_user_icon,
                                    conversation_status=CONVERSATION_STATUS.NEW)
        _row.async_add()
        _row.create_redis_keys(_redis)

        _row = ConversationUserData(uuid=str(uuid.uuid1()),
                                    user_uuid=_member_uuid,
                                    conversation_uuid=_conversation_uuid,
                                    conversation_type=CONVERSATION_TYPE.P2S,
                                    conversation_name=_portal_user_name,
                                    conversation_icon=_portal_user_icon,
                                    conversation_status=CONVERSATION_STATUS.NEW)
        _row.async_add()
        _row.create_redis_keys(_redis)

        return
    
    def _existed(self, _request):
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        _group_uuid = _request.get("group_uuid")
        _member_list = _request.get("member_list")
        _redis = self.application.redis
        
        if _group_uuid != None:
            _key = ConversationInfo.__tablename__ + ".app_uuid." + _app_uuid + \
                   ".user_uuid." + _user_uuid + ".group_uuid." + _group_uuid
            _conversation_uuid = _redis.get(_key)
            if _conversation_uuid != None:
                self._return(_conversation_uuid, _request)
                return True
            return False
        
        if _member_list != None and isinstance(_member_list, list) == True and len(_member_list) == 1:
            _assigned_uuid = _member_list[0]
            if _assigned_uuid == None:
                return False
            _key = ConversationInfo.__tablename__ + ".app_uuid." + _app_uuid + \
                   ".user_uuid." + _user_uuid + ".assigned_uuid." + _assigned_uuid
            _conversation_uuid = _redis.get(_key)
            if _conversation_uuid != None:
                _key = ConversationUserData.__tablename__ + ".conversation_uuid." + _conversation_uuid
                _count = _redis.scard(_key)
                if _count == 2:
                    self._return(_conversation_uuid, _request)
                    _r = self.getReturnData()
                    return True
            return False

        if _member_list == None:
            _key = ConversationUserData.__tablename__ + ".app_uuid." + _app_uuid + ".user_uuid." + _user_uuid
            _conversations = _redis.smembers(_key)
            if len(_conversations) == 0:
                return False

            _pi = _redis.pipeline()
            for _conversation_uuid in _conversations:
                _key = ConversationInfo.__tablename__ + ".uuid." + _conversation
                _pi.hget(_key, "updatetime")
            _updatetime = _pi.execute()
            
            _unsorted = zip(_conversations, _updatetime)
            _sorted = sorted(_unsorted, lambda x,y: cmp(x[1], y[1]), reverse=True)
            self._return(_sorted[0][0], _request)
            return True

        return False

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        return
    
    def _Task(self):
        super(PPComCreateConversationHandler, self)._Task()
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        _device_uuid = _request.get("device_uuid")
        _group_uuid = _request.get("group_uuid")
        _member_list = _request.get("member_list")
        _conversation_type = _request.get("conversation_type")
        
        if _app_uuid == None or _user_uuid == None or _conversation_type == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        if _conversation_type != CONVERSATION_TYPE.P2S:
            self.setErrorCode(API_ERR.NO_PARA)
            return None

        if self._existed(_request):
            return

        # assume ppcom only want to talk with only one
        if _member_list != None and isinstance(_member_list, list) == True and len(_member_list) == 1:
            self._create(_member_list[0], _request)
            return
        
        _key = AppInfo.__tablename__ + ".uuid." + _app_uuid
        _app_route_policy = self.application.redis.hget(_key, "app_route_policy")
        if _app_route_policy == APP_POLICY.GROUP and _group_uuid != None:
            if _device_uuid == None or len(_device_uuid) == 0:
                self.setErrorCode(API_ERR.NO_PARA)
                return

            _key = REDIS_AMD_KEY + ".app_uuid." + _app_uuid
            _value = {"user_uuid": _user_uuid, "device_uuid":_device_uuid, "group_uuid":_group_uuid}
            self.application.redis.rpush(_key, json.dumps(_value))
            return
        
        logging.error("can not create conversation for PPCom: %s" % str(_request))
        return

