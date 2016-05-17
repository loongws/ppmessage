# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import DeviceUser
from ppmessage.db.models import AppUserData
from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL

from ppmessage.core.constant import PPMESSAGE_APP
from ppmessage.core.constant import USER_STATUS

import json
import logging
import uuid

def create_user(_redis, _request):
    '''
    @param _redis
    @param _request a dictionary contains create user's related param
    @return user dict
    '''
    
    _app_uuid = _request.get("app_uuid")
    _user_email = _request.get("user_email")
    _user_status = _request.get("user_status")
    _user_fullname = _request.get("user_fullname")
    _user_language = _request.get("user_language")
    _user_password = _request.get("user_password")
    _is_service_user = _request.get("is_service_user")
    
    if _user_email == None or _app_uuid == None or _user_fullname == None:
        return None

    _key = DeviceUser.__tablename__ + ".user_email." + _user_email
    if _redis.exists(_key):
        return None
        
    if _is_service_user != None:
        _is_portal_user = not _is_service_user
        _is_distributor_user = _is_service_user
    else:
        _is_service_user = False
        _is_portal_user = not _is_service_user
        _is_distributor_user = _is_service_user

    if _user_status == None:
        _user_status = USER_STATUS.THIRDPARTY
                
    _du_uuid = str(uuid.uuid1())
    _values = {
        "uuid": _du_uuid,
        "user_status": _user_status,
        "user_name": _user_email,
        "user_email": _user_email,
        "user_language": _user_language,
        "user_fullname": _user_fullname,
        "user_password": _user_password,
        "is_anonymous_user": False,
    }
    _row = DeviceUser(**_values)
    _row.async_add()
    _row.create_redis_keys(_redis)
    _user_values = _values
    
    _data_uuid = str(uuid.uuid1())
    _values = {
        "uuid": _data_uuid,
        "user_uuid": _du_uuid,
        "app_uuid": _app_uuid,
        "is_portal_user": _is_portal_user,
        "is_service_user": _is_service_user,
        "is_distributor_user": _is_distributor_user,
        "is_owner_user": False,
    }
    _row = AppUserData(**_values)
    _row.async_add()
    _row.create_redis_keys(_redis)
    
    return _user_values

class PPCreateUserHandler(BaseHandler):
    """
    requst:
    header
    require:
    app_uuid/user_email/user_fullname/user_language

    optional:
    is_service_user(False)
        
    response:
    error_code with device user record in ppmessage system

    """
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPCreateUserHandler, self)._Task()
        _request = json.loads(self.request.body)
        
        _app_uuid = _request.get("app_uuid")
        _user_email = _request.get("user_email")
        _user_fullname = _request.get("user_fullname")
        
        if _user_email == None or _app_uuid == None or _user_fullname == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _key = DeviceUser.__tablename__ + ".user_email." + _user_email
        if self.application.redis.exists(_key):
            self.setErrorCode(API_ERR.EX_USER)
            return

        _rdata = create_user(self.application.redis, _request)
        if _rdata == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _r = self.getReturnData()
        _r.update(_rdata)
        return
