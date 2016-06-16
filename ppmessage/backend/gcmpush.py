# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/gcmpush.py 
# The entry form gcmpush service
#

from ppmessage.iospush.pushtitle import push_title
from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import REDIS_GCMPUSH_KEY
from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.singleton import singleton
from ppmessage.core.main import AbstractWebService

from gcm import GCM

import tornado.ioloop
import tornado.options
import tornado.httpserver

import sys
import json
import redis
import logging
import datetime

class GcmPushHandler():
    def __init__(self, _app):
        self.application = _app
        return
    
    def _one(self, _token, _msg):
        if self.application.gcm == None:
            logging.error("no gcm")
            return
        self.application.gcm.plaintext_request(registration_id=_token, collapse_key='ppmessage', data=_msg)
        return
    
    def _push(self, _app_uuid, _body, _config):
        _type = _body.get("mt")
        _subtype = _body.get("ms")
        _count = _config.get("unacked_notification_count")
        _title = push_title(_type, _subtype, _body.get("bo"), _config.get("user_language"))
        _token = _config.get("android_gcm_token")
        _sound = None
        if not _config.get("user_silence_notification"):
            _sound = "beep.wav"
        _msg = {"title": _title, "sound": _sound, "count": _count}
        self._one(_token, _msg)
        return

    def task(self, _data):
        _config = _data.get("config")
        _body = _data.get("body")
        _app_uuid = _data.get("app_uuid")
        if _config == None or \
           _body == None or \
           _app_uuid == None:
            logging.error("Illegal request: %s." % str(_data))
            return
        self._push(_app_uuid, _body, _config)
        return

@singleton
class GcmPushDelegate():
    def __init__(self, app):
        _config = {
            "api_key": "AIzaSyArXf60KTz2KwROtzAlQDJozAskFAdvzBE",
            "sender_id": "878558045932"
        }
        _api_key = _config.get("api_key")
        self.gcm = GCM(_api_key)
        self.redis = app.redis
        self.push_handler = GcmPushHandler(self)
        return
        
    def outdate(self):
        _delta = datetime.timedelta(seconds=30)
        if self.gcm == None:
            logging.error("no gcm inited.")
            return
        # self.gcm.outdate(_delta)
        return

    def push(self):
        while True:
            _request = self.redis.lpop(REDIS_GCMPUSH_KEY)
            if _request == None or len(_request) == 0:
                return
            _request = json.loads(_request)
            self.push_handler.task(_request)
        return

    def run_periodic(self):
        tornado.ioloop.PeriodicCallback(self.outdate, 1000*30).start()
        tornado.ioloop.PeriodicCallback(self.push, 1000).start()
        return

class GcmPushWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.GCMPUSH

    @classmethod
    def get_handlers(cls):
        return []

    @classmethod
    def get_delegate(cls, app):
        return GcmPushDelegate(app)

class GcmPushApp():
    def __init__(self, *args, **kwargs):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        return

    def get_delegate(self, name):
        return GcmPushDelegate(self)
        
def _main():
    tornado.options.parse_command_line()

    _config = BOOTSTRAP_CONFIG.get("gcm")
    _api_key = _config.get("api_key")
    if _api_key == None or len(_api_key) == 0:
        logging.info("No gcm api_key config, gcmpush should not start.")
        sys.exit()
    
    _app = GcmPushApp()
    _app.get_delegate("").run_periodic()
    logging.info("Starting gcmpush service......")
    # set the periodic check outdated connection
    tornado.ioloop.IOLoop.instance().start()

    return

if __name__ == "__main__":
    _main()
    
