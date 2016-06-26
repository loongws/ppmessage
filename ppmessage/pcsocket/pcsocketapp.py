# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights are reserved.
#

from .wshandler import WSHandler

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from ppmessage.core.constant import PCSOCKET_SRV

from ppmessage.core.constant import REDIS_TYPING_LISTEN_KEY
from ppmessage.core.constant import REDIS_ONLINE_LISTEN_KEY

from ppmessage.core.constant import REDIS_ACK_NOTIFICATION_KEY
from ppmessage.core.constant import REDIS_PUSH_NOTIFICATION_KEY
from ppmessage.core.constant import REDIS_SEND_NOTIFICATION_KEY
from ppmessage.core.constant import REDIS_TYPING_NOTIFICATION_KEY
from ppmessage.core.constant import REDIS_ONLINE_NOTIFICATION_KEY
from ppmessage.core.constant import REDIS_LOGOUT_NOTIFICATION_KEY

from ppmessage.core.constant import REDIS_PPCOM_ONLINE_KEY

from ppmessage.core.constant import DIS_WHAT
from ppmessage.core.constant import PP_WEB_SERVICE
from ppmessage.core.constant import DATETIME_FORMAT

from ppmessage.core.constant import TIMEOUT_WEBSOCKET_OFFLINE

from ppmessage.core.main import AbstractWebService
from ppmessage.core.singleton import singleton

from ppmessage.core.utils.getipaddress import get_ip_address
from ppmessage.core.utils.datetimestring import now_to_string

from ppmessage.db.models import AppInfo
from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import PCSocketInfo
from ppmessage.db.models import PCSocketDeviceData
from ppmessage.db.models import ConversationUserData
from ppmessage.db.models import DeviceNavigationData

from ppmessage.dispatcher.policy.policy import AbstractPolicy

from .error import DIS_ERR

import tornado.options
from tornado.options import options
from tornado.web import Application
from tornado.ioloop import PeriodicCallback

import datetime
import logging
import redis
import uuid
import time
import json
import copy

def pcsocket_user_online(_redis, _user_uuid, _body):
    _key = REDIS_ONLINE_LISTEN_KEY + ".user_uuid." + _user_uuid
    _listeners = _redis.smembers(_key)
    for _i in _listeners:
        _listener = json.loads(_i)
        _body["device_uuid"] = _listener["device_uuid"]
        _body["createtime"] = datetime.datetime.now().strftime(DATETIME_FORMAT["basic"])
        _key = REDIS_ONLINE_NOTIFICATION_KEY + ".host." + _listener["host"] + ".port." + _listener["port"]
        _redis.rpush(_key, json.dumps(_body))
    return

@singleton
class PCSocketDelegate():
    def __init__(self, app):
        self.app = app
        self.redis = app.redis
        self.sockets = {}
        self.register = {"uuid": None, "host": None, "port": None}
        return
    
    def _remove_device_data_by_pattern(self, _pattern):
        _keys = self.redis.keys(_pattern)
        for _i in _keys:
            _row = PCSocketDeviceData(uuid=self.redis.get(_i))
            _row.delete_redis_keys(self.redis)
            _row.async_delete(self.redis)
        return

    def _remove_device_data_by_uuid(self, _uuid):
        if _uuid == None:
            return
        _row = PCSocketDeviceData(uuid=_uuid)
        _row.delete_redis_keys(self.redis)
        _row.async_delete(self.redis)
        return

    def register_service(self, _port):
        _ip = get_ip_address()
        self.register.update({"host": _ip, "port": _port})
        
        _key = PCSocketInfo.__tablename__ + \
               ".host." + _ip + \
               ".port." + _port
        # existed
        if self.redis.exists(_key):
            _row = PCSocketInfo(uuid=self.redis.get(_key),
                                latest_register_time=datetime.datetime.now())
            _row.update_redis_keys(self.redis)
            _row.async_update(self.redis)
            _key = PCSocketDeviceData.__tablename__ + \
               ".pc_socket_uuid." + _row.uuid + \
               ".device_uuid.*"
            self._remove_device_data_by_pattern(_key)
            self.register["uuid"] = _row.uuid
            return

        # first time run
        _row = PCSocketInfo(uuid=str(uuid.uuid1()),
                            host=_ip,
                            port=_port,
                            latest_register_time=datetime.datetime.now())
        _row.async_add(self.redis)
        _row.create_redis_keys(self.redis)
        self.register["uuid"] = _row.uuid
        return

    def map_device(self, _device_uuid):
        if _device_uuid == None:
            return
        
        _table = PCSocketDeviceData.__tablename__
        
        _key_0 = _table + ".pc_socket_uuid." + self.register["uuid"] + \
               ".device_uuid." + _device_uuid
        _key_1 = _table + ".device_uuid." + _device_uuid
        
        # the same host
        if self.redis.exists(_key_0):
            return

        # not the same host
        _host = self.redis.get(_key_1)
        # still the same, but no key????
        if _host != None and _host == self.register["uuid"]:
            logging.error("should not be here, two keys not consistent")
            return

        # remove the previous
        if _host != None and _host != self.register["uuid"]:
            _key_2 = _table + ".pc_socket_uuid." + _host + ".device_uuid." + _device_uuid
            _data = self.redis.get(_key_2)
            self._remove_device_data_by_uuid(_data)

        # create it
        _row = PCSocketDeviceData(uuid=str(uuid.uuid1()),
                                  pc_socket_uuid=self.register["uuid"],
                                  device_uuid=_device_uuid)
        _row.create_redis_keys(self.redis)
        _row.async_add(self.redis)
        return

    def unmap_device(self, _device_uuid):
        if _device_uuid == None:
            return
        _key = PCSocketDeviceData.__tablename__ + \
               ".pc_socket_uuid." + self.register["uuid"] + \
               ".device_uuid." + _device_uuid
        _data = self.redis.get(_key)
        self._remove_device_data_by_uuid(_data)
        return
    
    def user_typing(self, _user_uuid, _conversation_uuid):
        _key = REDIS_TYPING_LISTEN_KEY + ".user_uuid." + _user_uuid
        _listens = self.redis.smembers(_key)
        for _listen in _listens:
            _listen = json.loads(_listen)
            _body = {
                "typing_user": _user_uuid,
                "listen_device": _listen["device_uuid"],
                "typing_conversation": _conversation_uuid,
                "createtime": datetime.datetime.now().strftime(DATETIME_FORMAT["basic"])
            }
            _key = REDIS_TYPING_NOTIFICATION_KEY + ".host." + _listen["host"] + ".port." + _listen["port"]
            self.redis.rpush(_key, json.dumps(_body))
        return

    def user_online(self, _user_uuid, _body):
        pcsocket_user_online(self.redis, _user_uuid, _body)
        return

    def device_online(self, _device_uuid, _is_online=True):
        _row = DeviceInfo(uuid=_device_uuid, device_is_online=_is_online)
        _row.async_update(self.redis)
        _row.update_redis_keys(self.redis)
        return

    def ppcom_device_online_log(self, _app_uuid, _user_uuid, _device_uuid):
        _key = REDIS_PPCOM_ONLINE_KEY + ".app_uuid." + _app_uuid + ".day." + datetime.datetime.now().strftime("%Y-%m-%d")
        self.redis.sadd(_key, _user_uuid + "." + _device_uuid)
        _key = _key + ".hour." + str(datetime.datetime.now().hour)
        self.redis.sadd(_key, _user_uuid + "." + _device_uuid)
        return

    def _get_service_care_users(self, _app_uuid, _user_uuid):
        _key = AppInfo.__tablename__ + ".uuid." + _app_uuid
        _name = self.redis.hget(_key, "app_policy_name")
        _cls = AbstractPolicy.get_policy_cls_by_name(_name)
        return _cls.get_service_care_users(_app_uuid, _user_uuid, self.redis)

    def _get_portal_care_users(self, _app_uuid, _user_uuid):
        _key = AppInfo.__tablename__ + ".uuid." + _app_uuid
        _name = self.redis.hget(_key, "app_policy_name")
        _cls = AbstractPolicy.get_policy_cls_by_name(_name)
        return _cls.get_portal_care_users(_app_uuid, _user_uuid, self.redis)
    
    def start_watching_online(self, _ws):
        _user_uuid = _ws.user_uuid
        _app_uuid = _ws.app_uuid
        _device_uuid = _ws.device_uuid
        _is_service_user = _ws.is_service_user
        
        if _user_uuid == None or _app_uuid == None or _device_uuid == None:
            logging.error("app uuid or user uuid is None for start watching")
            return

        _users = None
        if _is_service_user == True:
            _users = self._get_service_care_users(_app_uuid, _user_uuid)
        else:
            _users = self._get_portal_care_users(_app_uuid, _user_uuid)

        if _users == None:
            return

        _d = {
            "host": self.register["host"],
            "port": self.register["port"],
            "device_uuid": _device_uuid
        }
        _s = json.dumps(_d)
        for _user_uuid in _users:
            _key = REDIS_ONLINE_LISTEN_KEY + ".user_uuid." + _user_uuid
            self.redis.sadd(_key, _s)

        _ws._watch_online["users"] = _users
        return

    def stop_watching_online(self, _ws):
        _users = _ws._watch_online.get("users")
        if _users == None:
            return
        _device_uuid = _ws.device_uuid
        _d = {
            "host": self.register["host"],
            "port": self.register["port"],
            "device_uuid": _device_uuid
        }
        _s = json.dumps(_d)
        for _user_uuid in _users:
            _key = REDIS_ONLINE_LISTEN_KEY + ".user_uuid." + _user_uuid
            self.redis.srem(_key, _s)
        _ws._watch_online["users"] = None
        return

    def start_watching_typing(self, _ws, _body):
        _conversation_uuid = _body.get("conversation_uuid")
        if _conversation_uuid == None:
            logging.error("conversation not in: %s" % str(_body))
            _ws.send_ack({"code": DIS_ERR.PARAM, "what": DIS_WHAT.TYPING_WATCH})
            return
        _key = ConversationUserData.__tablename__ + \
               ".conversation_uuid." + _conversation_uuid
        _d = {
            "host": self.register["host"],
            "port": self.register["port"],
            "device_uuid": _ws.device_uuid
        }
        _v = json.dumps(_d)
        _users = self.redis.smembers(_key)
        for _user_uuid in _users:
            if _user_uuid == _ws.user_uuid:
                continue
            
            _users.add(_user_uuid)
            _listen_key = REDIS_TYPING_LISTEN_KEY + ".user_uuid." + _user_uuid
            self.redis.sadd(_listen_key, _v)
        _ws._watch_typing["users"] = _users
        _ws._watch_typing["conversation"] = _conversation_uuid
        return

    def stop_watching_typing(self, _ws):
        _users = _ws._watch_typing.get("users")
        if _users == None:
            return
        _d = {
            "host": self.register["host"],
            "port": self.register["port"],
            "device_uuid": _ws.device_uuid
        }
        _v = json.dumps(_d)
        for _user_uuid in _users:
            _listen_key = REDIS_TYPING_LISTEN_KEY + ".user_uuid." + _user_uuid
            self.redis.srem(_listen_key, _v)
        _ws._watch_typing["users"] = None
        _ws._watch_typing["conversation"] = None
        return
    
    def send_send(self, _device_uuid, _body):
        _body["pcsocket"] = {
            "host": self.register["host"],
            "port": self.register["port"],
            "device_uuid": _device_uuid
        }
        _key = REDIS_SEND_NOTIFICATION_KEY
        self.redis.rpush(_key, json.dumps(_body))
        return
    
    def save_extra(self, _app_uuid, _device_uuid, _extra_data):
        if isinstance(_extra_data, dict):
            _extra_data = json.dumps(_extra_data)
            
        _row = DeviceNavigationData(uuid=str(uuid.uuid1()), app_uuid=_app_uuid,
                                    device_uuid=_device_uuid, navigation_data=_extra_data)
        _row.async_add(self.redis)
        _row.create_redis_keys(self.redis)
        return

    def online_loop(self):
        """
        every 1000ms check online notification
        """
        _host = str(self.register.get("host"))
        _port = str(self.register.get("port"))

        key = REDIS_ONLINE_NOTIFICATION_KEY + ".host." + _host + ".port." + _port
        while True:
            noti = self.redis.lpop(key)
            if noti == None:
                # no message
                return
            body = json.loads(noti)
            ws = self.sockets.get(body.get("devcie_uuid"))
            if ws == None:
                logging.error("No WS to handle online body: %s" % body) 
                continue
            ws.send_online(body)
        return

    def typing_loop(self):
        """
        every 1000ms check typing notification
        """

        _host = str(self.register.get("host"))
        _port = str(self.register.get("port"))

        key = REDIS_TYPING_NOTIFICATION_KEY + ".host." + _host + ".port." + _port
        while True:
            noti = self.redis.lpop(key)
            if noti == None:
                # no message
                return
            body = json.loads(noti)
            ws = self.sockets.get(body.get("listen_device"))
            if ws == None:
                logging.error("No WS to handle typing body: %s" % body) 
                continue
            
            user_uuid = body.get("typing_user")
            conversation_uuid = body.get("typing_conversation")
            ws.send_typing(user_uuid, conversation_uuid)

        return
    
    def logout_loop(self):
        """
        every 1000ms check logout notification
        """
        
        _host = str(self.register.get("host"))
        _port = str(self.register.get("port"))

        key = REDIS_LOGOUT_NOTIFICATION_KEY + ".host." + _host + ".port." + _port
        while True:
            noti = self.redis.lpop(key)
            if noti == None:
                # no message
                return
            body = json.loads(noti)
            ws = self.sockets.get(body.get("device_uuid"))
            if ws == None:
                logging.error("No WS to handle logout body: %s" % body) 
                continue
            ws.send_logout(body)
        return
    
    def ack_loop(self):
        """
        every 100ms check ack notification
        """
        _host = str(self.register.get("host"))
        _port = str(self.register.get("port"))
        
        key = REDIS_ACK_NOTIFICATION_KEY + ".host." + _host + ".port." + _port
        while True:
            noti = self.redis.lpop(key)
            if noti == None:
                # no message
                return
            body = json.loads(noti)
            ws = self.sockets.get(body.get("device_uuid"))
            if ws == None:
                logging.error("No WS to handle ack body: %s" % body) 
                continue
            ws.send_ack(body)
        return

    def push_loop(self):
        """
        every 50ms check push notification
        """
        _host = str(self.register.get("host"))
        _port = str(self.register.get("port"))
        
        key = REDIS_PUSH_NOTIFICATION_KEY + ".host." + _host + ".port." + _port
        
        while True:
            noti = self.redis.lpop(key)
            if noti == None:
                return

            body = json.loads(noti)
            logging.info("WS will send: %s" % body)
            pcsocket = body.get("pcsocket") 
            if pcsocket == None:
                logging.error("no pcsocket in push: %s" % (body))
                continue
            device_uuid = pcsocket.get("device_uuid")
            ws = self.sockets.get(device_uuid)
            if ws == None:
                logging.error("No WS handle push: %s" % body)
                continue
            ws.send_msg(body["body"])

        return

    def run_periodic(self):
        tornado.options.parse_command_line()
        self.register_service(str(options.port))

        # set the periodic check online every 1000 ms
        PeriodicCallback(self.online_loop, 1000).start()

        # set the periodic check typing every 1000 ms
        PeriodicCallback(self.typing_loop, 1000).start()

        # set the periodic check logout every 1000 ms
        PeriodicCallback(self.logout_loop, 1000).start()

        # set the periodic check ack every 100 ms
        PeriodicCallback(self.ack_loop, 100).start()

        # set the periodic check push every 50 ms
        PeriodicCallback(self.push_loop, 50).start()
        return

class PCSocketWebService(AbstractWebService):
    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.PCSOCKET

    @classmethod
    def get_handlers(cls):
        return [("/"+PCSOCKET_SRV.WS, WSHandler)]

    @classmethod
    def get_delegate(cls, app):
        return PCSocketDelegate(app)

class PCSocketApp(Application):
    
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        settings = {}
        settings["debug"] = True
        Application.__init__(self, PCSocketWebService.get_handlers(), **settings)
        return

    def get_delegate(self, name):
        return PCSocketDelegate(self)
    

