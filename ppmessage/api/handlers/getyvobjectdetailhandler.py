# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import OrgGroup
from ppmessage.db.models import DeviceUser

from ppmessage.api.error import API_ERR

from ppmessage.core.constant import YVOBJECT
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.redis import redis_hash_to_dict

import pypinyin
from pypinyin import lazy_pinyin
from pypinyin import pinyin
import base64
import os
import json
import time
import datetime
import itertools
import logging

class GetYVObjectDetailHandler(BaseHandler):

    def _du(self, _request, _rdata):
        if "uuid" not in _request:
            self.setErrorCode(API_ERR.NO_PARA)
            logging.error("Error for no para: %s.", (str(_request)))
            return

        _o = redis_hash_to_dict(self.application.redis, DeviceUser, _request["uuid"])

        if _o is None:
            self.setErrorCode(API_ERR.NO_OBJECT)
            logging.error("Error for no user uuid: %s." % (_request["uuid"]))
            return

        _updatetime = _o.get("updatetime")
        _timestamp = 0
        if "timestamp" in _request:
            _timestamp = _request["timestamp"]

        _u = int(time.mktime(_updatetime.timetuple()))
        if _u > _timestamp:
            _rdata["type"] = YVOBJECT.DU
            _rdata["uuid"] = _o.get("uuid")
            _rdata["email"] = _o.get("user_email")
            _rdata["name"] = _o.get("user_name")
            _rdata["desc"] = None
            _rdata["fullname"] = _o.get("user_fullname")
            _fn = _o.get("user_fullname")
            if not isinstance(_fn, unicode):
                _fn = _fn.decode("utf-8")

            _rdata["pinyinname0"] = "".join(lazy_pinyin(_fn))
            _rdata["pinyinname1"] = "".join(list(itertools.chain.from_iterable(pinyin(_fn, style=pypinyin.INITIALS))))
            _rdata["icon"] = _o.get("user_icon")
            _rdata["timestamp"] = _u
            _rdata["updated"] = True
        else:
            _rdata["updated"] = False
        return

    def _og(self, _request, _rdata):
        if "uuid" not in _request:
            self.setErrorCode(API_ERR.NO_PARA)
            logging.error("Error for no para: %s.", (str(_request)))
            return

        _o = redis_hash_to_dict(
            self.application.redis,
            OrgGroup,
            _request["uuid"]
        )
        if _o is None:
            self.setErrorCode(API_ERR.NO_OBJECT)
            logging.error("Error for no org group uuid: %s." % (_request["uuid"]))
            return

        _timestamp = 0
        if "timestamp" in _request:
            _timestatmp = _request["timestamp"]

        _updatetime = _o.get("updatetime")
        _u = int(time.mktime(_updatetime.timetuple()))
        if _u > _timestamp:
            _rdata["type"] = YVOBJECT.OG
            _rdata["uuid"] = _o.get("uuid")
            _rdata["email"] = ""
            _rdata["desc"] = _o.get("group_desc")
            _rdata["fullname"] = _o.get("group_name")
            
            _fn = _o.get("group_name")
            if not isinstance(_fn, unicode):
                _fn = _fn.decode("utf-8")

            _rdata["pinyinname0"] = "".join(lazy_pinyin(_fn))
            _rdata["pinyinname1"] = "".join(list(itertools.chain.from_iterable(pinyin(_fn, style=pypinyin.INITIALS))))
            _rdata["icon"] = _o.get("group_icon")
            _rdata["timestamp"] = _u
            _rdata["updated"] = True
        else:
            _rdata["updated"] = False
        return

    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(GetYVObjectDetailHandler, self)._Task()
        _request = json.loads(self.request.body)

        #logging.info("GETYVOBJECTDETAIL with " + str(_request))
        if "type" not in _request:
            logging.error("Error for para in request(%s)." % (str(_request)))
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _type_handler = {
            YVOBJECT.OG: self._og,
            YVOBJECT.DU: self._du,
        }

        _type = _request["type"]
        if _type not in _type_handler:
            logging.error("Error for no object for request (%s)." % (str(_request)))
            self.setErrorCode(API_ERR.NO_OBJECT)
            return

        _timestamp = 0
        if "timestamp" in _request:
            _timestamp = _request["timestamp"]

        _rdata = self.getReturnData()
        _type_handler[_type](_request, _rdata)
        #logging.info("GETYVOBJECTDETAIL return " + str(_rdata))


