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
from ppmessage.core.genericupdate import generic_update

from ppmessage.core.utils.config import get_config_server_generic_store
from ppmessage.core.utils.randomidenticon import upload_random_identicon
from ppmessage.core.utils.randomidenticon import get_random_identicon_url

from ppmessage.core.constant import API_LEVEL

import json
import copy
import hashlib
import logging

class PPUpdateUserHandler(BaseHandler):
    def _update(self):
        _redis = self.application.redis
        _request = json.loads(self.request.body)

        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        _user_icon = _request.get("user_icon")
        
        if _user_uuid == None or _app_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _old_password = _request.get("old_password")
        _user_password = _request.get("user_password")
        if _old_password != None and _user_password != None:
            _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
            _ex_password = _redis.hget(_key, "user_password")
            if _ex_password != _old_password:
                self.setErrorCode(API_ERR.MIS_ERR)
                return

        # remove not table fields
        _data = copy.deepcopy(_request)
        del _data["app_uuid"]
        del _data["user_uuid"]

        if _old_password != None:
            del _data["old_password"]

        if _user_icon != None:
            if _user_icon.startswith("http"):
                IOLoop.spawn_callback(download_random_identicon, _user_icon)
            else:
                _generic_store = get_config_server_generic_store()
                _abs = _generic_store + os.path.sep + _user_icon
                if os.path.exists(_abs):
                    IOLoop.spawn_callback(upload_random_identicon, _abs)
                    _data["user_icon"] = get_random_identicon_url(_user_icon)
            
        if len(_data) > 0:
            _updated = generic_update(_redis, DeviceUser, _user_uuid, _data)
            if not _updated:
                self.setErrorCode(API_ERR.GENERIC_UPDATE)
                return

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
        super(PPUpdateUserHandler, self)._Task()
        self._update()
        return

