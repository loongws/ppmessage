# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#
# ppgetdefaultconversationhandler.py
# PPCOM get default conversation
# and the conversation users except himself
#

from .basehandler import BaseHandler

from ppmessage.db.models import AppInfo
from ppmessage.db.models import AppUserData
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import ConversationInfo
from ppmessage.db.models import ConversationUserData

from ppmessage.core.redis import redis_hash_to_dict

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import APP_POLICY
from ppmessage.core.constant import PPCOM_WELCOME
from ppmessage.core.constant import DATETIME_FORMAT
from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.core.constant import REDIS_AMD_KEY

from ppmessage.bootstrap.data import BOOTSTRAP_DATA

from ppmessage.core.utils.datetimeencoder import DateTimeEncoder
from ppmessage.api.handlers.ppgetorggroupuserlisthandler import single_user

from ppmessage.api.error import API_ERR

from operator import attrgetter
from operator import itemgetter

import json
import time
import logging
import hashlib
import datetime

class PPComGetDefaultConversationHandler(BaseHandler):
    """
    request:
    app_uuid, 
    user_uuid,

    response:
    json with error_code
    a service user list
    a welcome string, app welcome string or user signature
    app name/group name/user fullname
    a policy name
    """

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        return

    def _return(self, _app_uuid, _user_uuid, _conversation_uuid):
        _redis = self.application.redis
        _conversation = redis_hash_to_dict(_redis, ConversationInfo, _conversation_uuid)
        if _conversation == None:
            logging.error("no such conversation info: %s" % _conversation_uuid)
            return None
        _key = ConversationUserData.__tablename__ + ".app_uuid." + _app_uuid + \
               ".user_uuid." + _user_uuid + ".conversation_uuid." + _conversation_uuid
        _data_uuid = _redis.get(_key)
        if _data_uuid != None:
            _key = ConversationUserData.__tablename__ + ".uuid." + _data_uuid
            _data = _redis.hmget(_key, ["conversation_name", "conversation_icon"])
            _conversation["conversation_name"] = _data[0]
            _conversation["conversation_icon"] = _data[1]
        else:
            logging.error("no conversation data for conversation_uuid: %s" % _conversation_uuid)

        return _conversation

    def _get_users(self, _users):
        if _users == None:
            return None
        _redis = self.application.redis
        _pi = _redis.pipeline()
        _pre = DeviceUser.__tablename__ + ".uuid."
        for _user_uuid in _users:
            _key = _pre + _user_uuid
            _pi.hgetall(_key)
        _unsort = _pi.execute()

        _return_datas = []
        for _user in _unsort:
            if len(_user) == 0:
                continue
            _return_datas.append(_user)
        return _return_datas

    def _sort_users(self, _users):
        _redis = self.application.redis
        for _user in _users:
            _updatetime = datetime.datetime.strptime(_user["updatetime"], DATETIME_FORMAT["extra"])
            _user["updatetime"] = int(time.mktime(_updatetime.timetuple()))
        _sorted = sorted(_users, key=itemgetter("updatetime"), reverse=True)
        _return = []
        for _user in _sorted:
            _return.append(single_user(_redis, _user))        
        return _return
    
    def _get_app_welcome(self, _r):
        _language = BOOTSTRAP_DATA.get("user_language")
        if _language == None:
            _language = "zh_cn"
            
        _welcome = self._app.get("welcome_message")
        if _welcome == None:
            _welcome = PPCOM_WELCOME.get(_language)

        _r["app_name"] = self._app.get("app_name")
        _r["app_welcome"] = _welcome
        return _r
       
    def _user_conversations(self, _app_uuid, _user_uuid):
        _key = ConversationUserData.__tablename__ + \
               ".app_uuid." + _app_uuid + \
               ".user_uuid." + _user_uuid
        _conversations = self.application.redis.smembers(_key)
        return _conversations

    def _conversation_users(self, _conversation):
        _key = ConversationUserData.__tablename__ + ".conversation_uuid." + _conversation.get("uuid")
        return self.application.redis.smembers(_key)
    
    def _latest_conversation(self, _conversations):
        _pi = self.application.redis.pipeline()
        _pre = ConversationInfo.__tablename__ + ".uuid."
        for _conversation in _conversations:
            _key = _pre + _conversation
            _pi.hgetall(_key)
        _unsorted = _pi.execute()
        _sorted = sorted(_unsorted, key=itemgetter("updatetime"), reverse=True)
        return _sorted[0]
    
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        return

    def _Task(self):
        super(PPComGetDefaultConversationHandler, self)._Task()
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        _device_uuid = _request.get("device_uuid")
        
        if _app_uuid == None or _user_uuid == None or _device_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _app = redis_hash_to_dict(self.application.redis, AppInfo, self.app_uuid)
        if _app == None:
            self.setErrorCode(API_ERR.NO_APP)
            return
        self._app = _app
        
        _conversations = self._user_conversations(_app_uuid, _user_uuid)
        # no conversation then queue to AMD create
        # client check uuid field to check
        if _conversations == None or len(_conversations) == 0:
            _value = {"app_uuid": _app_uuid, "user_uuid":_user_uuid, "device_uuid":_device_uuid}
            _value = json.dumps(_value)
            _hash = hashlib.sha1(_value).hexdigest()
            _key = REDIS_AMD_KEY + ".amd_hash." + _hash
            self.application.redis.set(_key, _value)
            self.application.redis.rpush(REDIS_AMD_KEY, _hash)
            _key = REDIS_AMD_KEY + ".app_uuid." + _app_uuid
            self.application.redis.sadd(_key, _hash)
            logging.info("waiting for AMD to allocate service user to create conversation")
            return

        _conversation_uuid = self._latest_conversation(_conversations).get('uuid')
        _conversation = self._return(_app_uuid, _user_uuid, _conversation_uuid)
        if _conversation == None:
            self.setErrorCode(API_ERR.NO_CONVERSATION)
            logging.error("No conversation: %s" % _conversation_uuid)
            return

        _users = self._conversation_users(_conversation)
        if _users == None or len(_users) == 0:
            self.setErrorCode(API_ERR.NO_CONVERSATION_MEMBER)
            logging.error("Existed conversation but no users: %s" % str(_conversation_uuid))
            return
        _users = self._get_users(_users)
        _users = self._sort_users(_users)

        _r = self.getReturnData()
        self._get_app_welcome(_r)
        _r.update(_conversation)
        _r["user_list"] = _users
        return
