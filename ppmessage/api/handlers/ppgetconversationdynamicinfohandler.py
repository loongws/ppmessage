# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Jin He, jin.he@ppmessage.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import DeviceUser
from ppmessage.db.models import AppUserData
from ppmessage.db.models import ConversationInfo
from ppmessage.db.models import ConversationUserData

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.api.error import API_ERR

from ppmessage.core.constant import API_LEVEL

import uuid
import json
import logging

class PPGetConversationDynamicInfoHandler(BaseHandler):
    """
    description:
    Receive conversation_uuid and user_uuid, return conversation info with dynamic icon and name
    based on user type (service or portal user) and conversation member count. Extra work to distingush
    conversation icon and name in client side is not necessary.

    request:
    app_uuid,
    user_uuid,
    conversation_uuid,

    response:
    {
        "conversation_type":    P2S/S2S
        "conversation_icon":    icon based on conversation member count, type, request user type
        "conversation_name":    name based on conversation member count, type, request user type
        "member_count":         how many user is in this conversation, extra data
        "status":               replaced by conversation_user_data.conversation_status
        "latest_task":          latest message task of this conversation
        "user_uuid":            the creator of this conversation
        "app_uuid":
        "group_uuid":
        "assigned_uuid":
        "updatetime":
        "createtime":
        ...
    }

    """
    def _check_conversation(self):
        """
        return (conversation_info, conversation_user_data, members)

        """
        _conversation_info = redis_hash_to_dict(self.application.redis, ConversationInfo, self._conversation_uuid)
        if _conversation_info == None:
            return (None, None, [])

        _key = ConversationUserData.__tablename__ + ".app_uuid." + self._app_uuid + ".user_uuid." + \
               self._user_uuid + ".conversation_uuid." + self._conversation_uuid
        _conversation_user_data_uuid = self.application.redis.get(_key)
        if _conversation_user_data_uuid == None:
            return (_conversation_info, None, [])

        _conversation_user_data = redis_hash_to_dict(self.application.redis, ConversationUserData, _conversation_user_data_uuid)
        if _conversation_user_data == None:
            return (_conversation_info, None, [])

        _key = ConversationUserData.__tablename__ + ".conversation_uuid." + self._conversation_uuid
        _members = self.application.redis.smembers(_key)
        return (_conversation_info, _conversation_user_data, _members)

    def _check_user(self):
        """
        return (_request_user, _app_user_data)

        """
        _request_user = redis_hash_to_dict(self.application.redis, DeviceUser, self._user_uuid)
        if _request_user == None:
            return (None, None)

        _key = AppUserData.__tablename__ + ".app_uuid." + self._app_uuid + ".user_uuid." + self._user_uuid
        _app_user_data = self.application.redis.get(_key)
        if _app_user_data == None:
            return (_device_user, None)

        _app_user_data = json.loads(_app_user_data)
        return (_request_user, _app_user_data)

    def _return_by_device_user(self, _conversation_info, _conversation_user_data, _device_user):
        _rdata = self._return_by_conversation_user_data(_conversation_info, _conversation_user_data)
        if _device_user != None:
            _rdata["conversation_icon"] = _device_user.get("user_icon")
            _rdata["conversation_name"] = _device_user.get("user_fullname")
        return

    def _return_by_conversation_user_data(self, _conversation_info, _conversation_user_data):
        _rdata = self.getReturnData()
        _rdata.update(_conversation_info)

        _status = _conversation_user_data.get("conversation_status")
        if _status != None:
            _rdata["status"] = _status
        return _rdata

    def _check_conversation_existence(_request_user):
        _conversation_info, _conversation_user_data, _members = self._check_conversation()
        if _conversation_info == None:
            self.setErrorCode(API_ERR.NO_CONVERSATION)
            return

        if _conversation_user_data == None:
            self.setErrorCode(API_ERR.NOT_CONVERSATION_MEMBER)
            return

        _member_count = len(_members)
        _request_user_uuid = _request_user.get("uuid")
        if _member_count == 0 or _request_user_uuid not in _members:
            self.setErrorCode(API_ERR.NOT_CONVERSATION_MEMBER)
            return
        
        _conversation_info.member_count = len(_members)
        return (_conversation_info, _conversation_user_data, _members)

    def _handle_service_user(self, _request_user):
        """
        When a service user request for a conversation, we check following conditions:
        1. No conversaiton info, return API_ERR.NO_CONVERSATION.
        2. No conversation user data, return API_ERR.NOT_CONVERSATION_MEMBER.

        After that, we find a conversation and the request user is in this conversation, member count
        is at least 1.
        3. Conversation_type == P2S, all service users share same conversation icon and name, return
        icon and name based on portal user.
        4. Conversation_type != S2S, reserved for other kind of conversation, return icon and name based
        on conversation info and conversaiton user data.

        Then, we know this is a S2S conversation.
        5. Member count == 1, this request user is the only user in this conversation, return icon and name
        based on the request user.
        6. Member count == 2, return icon and name based on the other service user's icon and name.
        7. Member count > 2, members share same conversation icon and name, return icon and name
        (combined by all members) based on conversation info.

        """
        _conversation_info, _conversation_user_data, _members = self._check_conversation_existence(_request_user)

        _conversation_type = _conversation_info.get("conversation_type")
        if _conversation_type == CONVERSATION_TYPE.P2S:
            _portal_user_uuid = _conversation_info.get("user_uuid")
            _portal_user = redis_hash_to_dict(self.application.redis, DeviceUser, _portal_user_uuid)
            self._return_by_device_user(_conversation_info, _conversation_user_data, _portal_user)
            return

        if _conversation_type != CONVERSATION_TYPE.S2S:
            self._return_by_conversation_user_data(_conversation_info, _conversation_user_data)
            return

        _member_count = len(_members)
        if _member_count == 1:
            self._return_by_device_user(_conversation_info, _conversation_user_data, _request_user)
            return

        if _member_count == 2:
            _index = _members.index(_request_user.get("uuid"))
            _other_user_uuid = (_index == 0) ? _members[1] : _members[0]
            _other_user = redis_hash_to_dict(self.application.redis, DeviceUser, _other_user_uuid)
            self._return_by_device_user(_conversation_info, _conversation_user_data, _other_user)
            return

        self._return_by_conversation_user_data(_conversation_info, _conversation_user_data)
        return

    def _handle_portal_user(self, _request_user):
        """
        When a portal user request for a conversation, we check following conditions:
        1. No conversaiton info, return API_ERR.NO_CONVERSATION.
        2. No conversation user data, return API_ERR.NOT_CONVERSATION_MEMBER.
        3. Conversation_type != P2S, return API_ERR.NOT_CONVERSATION_MEMBER.

        After that, we find a conversation and the request user is in this conversation.
        For portal user, just return conversation info.
        """
        _conversation_info, _conversation_user_data, _members = self._check_conversation_existence(_request_user)

        _conversation_type = _conversation_info.get("conversation_type")
        if _conversation_type != CONVERSATION_TYPE.P2S:
            self.setErrorCode(API_ERR.NOT_CONVERSATION_MEMBER)
            return

        self._return_by_conversation_user_data(_conversation_info, _conversation_user_data)
        return

    def _get(self):
        _redis = self.application.redis
        _conv = redis_hash_to_dict(_redis, ConversationInfo, self._conv_uuid)
        if _conv == None:
            logging.error("no such conversation: %s" % self._conv_uuid)
            self.setErrorCode(API_ERR.NO_CONVERSATION)
            return

        _key = ConversationUserData.__tablename__ + \
               ".app_uuid." + self._app_uuid + \
               ".user_uuid." + self._user_uuid + \
               ".conversation_uuid." + self._conv_uuid
        _data_uuid = _redis.get(_key)
        if _data_uuid == None:
            logging.error("no such conversation data uuid")
            self.setErrorCode(API_ERR.NO_CONVERSATION)
            return

        _data = redis_hash_to_dict(_redis, ConversationUserData, _data_uuid)
        if _data == None:
            logging.error("no such conversation data hash")
            self.setErrorCode(API_ERR.NO_CONVERSATION)
            return

        _rdata = self.getReturnData()
        for _i in _conv:
            _rdata[_i] = _conv.get(_i)

        _rdata["conversation_data"] = _data
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
        super(PPGetConversationDynamicInfoHandler, self)._Task()
        _request = json.loads(self.request.body)
        self._app_uuid = _request.get("app_uuid")
        self._user_uuid = _request.get("user_uuid")
        self._conv_uuid = _request.get("conversation_uuid")

        if self._conv_uuid == None or \
           self._user_uuid == None or \
           self._app_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _request_user, _app_user_data = self._check_user()
        if _request_user == None:
            self.setErrorCode(API_ERR.NO_USER)
            return
        
        if _app_user_data == None:
            self.setErrorCode(API_ERR.NO_APP_USER)
            return

        if _app_user_data.get("is_service_user") == True:
            self._handle_service_user(_request_user)
            return

        if _app_user_data.get("is_portal_user") == True:
            self._handle_portal_user(_request_user)
            return

        return
