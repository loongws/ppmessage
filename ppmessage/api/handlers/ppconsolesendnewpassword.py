# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import DeviceUser
from ppmessage.db.models import AppInfo
from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import REDIS_EMAIL_KEY

import json
import hashlib
import logging
from strgen import StringGenerator

class PPConsoleSendNewPassword(BaseHandler):
    def _send(self, _user_uuid, _user_email, _user_fullname):
        _new_password = StringGenerator("[a-zA-Z0-9_\[\]\{\}\(\)\|\&\$\-]{8}").render()
        _hash_password = hashlib.sha1(_new_password).hexdigest()
        _row = DeviceUser(uuid=_user_uuid, user_password=_hash_password)
        _row.update_redis_keys(self.application.redis)
        _row.async_update(self.application.redis)
        _subject = "[PPMessage]: renew password"
        _text = "Dear %s,\n  Your password has been reset to %s\n Yours Sincerely,\n PPMessage\n" % (_user_fullname, _new_password)
        _html = "<html><body>Dear %s, <br><br> <p> <strong>%s</strong> is your new password. Login <a href='https://ppmessage.com/user/#/app/signup-md/signin'> PPMessage </a> with your new password. </p> <br><br> <p>Yours Sincerely,</p> <p>PPMessage</p></body></html>" % (_user_fullname, _new_password)
        _key = REDIS_EMAIL_KEY
        _request = {
            "to": [_user_email],
            "subject": _subject,
            "text": _text,
            "html": _html
        }
        self.application.redis.rpush(_key, json.dumps(_request))
        return

    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCONSOLE_BEFORE_LOGIN)
        return
    
    def _Task(self):
        super(PPConsoleSendNewPassword, self)._Task()
        _request = json.loads(self.request.body)
        _user_email = _request.get("user_email")
        if _user_email == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _key = DeviceUser.__tablename__ + ".user_email." + _user_email
        if not self.application.redis.exists(_key):
            self.setErrorCode(API_ERR.NO_USER)
            return

        _user_uuid = self.application.redis.get(_key)
        _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
        _user_fullname = self.application.redis.hget(_key, "user_fullname")
        self._send(_user_uuid, _user_email, _user_fullname)
        return

