# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016.
# @author kun.zhao@ppmessage.com
#
# PPConsole signup
#

from ppmessage.api.handlers.basehandler import BaseHandler

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import USER_STATUS
from ppmessage.core.constant import REDIS_EMAIL_KEY

from ppmessage.api.error import API_ERR

from ppmessage.db.models import DeviceUser

from ppmessage.api.handlers.ppcreateuserhandler import create_user
from ppmessage.api.handlers.ppcreateapphandler import create_app

import datetime
import uuid
import json
import logging

class PPConsoleSignupHandler(BaseHandler):

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE_BEFORE_LOGIN)
        return

    def _send_email(self, _user, _app):
        _subject = "[PPMessage]: signup successfully! - %s" % _app.get("app_name")
        _text = "Dear %s,\n Welcome to PPMessage, enjoy!.\n You do not need confirm this email, but if you lost your password, PPMessage can help you renew password and send password back to here.\n Thanks,\n PPMessage\n" % _user.get("user_fullname")
        _html = "<html><body><p>Dear %s,</p> <br> <p>Welcome to PPMessage, enjoy!</p> <p>PPMessage need not your email confirmation, but when you lost your password, PPMessage can help you renew password and send password back to you using this email.</p> <p>Thanks,</p><p>PPMessage</p></body></html>" % _user.get("user_fullname")
        _request = {
            "to": [_user.get("user_email")],
            "subject": _subject,
            "text": _text,
            "html": _html
        }

        logging.info(_request)
        self.application.redis.rpush(REDIS_EMAIL_KEY, json.dumps(_request))
        return
        
    def _Task(self):
        super(PPConsoleSignupHandler, self)._Task()
        _request = json.loads(self.request.body)
        _user_email = _request.get("user_email")
        _user_fullname = _request.get("user_fullname")
        _user_password = _request.get("user_password")
        _app_uuid = _request.get("app_uuid")
        _app_name = _request.get("app_name")

        logging.info(_request)
        
        if _user_email == None or _user_fullname == None or _app_uuid == None or _app_name == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _key = DeviceUser.__tablename__ + ".user_email." + _user_email
        if self.application.redis.exists(_key):
            self.setErrorCode(API_ERR.EX_USER)
            return
        
        _request.update({"is_service_user": False, "user_status": USER_STATUS.OWNER_2})
        _user_values = create_user(self.application.redis, _request)
        if _user_values == None:
            self.setErrorCode(API_ERR.SYS_ERR)
            return
        _r = self.getReturnData()
        _r["user"] = _user_values

        logging.info(_user_values)
        _app_values = create_app(self, _app_name, _user_values["uuid"], _user_values["user_fullname"])
        _r["app"] = _app_values

        self._send_email(_user_values, _app_values)
        return
    
