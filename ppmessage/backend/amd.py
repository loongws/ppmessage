# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com.
# All rights reserved.
#
# backend/amd.py 
# The entry for amd (automatic message distribution)
#

from ppmessage.pcsocket.error import DIS_ERR

from ppmessage.core.constant import DIS_WHAT

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from ppmessage.core.constant import RULE_STATUS

from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.constant import REDIS_AMD_KEY

from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.core.constant import CONVERSATION_STATUS
from ppmessage.core.constant import SERVICE_USER_STATUS

from ppmessage.core.constant import CHECK_AMD_INTERVAL

from ppmessage.core.constant import DISTRIBUTE_RESULT

from ppmessage.core.singleton import singleton
from ppmessage.core.main import AbstractWebService

from ppmessage.db.models import AppInfo
from ppmessage.db.models import OrgGroup
from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import AppUserData
from ppmessage.db.models import PCSocketInfo
from ppmessage.db.models import PCSocketDeviceData
from ppmessage.db.models import OrgGroupUserData
from ppmessage.db.models import ConversationInfo
from ppmessage.db.models import ConversationUserData
from ppmessage.db.models import ConversationAssignRule
from ppmessage.db.models import UserNavigationData

from ppmessage.core.utils.createicon import create_group_icon
from ppmessage.core.redis import redis_hash_to_dict

import tornado.log
import tornado.web
import tornado.ioloop
import tornado.options

import uuid
import json
import redis
import random
import logging
import datetime

@singleton
class AmdDelegate():
    def __init__(self, app):
        self.redis = app.redis
        return

    def run_periodic(self):
        tornado.ioloop.PeriodicCallback(self.task_loop, CHECK_AMD_INTERVAL).start()
        return

    def get_user_matched_method(self):
        _method = [{
            "name": "USER_MATCHED_ANY_USER_NAME_TAG",
            "desc": "USER_MATCHED_ANY_USER_DESC_TAG",
            "method_name": "user_matched_any_user",
            "method": self._user_matched_any_user,
            "parameter": None
        }, {
            "name": "USER_MATCHED_VISIT_PAGE_NAME_TAG",
            "desc": "USER_MATCHED_VISIT_PAGE_DESC_TAG",
            "method_name": "user_matched_visit_page",
            "method": self._user_matched_visit_page,
            "parameter": {
                "mame": "VISIT_PAGE_URL_TAG",
                "key": "visit_page_url"
            },
        }]
        return _method

    def get_target_service_method(self):
        _method = [{
            "name": "TARGET_SERVICE_ALL_USER_OF_TEAM_NAME_TAG",
            "desc": "TARGET_SERVICE_ALL_USER_OF_TEAM_DESC_TAG",
            "method_name": "target_service_all",
            "method": self._target_service_all,
            "parameter": None
        }, {
            "name": "TARGET_SERVICE_ONE_USER_OF_TEAM_NAME_TAG",
            "desc": "TARGET_SERVICE_ONE_USER_OF_TEAM_DESC_TAG",
            "method_name": "target_service_one",
            "method": self._target_service_one,
            "parameter": None
        }, {
            "name": "TARGET_SERVICE_ALL_ONLINE_USER_OF_TEAM_NAME_TAG",
            "desc": "TARGET_SERVICE_ALL_ONLINE_USER_OF_TEAM_DESC_TAG",
            "method_name": "target_service_all_online",
            "method": self._target_service_all_online,
            "parameter": None
        }, {
            "name": "TARGET_SERVICE_ONE_ONLINE_USER_OF_TEAM_NAME_TAG",
            "desc": "TARGET_SERVICE_ONE_ONLINE_USER_OF_TEAM_DESC_TAG",
            "method_name": "target_service_one_online",
            "method": self._target_service_one_online,
            "parameter": None
        }, {
            "name": "TARGET_SERVICE_ALL_USER_OF_GROUP_NAME_TAG",
            "desc": "TARGET_SERVICE_ALL_USER_OF_GROUP_DESC_TAG",
            "method_name": "target_service_all_user_of_group",
            "method": self._target_service_all_user_of_group,
            "parameter": {
                "name": "TARGET_SERVICE_GROUP_UUID_TAG",
                "key": "group_uuid"
            }
        }, {
            "name": "TARGET_SERVICE_ONE_USER_OF_GROUP_NAME_TAG",
            "desc": "TARGET_SERVICE_ONE_USER_OF_GROUP_DESC_TAG",
            "method_name": "target_service_one_user_of_group",
            "method": self._target_service_one_user_of_group,
            "parameter": {
                "name": "TARGET_SERVICE_GROUP_UUID_TAG",
                "key": "group_uuid"
            }
        }, {
            "name": "TARGET_SERVICE_ALL_ONLINE_USER_OF_GROUP_NAME_TAG",
            "desc": "TARGET_SERVICE_ALL_ONLINE_USER_OF_GROUP_DESC_TAG",
            "method_name": "target_service_all_online_user_of_group",
            "method": self._target_service_all_online_user_of_group,
            "parameter": {
                "name": "TARGET_SERVICE_GROUP_UUID_TAG",
                "key": "group_uuid"
            }
        }, {
            "name": "TARGET_SERVICE_ONE_ONLINE_USER_OF_GROUP_NAME_TAG",
            "desc": "TARGET_SERVICE_ONE_ONLINE_USER_OF_GROUP_DESC_TAG",
            "method_name": "target_service_one_online_user_of_group",
            "method": self._target_service_one_online_user_of_group,
            "parameter": {
                "name": "TARGET_SERVICE_GROUP_UUID_TAG",
                "key": "group_uuid"
            }
        }]
        return _method

    def _user_matched_method(self, _method_name):
        _methods = self.get_user_matched_method()
        for _method in _methods:
            if _method.get("method_name") == _method_name:
                return _method
        return None

    def _target_service_method(self, _method_name):
        _methods = self.get_target_service_method()
        for _method in _methods:
            if _method.get("method_name") == _method_name:
                return _method
        return None
    
    def _user_matched_any_user(self, _request, _rule):
        return True

    def _user_matched_visit_page(self, _request, _rule):
        _param = _rule.get("matched_method_parameter")
        if _param == None:
            return False

        _url = _param.get("visit_page_url")
        if _url == None:
            return False

        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")

        _key = UserNavigationData.__tablename__ + ".app_uuid." + _app_uuid + ".user_uuid." + _user_uuid + ".visit_page_url"

        import re
        if re.match(_url, self.redis.get(_key)) != None:
            return True
        
        return False

    def _target_service_all(self, _request, _rule):
        return self._all(_request)

    def _target_service_one(self, _request, _rule):
        return self._one(_request)

    def _target_service_all_online(self, _request, _rule):
        return self._all_online(_request)

    def _target_service_one_online(self, _request, _rule):
        return self._one_online(_request)
    
    def _target_service_all_user_of_group(self, _request, _rule):
        _group_uuid = _rule.get("target_service_paramter").get("group_uuid")
        return self._all_of_group(_request, _group_uuid)

    def _target_service_one_user_of_group(self, _request, _rule):
        _group_uuid = _rule.get("target_service_paramter").get("group_uuid")
        return self._one_of_group(_request, _group_uuid)

    def _target_service_all_online_user_of_group(self, _request, _rule):
        _group_uuid = _rule.get("target_service_paramter").get("group_uuid")
        return self._all_online_of_group(_request, _group_uuid)

    def _target_service_one_online_user_of_group(self, _request, _rule):
        _group_uuid = _rule.get("target_service_paramter").get("group_uuid")
        return self._one_online_of_group(_request, _group_uuid)

    def _all_online_of_group(self, _request, _group_uuid):
        return

    def _one_online_of_group(self, _request, _group_uuid):
        return
    
    def _one_of_group(self, _request, _group_uuid):
        return
    
    def _all_of_group(self, _request, _group_uuid):
        return
    
    def _one_online(self, _request):
        return
    
    def _all_online(self, _request):
        return
    
    def _one(self, _request):
        _all = self._all(_request)
        if _all == None:
            return None
        return [_all[random.randint(0, len(_all)-1)]]
    
    def _all(self, _request):
        _app_uuid = _request.get("app_uuid")
        _key = AppUserData.__tablename__ + ".app_uuid." + _app_uuid + ".is_service_user.True"
        _users = self.redis.smembers(_key)
        if _users == None or len(_users) == 0:
            return None
        return list(_users)

    def _user_matched(self, _request, _rule):
        _method_name = _rule.get("user_matched_method")
        if _method_name == None:
            return False
        _method = self._user_matched_method(_method_name)
        if _method == None:
            return False
        return _method.method(_request, _rule)

    def _target_service(self, _request, _rule):
        _method_name = _rule.get("target_service_method")
        if _method_name == None:
            return None
        _method = self._target_service_method(_method_name)
        if _method == None:
            return None
        return _method.method(_request, _rule)

    def _create_conversation(self, _request, _rule, _target_services):
        _rule_uuid = None
        if _rule != None:
            _rule_uuid = _rule.get("uuid")
        
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        
        _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
        _portal_user_name = self.redis.hget(_key, "user_fullname")
        _portal_user_icon = self.redis.hget(_key, "user_icon")
        
        _group_icon = create_group_icon(self.redis, _target_services)

        _assigned_uuid = None
        if len(_target_services) == 1:
            _assigned_uuid = _target_services[0]
            
        _conversation_uuid = str(uuid.uuid1())
        _row = ConversationInfo(uuid=_conversation_uuid,
                                app_uuid=_app_uuid,
                                user_uuid=_user_uuid,
                                assigned_uuid=_assigned_uuid,
                                rule_uuid=_rule_uuid,
                                status=CONVERSATION_STATUS.NEW,
                                conversation_type=CONVERSATION_TYPE.P2S)
        
        _row.async_add(self.redis)
        _row.create_redis_keys(self.redis)

        _conversation_name = []
        for _user in _target_services:
            _key = DeviceUser.__tablename__ + ".uuid." + _user
            _conversation_name.append(self.redis.hget(_key, "user_fullname"))
        _conversation_name = ",".join(_conversation_name)
        
        _row = ConversationUserData(uuid=str(uuid.uuid1()),
                                    app_uuid=_app_uuid,
                                    user_uuid=_user_uuid,
                                    conversation_uuid=_conversation_uuid,
                                    conversation_name=_conversation_name,
                                    conversation_icon=_group_icon,
                                    conversation_status=CONVERSATION_STATUS.NEW)
        _row.async_add(self.redis)
        _row.create_redis_keys(self.redis)
     
        for _user in _target_services:
            _row = ConversationUserData(uuid=str(uuid.uuid1()),
                                        app_uuid=_app_uuid,
                                        user_uuid=_user,
                                        conversation_uuid=_conversation_uuid,
                                        conversation_name=_portal_user_name,
                                        conversation_icon=_portal_user_icon,
                                        conversation_status=CONVERSATION_STATUS.NEW)
            _row.async_add(self.redis)
            _row.create_redis_keys(self.redis)

        return
    
    def _run_rule(self, _request, _rule):
        _matched = self._user_matched(_request, _rule)
        if not _matched:
            return DISTRIBUTE_RESULT.USER_NOT_MATCHED
        _target_services = self._target_service(_request, _rule)
        if _target_services == None or len(_target_services) == 0:
            return DISTRIBUTE_RESULT.NO_TARGET_SERVICE
        self._create_conversation(_request, _rule, _target_services)
        return DISTRIBUTE_RESULT.SUCCESS
    
    def _rules_dict(self, _rules):
        _dicts = []
        for _rule in _rules:
            _key = ConversationAssignRule.__tablename__ + ".uuid." + _rule
            _rule_dict = self.redis.hgetall(_key)
            if _rule_dict == None:
                continue
            if _rule_dict.get("rule_status") != RULE_STATUS.LIVE:
                continue
            _dicts.append(_rule_dict)
        return _dicts
    
    def _task(self, _request):
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        
        _key = ConversationAssignRule.__tablename__ + ".app_uuid." + _app_uuid
        _rules = self.redis.zrange(_key, 0, -1)
        _rules = self._rules_dict(_rules)
        
        if len(_rules) == 0:
            self._create_conversation(_request, None, self._all(_request))
            return DISTRIBUTE_RESULT.SUCCESS
        
        for _rule in _rules:
            _result = self._run_rule(_request, _rule)

            if _result == DISTRIBUTE_RESULT.USER_NOT_MATCHED:
                continue

            if _result == DISTRIBUTE_RESULT.NO_TARGET_SERVICE:
                return DISTRIBUTE_RESULT.WAITING

            if _result == DISTRIBUTE_RESULT.SUCCESS:
                return  _result
            
        return DISTRIBUTE_RESULT.ERROR

    def _result(self, _user_uuid, _result=None, _position=None):
        _key = REDIS_AMD_KEY + ".user_uuid." + _user_uuid

        _status = self.redis.get(_key)
        if _status != None and len(_status) > 0:
            _status = json.loads(_status)
        else:
            _status = {}
            
        if _result == None:
            _result = DISTRIBUTE_RESULT.WAITING
        _status.update({"result": _result})
        
        if _position != None:
            _status.update({"position": _position})
            
        self.redis.set(_key, json.dumps(_status))
        return
        
    def task_loop(self):
        _hashs = []

        if 0 == self.redis.llen(REDIS_AMD_KEY):
            return
        
        while True:
            _hash = self.redis.lpop(REDIS_AMD_KEY)
            if _hash == None or len(_hash) == 0:
                break
            _hashs.append(_hash)

        _waitings = []
        _len = len(_hashs)

        for _i in range(_len):
            _hash = _hashs[_i]
            _key = REDIS_AMD_KEY + ".amd_hash." + _hash
            _value = self.redis.get(_key)

            if _value == None or len(_value) == 0:
                continue

            _request = json.loads(_value)
            _user_uuid = _request.get("user_uuid")
            _app_uuid = _request.get("app_uuid")
            if _user_uuid == None or _app_uuid == None:
                continue
            
            self._result(_user_uuid)
            
            _distribute_result = self._task(_request)
            self._result(_user_uuid, _distribute_result)
            
            if _distribute_result == DISTRIBUTE_RESULT.WAITING:
                _waitings.append(_hash)
                self._result(_user_uuid, _distribute_result, len(_waitings))
            else:
                _key = REDIS_AMD_KEY+".app_uuid."+_app_uuid
                if self.redis.exists(_key):
                    self.redis.srem(_key, _hash)
                self.redis.delete(_key)

                _key = REDIS_AMD_KEY + ".amd_hash." + _hash
                self.redis.delete(_key)

        if len(_waitings) == 0:
            return

        # reverse waitings
        _waitings = _waitings[::-1]
        
        for _waiting in _waitings:
            self.redis.lpush(REDIS_AMD_KEY, _waiting)
        return

class AmdWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.AMD

    @classmethod
    def get_handlers(cls):
        return []

    @classmethod
    def get_delegate(cls, app):
        return AmdDelegate(app)

class AmdApp(tornado.web.Application):
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        tornado.web.Application.__init__(self, [], **{"debug":True})
        return

    def get_delegate(self, name):
        return AmdDelegate(self)
    
def _main():
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')
    tornado.options.parse_command_line()
    _app = AmdApp()
    _delegate = _app.get_delegate("").run_periodic()
    
    logging.info("Starting amd service......")
    tornado.ioloop.IOLoop.instance().start()
    return
    
if __name__ == "__main__":
    _main()
