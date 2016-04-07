# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Jin He, jin.he@ppmessage.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import DeviceUser
from ppmessage.api.error import API_ERR

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.redis import redis_hash_to_dict

import json
import copy
import logging

class PPValidateOnlineDeviceHandler(BaseHandler):

    """
    #### name
    ppvalidateonlinedevicehandler.py

    #### description
    This api validates whether the request device is current online device by comparing
    request device_uuid with request user's mobile_device_uuid (for mobile ppkefu) or
    browser_device_uuid (for browser ppkefu). ppkefu can use this api to decide whether
    it should let current user logout or not.

    #### uri
    PP_VALIDATE_ONLINE_DEVICE

    #### api_level
    > PPKEFU
    > THIRD_PARTY_KEFU

    #### request
    > user_uuid: string
    > device_uuid: string (**this is a device_infos.uuid**)

    #### response
    > valid: boolean
    > error_code: number
    > error_string: string
    > uri: string

    """
    def _validate_online_device(self):
        _user = redis_hash_to_dict(self.application.redis, DeviceUser, self._user_uuid)
        if _user == None:
            self.setErrorCode(API_ERR.NO_USER)
            return

        _device = redis_hash_to_dict(self.application.redis, DeviceInfo, self._device_uuid)
        if _device == None or _device.get("user_uuid") != self._user_uuid:
            self.setErrorCode(API_ERR.NO_DEVICE)
            return

        _return_data = self.getReturnData()
        _device_online = _device.get("device_is_online")
        if _device_online == False:
            _return_data["valid"] = False
            return
        
        # Shall we continue validating if _device_online == True ?
        
        # Since mobile_device_uuid != browser_device_uuid, if neither of them matchs
        # self._device_uuid, the request device ought to be offline.
        _mobile_uuid = _user.get("mobile_device_uuid")
        _browser_uuid = _user.get("browser_device_uuid")
        if self._device_uuid != _mobile_uuid and self._device_uuid != _browser_uuid:
            _return_data["valid"] = False
            return

        _return_data["valid"] = True
        return

    def _validate_request(self):
        _request = json.loads(self.request.body)
        self._device_uuid = _request.get("device_uuid")
        self._user_uuid = _request.get("user_uuid")

        if not isinstance(self._device_uuid, basestring):
            return False
        if not isinstance(self._user_uuid, basestring):
            return False

        return True

    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return
    
    def _Task(self):
        super(PPValidateOnlineDeviceHandler, self)._Task()

        if not self._validate_request():
            self.setErrorCode(API_ERR.NO_PARA)
            return

        self._validate_online_device()
        return
