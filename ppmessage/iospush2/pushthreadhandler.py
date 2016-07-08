# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# iospush2/pushthreadhandler.py
#

from ppmessage.core.constant import APNS_TITLE
from ppmessage.core.constant import MESSAGE_TYPE
from ppmessage.core.constant import MESSAGE_SUBTYPE
from ppmessage.core.utils.pushtitle import push_title

import json
import logging

class PushThreadHandler():

    def __init__(self):
        pass
        
    def _push(self, _apns, _body, _user_config):
        _ios_token = _user_config.get("device_ios_token")
        if _ios_token == None or len(_ios_token) == 0:
            return

        _user_language = _user_config.get("user_language") or "en_US"
        
        _title = push_title(_body.get("mt"), _body.get("ms"), _body.get("bo"), _user_language)

        _sound = None
        if not _user_config.get("user_silence_notification"):
            _sound = "beep.wav"

        _count = _user_config.get("unacked_notification_count")
        _m = {"alert": _title, "sound": _sound, "badge": _count}

        from apns2.client import APNsClient
        from apns2.payload import Payload

        _dev = _user_config.get("is_development")
        _client = APNsClient(_apns.get("combination_pem"), use_sandbox=False, use_alternative_port=False)
        if _dev != None and _dev == True:
            _client = APNsClient(_apns.get("combination_pem"), use_sandbox=True, use_alternative_port=False)

        _payload = Payload(**_m)
        _client.send_notification(_ios_token, _payload)
        return

    def task(self, _apns, _data):
        _config = _data.get("config")
        _body = _data.get("body")
                
        if _config == None or _body == None:
            logging.error("Illegal ios push: %s." % str(_data))
            return
    
        self._push(_apns, _body, _config)
        return

