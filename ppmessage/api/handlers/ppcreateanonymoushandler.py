# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import AppUserData

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import USER_NAME
from ppmessage.core.constant import USER_STATUS

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.core.utils.config import _get_config
from ppmessage.core.utils.randomidenticon import random_identicon
#from ppmessage.core.utils.createicon import create_user_icon

import json
import uuid
import logging

from tornado.gen import coroutine
from tornado.ioloop import IOLoop
from tornado.httpclient import HTTPRequest
from tornado.httpclient import AsyncHTTPClient

class PPCreateAnonymousHandler(BaseHandler):

    def _unknown_user_name(self):
        _language = "en"
        _locale_string = USER_NAME["en"]
        if _get_config().get("server").get("language").get("locale").lower() == "zh_cn":
            _locale_string = USER_NAME["cn"]
        return _locale_string.get("unknown") + "." + _locale_string.get("user")

    @coroutine
    def _create_user_name(self, user_uuid=None, data_uuid=None, ip=None):
        logging.info("create anonymous user_uuid: %s, ip: %s" % (user_uuid, ip))
        if user_uuid == None or ip == None or data_uuid == None:
            return
        
        url = "http://123.57.154.168:8099/IP2GEO/"
        http_headers = {"Content-Type" : "application/json"}
        
        http_body = {
            "ip": ip,
            "language": _get_config().get("server").get("language").get("locale"),
            "team_uuid": _get_config().get("team").get("app_uuid"),
            "team_name": _get_config().get("team").get("name")
        }
        
        http_request = HTTPRequest(
            url, method='POST',
            headers=http_headers,
            validate_cert=False,
            body=json.dumps(http_body)
        )

        http_client = AsyncHTTPClient()
        response = yield http_client.fetch(http_request)

        logging.info("geoservice return: %s" % response.body)
        _body = json.loads(response.body)
        
        if _body == None or _body.get("error_code") != 0:
            logging.error("cant get user name by ip: %s" % ip)
            return
        
        _country = _body.get("country")
        _state = _body.get("state")
        _city = _body.get("city")
        _location_user = []
            
        if _country != None and len(_country) != 0:
            _location_user.append(_country)

        if _state != None and len(_state) != 0:
            _location_user.append(_state)

        if _city != None and len(_city) != 0:
            _location_user.append(_city)

        if len(_location_user) == 0:
            return
        
        _user_name = ".".join(_location_user)
        _row = DeviceUser(uuid=user_uuid, user_name=_user_name, user_fullname=_user_name)
        _row.update_redis_keys(self.application.redis)
        _row.async_update(self.application.redis)

        _row = AppUserData(uuid=data_uuid, user_fullname=_user_name)
        _row.update_redis_keys(self.application.redis)
        _row.async_update(self.application.redis)

        return

    def _create(self, _ppcom_trace_uuid):
        _redis = self.application.redis
        _key = DeviceUser.__tablename__ + ".ppcom_trace_uuid." + _ppcom_trace_uuid
        _uuid = _redis.get(_key)

        if _uuid != None:
            _user = redis_hash_to_dict(_redis, DeviceUser, _uuid)
            if _user != None:
                _rdata = self.getReturnData()
                _rdata["user_uuid"] = _uuid
                _rdata["user_email"] = _user["user_email"]
                _rdata["user_fullname"] = _user["user_fullname"]
                _rdata["user_icon"] = _user["user_icon"]
                _rdata["user_status"] = _user.get("user_status")
                return
        
        _du_uuid = str(uuid.uuid1())
        _user_email = _du_uuid[:6] + "@" + self.app_uuid[:6]
        _user_name = self._unknown_user_name()
        
        _values = {
            "uuid": _du_uuid,
            "ppcom_trace_uuid": _ppcom_trace_uuid,
            "user_status": USER_STATUS.ANONYMOUS,
            "is_anonymous_user": True,
            "user_name": _user_name,
            "user_email": _user_email,
            "user_fullname": _user_name,
            #"user_icon": create_user_icon(_du_uuid),
            "user_icon": random_identicon(_du_uuid)
        }
        
        _row = DeviceUser(**_values)
        _row.async_add(self.application.redis)
        _row.create_redis_keys(self.application.redis)

        _data_uuid = str(uuid.uuid1())
        _values = {
            "uuid": _data_uuid,
            "user_uuid": _du_uuid,
            "user_fullname": _user_name,
            "app_uuid": self.app_uuid,
            "is_portal_user": True,
            "is_service_user": False,
            "is_owner_user": False
        }
        _row = AppUserData(**_values)
        _row.async_add(self.application.redis)
        _row.create_redis_keys(self.application.redis)
        
        _rdata = self.getReturnData()
        _rdata["user_uuid"] = _du_uuid
        _rdata["user_fullname"] = _user_name
        _rdata["user_email"] = _user_email
        _rdata["user_name"] = _user_name

        _ip = self.request.headers.get("X-Real-Ip") or self.request.headers.get("remote_ip") or self.request.remote_ip
        logging.info(str(self.request.headers))
        logging.info("create anonymous ip: %s" % _ip)
        IOLoop.current().spawn_callback(self._create_user_name, user_uuid=_du_uuid, data_uuid=_data_uuid, ip=_ip)
        return
    
    
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        return

    def _Task(self):
        super(PPCreateAnonymousHandler, self)._Task()
        _request = json.loads(self.request.body)
        _ppcom_trace_uuid = _request.get("ppcom_trace_uuid")
        if _ppcom_trace_uuid == None:
            logging.error("no ppcom trace id provided.")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._create(_ppcom_trace_uuid)
        return

