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
from ppmessage.core.constant import REDIS_ACK_NOTIFICATION_KEY

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
from ppmessage.db.models import OrgUserGroupData
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

    def _pcsocket(self, _device_uuid):
        _key = PCSocketDeviceData.__tablename__ + ".device_uuid." + _device_uuid
        _pcsocket_uuid = self.redis.get(_key)
        if _pcsocket_uuid == None:
            return None
        _pcsocket_dict = redis_hash_to_dict(self.redis, PCSocketInfo, _pcsocket_uuid)
        return _pcsocket_dict
    
    def _ack_error(self, _device_uuid, _code=DIS_ERR.CONVERSATION):
        _body = {
            "device_uuid": _device_uuid,
            "what": DIS_WHAT.CONVERSATION,
            "code": _code,
            "extra": {},
        }
        _pcsocket_dict = self._pcsocket(_device_uuid)
        if _pcsocket_dict == None:
            logging.error("No pcsocket mapped with device_uuid: %s, %s" % (_device_uuid, _body))
            return
        _host = _pcsocket_dict.get("host")
        _port = _pcsocket_dict.get("port")
        _key = REDIS_ACK_NOTIFICATION_KEY + ".host." + _host + ".port." + _port
        self.redis.rpush(_key, json.dumps(_body))
        return

    def _ack_waiting(self, _device_uuid):
        _body = {
            "device_uuid": _device_uuid,
            "what": DIS_WHAT.CONVERSATION,
            "code": DIS_ERR.WAITING,
            "extra": {},
        }
        _pcsocket_dict = self._pcsocket(_device_uuid)
        if _pcsocket_dict == None:
            logging.error("No pcsocket mapped with device_uuid: %s, %s" % (_device_uuid, _body))
            return
        _host = _pcsocket_dict.get("host")
        _port = _pcsocket_dict.get("port")
        _body = {
            "device_uuid": _device_uuid,
            "what": DIS_WHAT.CONVERSATION,
            "code": DIS_ERR.WAITING,
            "extra": {},
        }
        _key = REDIS_ACK_NOTIFICATION_KEY + ".host." + _host + ".port." + _port
        self.redis.rpush(_key, json.dumps(_body))
        return

    def _ack_success(self, _device_uuid, _conversation_uuid):
        _body = {
            "device_uuid": _device_uuid,
            "what": DIS_WHAT.CONVERSATION,
            "code": DIS_ERR.NOERR,
            "extra": {"conversation_uuid": _conversation_uuid},
        }
        _pcsocket_dict = self._pcsocket(_device_uuid)
        if _pcsocket_dict == None:
            logging.error("No pcsocket mapped with device_uuid: %s, %s" % (_device_uuid, _body))
            return
        _host = _pcsocket_dict.get("host")
        _port = _pcsocket_dict.get("port")
        _key = REDIS_ACK_NOTIFICATION_KEY + ".host." + _host + ".port." + _port
        self.redis.rpush(_key, json.dumps(_body))
        return
    
    def _group(self, _app_uuid, _user_uuid, _device_uuid, _group_uuid):
        if _group_uuid == None:
            # find the primary group
            _key = OrgGroup.__tablename__ + ".app_uuid." + _app_uuid + \
                   ".is_distributor.True"
            _group_uuid = self.redis.get(_key)

        if _group_uuid == None:
            logging.error("no distributor group in app: %s" % _app_uuid)
            self._ack_error(_device_uuid, DIS_ERR.CONVERSATION_NO_GROUP)
            return True

        _key = OrgUserGroupData.__tablename__ + ".group_uuid." + _group_uuid
        _users = self.redis.smembers(_key)
        if _users == None or len(_users) == 0:
            logging.error("no service user in group: %s" % _group_uuid)
            self._ack_error(_device_uuid, DIS_ERR.CONVERSATION_NO_USER)
            return True

        _ready_users = []
        for _user in _users:
            _key = DeviceUser.__tablename__ + ".uuid." + _user
            _service_user_status = self.redis.hget(_key, "service_user_status")
            if _service_user_status == SERVICE_USER_STATUS.READY:
                _ready_users.append(_user)

        if len(_ready_users) == 0:
            logging.info("waiting group user ready: %s" % _group_uuid)
            self._ack_waiting(_device_uuid)
            return False

        _allocated_user = random.randint(0, len(_ready_users)-1)
        _allocated_user = list(_users)[_allocated_user]

        _allocated_user_dict = redis_hash_to_dict(self.redis, DeviceUser, _allocated_user)
        _portal_user_dict = redis_hash_to_dict(self.redis, DeviceUser, _user_uuid)
        
        _conversation_uuid = str(uuid.uuid1())
        _row = ConversationInfo(uuid=_conversation_uuid,
                                app_uuid=_app_uuid,
                                group_uuid=_group_uuid,
                                user_uuid=_user_uuid,
                                assigned_uuid=_allocated_user,
                                status=CONVERSATION_STATUS.NEW,
                                conversation_type=CONVERSATION_TYPE.P2S)

        _row.async_add(self.redis)
        _row.create_redis_keys(self.redis)
        
        _row = ConversationUserData(uuid=str(uuid.uuid1()),
                                    app_uuid=_app_uuid,
                                    user_uuid=_user_uuid,
                                    conversation_uuid=_conversation_uuid,
                                    conversation_name=_allocated_user_dict["user_fullname"],
                                    conversation_icon=_allocated_user_dict["user_icon"],
                                    conversation_status=CONVERSATION_STATUS.NEW)
        _row.async_add(self.redis)
        _row.create_redis_keys(self.redis)

        _row = ConversationUserData(uuid=str(uuid.uuid1()),
                                    app_uuid=_app_uuid,
                                    user_uuid=_allocated_user,
                                    conversation_uuid=_conversation_uuid,
                                    conversation_name=_portal_user_dict["user_fullname"],
                                    conversation_icon=_portal_user_dict["user_icon"],
                                    conversation_status=CONVERSATION_STATUS.NEW)
        _row.async_add(self.redis)
        _row.create_redis_keys(self.redis)
        
        self._ack_success(_device_uuid, _conversation_uuid)
        return True

    def _all(self, _app_uuid, _user_uuid, _device_uuid):
        _key = AppUserData.__tablename__ + ".app_uuid." + _app_uuid + \
               ".is_service_user.True"
        _allocated_users = self.redis.smembers(_key)
        if _allocated_users == None or len(_allocated_users) == 0:
            self._ack_error(_device_uuid, DIS_ERR.CONVERSATION_NO_USER)
            return

        _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
        _portal_user_name = self.redis.hget(_key, "user_fullname")
        _portal_user_icon = self.redis.hget(_key, "user_icon")
        
        _group_icon = create_group_icon(self.redis, _allocated_users)
        
        _conversation_uuid = str(uuid.uuid1())
        _row = ConversationInfo(uuid=_conversation_uuid,
                               app_uuid=_app_uuid,
                               user_uuid=_user_uuid,
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
        
        self._ack_success(_device_uuid, _conversation_uuid)
        return


    def _smart(self, _app_uuid, _user_uuid, _device_uuid):
        _key = AppUserData.__tablename__ + ".app_uuid." + _app_uuid + \
               ".is_service_user.True"
        _service_users = self.redis.smembers(_key)
        if _service_users == None or len(_service_users) == 0:
            self._ack_error(_device_uuid, DIS_ERR.CONVERSATION_NO_USER)
            return

        _user_hashs = {}
        for _user in _service_users:
            _user_hashs[_user] = redis_hash_to_dict(self.redis, DeviceUser, _user)
            
        _device_names = ["mobile_device_uuid", "browser_device_uuid"]

        _online_users = []
        for _user in _service_users:
            _user_hash = _user_hashs[_user]
            _online_devices = []
            for _device_name in _device_names:
                _user_device_uuid = _user_hash[_device_name]
                if _user_device_uuid == None or len(_user_device_uuid) == 0:
                    continue
                _key = DeviceInfo.__tablename__ + ".uuid." + _user_device_uuid
                if self.redis.hget(_key, "device_is_online") == "True":
                    _online_devices.append(_user_device_uuid)
            if len(_online_devices) > 0:
                _online_users.append(_user)
                
        if len(_online_users) == 0:
            return self._group(_app_uuid, _user_uuid, _device_uuid)

        _allocated_user = random.randint(0, len(_online_users)-1)
        _allocated_user = _online_users[_allocated_user]

        _key = DeviceUser.__tablename__ + ".uuid." + _allocated_user
        _allocated_user_name = _user_hashs[_allocated_user]["user_fullname"]
        _allocated_user_icon = _user_hashs[_allocated_user]["user_icon"]
        
        _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
        _portal_user_name = self.redis.hget(_key, "user_fullname")
        _portal_user_icon = self.redis.hget(_key, "user_icon")
        
        _conversation_uuid = str(uuid.uuid1())
        _row = ConversationInfo(uuid=_conversation_uuid,
                               app_uuid=_app_uuid,
                               user_uuid=_user_uuid,
                               status=CONVERSATION_STATUS.NEW,
                               conversation_type=CONVERSATION_TYPE.P2S)
        _row.async_add(self.redis)
        _row.create_redis_keys(self.redis)
        
        _row = ConversationUserData(uuid=str(uuid.uuid1()),
                                    app_uuid=_app_uuid,
                                    user_uuid=_user_uuid,
                                    conversation_uuid=_conversation_uuid,
                                    conversation_name=_allocated_user_name,
                                    conversation_icon=_allocated_user_icon,
                                    conversation_status=CONVERSATION_STATUS.NEW)
        _row.async_add(self.redis)
        _row.create_redis_keys(self.redis)

        _row = ConversationUserData(uuid=str(uuid.uuid1()),
                                    app_uuid=_app_uuid,
                                    user_uuid=_allocated_user,
                                    conversation_uuid=_conversation_uuid,
                                    conversation_name=_portal_user_name,
                                    conversation_icon=_portal_user_icon,
                                    conversation_status=CONVERSATION_STATUS.NEW)
        _row.async_add(self.redis)
        _row.create_redis_keys(self.redis)
        
        self._ack_success(_device_uuid, _conversation_uuid)
        return

    def _task(self, _app_uuid, _user_uuid, _device_uuid, _group_uuid):
        _key = AppInfo.__tablename__ + ".uuid." + _app_uuid
        _policy = self.redis.hget(_key, "app_route_policy")
        # when ppkefu user online check status ready add to ready queue
        # when ppkefu user offline check status ready remove ready queue
        # when ppkefu call set ready add user to ready queue
        
        if _policy == APP_POLICY.GROUP:
            #WAITING FOR ONE or NONE
            return self._group(_app_uuid, _user_uuid, _device_uuid, _group_uuid)

        if _policy == APP_POLICY.SMART:
            #ONE or ALL
            self._smart(_app_uuid, _user_uuid, _device_uuid)
            return True

        # Default is broadcast
        #if _policy == APP_POLICY.BROADCAST:
        #ALL
        self._all(_app_uuid, _user_uuid, _device_uuid)
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
            _device_uuid = _request.get("device_uuid")
            _group_uuid = _request.get("group_uuid")
            _continue = self._task(_app_uuid, _user_uuid, _device_uuid, _group_uuid)
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
