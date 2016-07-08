# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/amd.py 
# The entry for amd (automatic message distribution)
#

from ppmessage.pcsocket.error import DIS_ERR

from ppmessage.core.constant import DIS_WHAT

from ppmessage.core.constant import APP_POLICY
from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.constant import REDIS_AMD_KEY

from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.core.constant import CONVERSATION_STATUS
from ppmessage.core.constant import SERVICE_USER_STATUS

from ppmessage.core.singleton import singleton
from ppmessage.core.main import AbstractWebService

from ppmessage.db.models import AppInfo
from ppmessage.db.models import OrgGroup
from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import AppUserData
from ppmessage.db.models import PCSocketInfo
from ppmessage.db.models import PCSocketDeviceData
from ppmessage.db.models import OrgGroupUserData
from ppmessage.db.models import ConversationInfo
from ppmessage.db.models import ConversationUserData

from ppmessage.core.utils.createicon import create_group_icon
from ppmessage.core.redis import redis_hash_to_dict

import tornado.log
import tornado.web
import tornado.ioloop
import tornado.options

import uuid
import json
import redis
import random
import logging
import datetime

@singleton
class AmdDelegate():
    def __init__(self, app):
        self.redis = app.redis
        return

    def run_periodic(self):
        # every 2000ms check dispatcher task
        tornado.ioloop.PeriodicCallback(self.task_loop, 2000).start()
        return

    def _apps(self):
        _key = AppInfo.__tablename__
        _uuids = self.redis.smembers(_key)
        return _uuids
    
    def _all(self, _app_uuid, _user_uuid):
        _key = AppUserData.__tablename__ + ".app_uuid." + _app_uuid + ".is_service_user.True"
        _allocated_users = self.redis.smembers(_key)
        if _allocated_users == None or len(_allocated_users) == 0:
            self._ack_error(_device_uuid, DIS_ERR.CONVERSATION_NO_USER)
            return

        _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
        _portal_user_name = self.redis.hget(_key, "user_fullname")
        _portal_user_icon = self.redis.hget(_key, "user_icon")
        
        _group_icon = create_group_icon(self.redis, _allocated_users)

        _assigned_uuid = None
        if len(_allocated_users) == 1:
            _assigned_uuid = list(_allocated_users)[0]
            
        _conversation_uuid = str(uuid.uuid1())
        _row = ConversationInfo(uuid=_conversation_uuid,
                                app_uuid=_app_uuid,
                                user_uuid=_user_uuid,
                                assigned_uuid=_assigned_uuid,
                                status=CONVERSATION_STATUS.NEW,
                                conversation_type=CONVERSATION_TYPE.P2S)
        _row.async_add(self.redis)
        _row.create_redis_keys(self.redis)

        _conversation_name = []
        for _user in _allocated_users:
            _key = DeviceUser.__tablename__ + ".uuid." + _user
            _conversation_name.append(self.redis.hget(_key, "user_fullname"))
        _conversation_name = ",".join(_conversation_name)
        
        _row = ConversationUserData(uuid=str(uuid.uuid1()),
                                    app_uuid=_app_uuid,
                                    user_uuid=_user_uuid,
                                    conversation_uuid=_conversation_uuid,
                                    conversation_name=_conversation_name,
                                    conversation_icon=_group_icon,
                                    conversation_status=CONVERSATION_STATUS.NEW)
        _row.async_add(self.redis)
        _row.create_redis_keys(self.redis)
     
        for _user in _allocated_users:
            _row = ConversationUserData(uuid=str(uuid.uuid1()),
                                        app_uuid=_app_uuid,
                                        user_uuid=_user,
                                        conversation_uuid=_conversation_uuid,
                                        conversation_name=_portal_user_name,
                                        conversation_icon=_portal_user_icon,
                                        conversation_status=CONVERSATION_STATUS.NEW)
            _row.async_add(self.redis)
            _row.create_redis_keys(self.redis)

        return
    
    def _task(self, _app_uuid, _user_uuid):        
        self._all(_app_uuid, _user_uuid)
        return True
        
    def task_loop(self):
        """
        every 2000ms check all app queue
        """
        _hashs = set()

        _len = self.redis.llen(REDIS_AMD_KEY) 
        if _len == 0:
            return

        logging.info("amd queue size: %d" % _len)
        
        while True:
            _hash = self.redis.lpop(REDIS_AMD_KEY)
            if _hash == None or len(_hash) == 0:
                break
            _hashs.add(_hash)
            
        for _hash in _hashs:
            _key = REDIS_AMD_KEY + ".amd_hash." + _hash
            _value = self.redis.get(_key)

            if _value == None or len(_value) == 0:
                continue
            
            _request = json.loads(_value)
            _app_uuid = _request.get("app_uuid")
            _user_uuid = _request.get("user_uuid")
            _continue = self._task(_app_uuid, _user_uuid)
            # _continue True means got allocated or meets error
            # _continue False means need continue waiting
            
            if not _continue:
                self.redis.rpush(REDIS_AMD_KEY, _hash)
            else:
                _key = REDIS_AMD_KEY+".app_uuid."+_app_uuid
                if self.redis.exists(_key):
                    self.redis.srem(_key, _hash)
                self.redis.delete(_key)
                
        return

class AmdWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.AMD

    @classmethod
    def get_handlers(cls):
        return []

    @classmethod
    def get_delegate(cls, app):
        return AmdDelegate(app)

class AmdApp(tornado.web.Application):
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        tornado.web.Application.__init__(self, [], **{"debug":True})
        return

    def get_delegate(self, name):
        return AmdDelegate(self)
    
def _main():
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')
    tornado.options.parse_command_line()
    _app = AmdApp()
    _delegate = _app.get_delegate("").run_periodic()
    
    logging.info("Starting amd service......")
    tornado.ioloop.IOLoop.instance().start()
    return
    
if __name__ == "__main__":
    _main()
