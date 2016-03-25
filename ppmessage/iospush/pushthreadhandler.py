# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from ppmessage.core.constant import APNS_TITLE
from ppmessage.core.constant import MESSAGE_TYPE
from ppmessage.core.constant import MESSAGE_SUBTYPE
from ppmessage.bootstrap.data import BOOTSTRAP_DATA

from apnsclient import Message
from apnsmdmclient import get_apns

from .pushtitle import push_title

import logging
import json

class PushThreadHandler():

    def __init__(self, _app):
        self.application = _app

    def _push(self, _app_uuid, _body, _config):
        _apns = get_apns(self.application, _app_uuid)
        if _apns == None:
            logging.error("no apns inited for ios push")
            return

        _title = push_title(_body.get("mt"),
                            _body.get("ms"),
                            _body.get("bo"),
                            _config.get("user_language"))
        _sound = None
        if not _config.get("user_silence_notification"):
            _sound = "beep.wav"
        _count = _config.get("unacked_notification_count")
        _m = Message(_config.get("device_ios_token"),
                     alert=_title,
                     sound=_sound,
                     badge=_count)

        _dev = _config.get("is_development")
        _real_apns = _apns.get("pro")

        if _dev != None and _dev == True:
            _real_apns = _apns.get("dev")
        
        _real_apns.publish_one(_m)
        return

    def task(self, _data):
        _data = json.loads(_data)
        _config = _data.get("config")
        _body = _data.get("body")
        #_app_uuid = _data.get("app_uuid")
        
        # FIXME: so far not support for every team has APN cert
        _app_uuid = BOOTSTRAP_DATA["team"]["app_uuid"]
        
        if _config == None or _body == None:
            logging.error("Illegal ios push: %s." % str(_data))
            return
    
        self._push(_app_uuid, _body, _config)
        return

