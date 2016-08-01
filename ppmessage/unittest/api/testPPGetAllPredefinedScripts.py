# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2015 YVertical.
# Ding Guijin, guijin.ding@yvertical.com
#

from testConfig import config
from testConfig import get_api_url
from testConfig import get_token_url

from ppmessage.db.models import DeviceUser
from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.core.utils.config import _get_config

import uuid
import json
import redis
import hashlib
import logging
import unittest
import traceback

import tornado.httpclient

class TestApiCase(unittest.TestCase):

    def setUp(self):
        self._redis = redis.Redis(db=1)
        self._access_token = self._get_access_token()
        if self._access_token is None:
            raise ValueError, "token is None"
        return

    def tearDown(self):
        pass

    def _get_return(self, _name):
        if self._return_data == None:
            return None
        #print self._return_data
        return self._return_data.get(_name)
    
    def _create_body_string(self, params):
        body = ""
        for param in params:
            body += "&" + param + "=" + str(params[param])
        return body.lstrip("&")

    def _get_access_token(self):
        TOKEN_URI = get_token_url()
        body = self._create_body_string({
            "grant_type": "client_credentials",
            "client_id": _get_config().get("api").get("ppcom").get("key"),
            "client_secret": _get_config().get("api").get("ppcom").get("secret")
        })
        request = tornado.httpclient.HTTPRequest(TOKEN_URI, method="POST", body=body)
        client = tornado.httpclient.HTTPClient()
        response = client.fetch(request)
        res_body = json.loads(response.body)
        return res_body.get("access_token")
    
    def _prepare(self, _cmd):
        self._headers = {
            "Content-Type": "application/json",
            "Authorization": "OAuth " + self._access_token
        }
        self._url = get_api_url() + "/" + _cmd
        return
    
    def _exec(self, _data):
        http_client = tornado.httpclient.HTTPClient()
        try:
            response = http_client.fetch(self._url,
                                         method="POST",
                                         headers=self._headers,
                                         body=json.dumps(_data))
            _r = json.loads(response.body)
            self._return_data = None
            if _r["error_code"] == 0:
                self._return_data = _r
            else:
                print _r
            self.assertEqual(_r["error_code"], 0)
            
        except tornado.httpclient.HTTPError as e:
            self.assertEqual(1, 0)
        finally:
            http_client.close()
        return
                                    
    def test_create_predefined_script(self):
        print "\n test create predefined script \n"
        _api = "PP_ADD_PREDEFINED_SCRIPT_GROUP"
        _data = {
            "group_name": str(uuid.uuid1),
            "app_uuid": _get_config().get("team").get("app_uuid")
        }
        self._prepare(_api)
        self._exec(_data)
        _group_uuid = self._get_return("uuid")

        _api = "PPCOM_CREATE_CONVERSATION"
        _data = {
            "user_uuid": _user_uuid,
            "conversation_type": CONVERSATION_TYPE.P2S,
            "app_uuid": _get_config().get("team").get("app_uuid")
        }
        self._prepare(_api)
        self._exec(_data)
        _conversation_uuid = self._get_return("uuid")

        for item in self._return_data:
            print item, "\t", self._return_data[item]
        print "\n"

        # from the view of portal_user(the creator)
        _api = "PP_GET_CONVERSATION_INFO"
        _data = {
            "user_uuid": _user_uuid,
            "conversation_uuid": _conversation_uuid,
            "app_uuid": _get_config().get("team").get("app_uuid")
        }
        self._prepare(_api)
        self._exec(_data)
        
        print "This is how it looks like when a portal user get this p2s conversation \n"
        for item in self._return_data:
            print item, "\t", self._return_data[item]

        # from the view of a service user
        _api = "PP_GET_CONVERSATION_INFO"
        _data = {
            "user_uuid": _get_config().get("user").get("user_uuid"),
            "conversation_uuid": _conversation_uuid,
            "app_uuid": _get_config().get("team").get("app_uuid")
        }
        self._prepare(_api)
        self._exec(_data)
        
        print "This is how it looks like when a service user get this p2s conversation \n"
        for item in self._return_data:
            print item, "\t", self._return_data[item]
        
        return

    def test_create_s2s_conversation(self):
        print "\n test create s2s conversation \n"
        _api = "PP_CREATE_USER"
        _email = str(uuid.uuid1())[0:6] + "@ppmessage.com"
        _password = hashlib.sha1("123").hexdigest()
        _data = {
            "user_email": _email,
            "app_uuid": _get_config().get("team").get("app_uuid"),
            "is_service_user": True,
            "user_password": _password,
            "user_fullname": _email
        }
        self._prepare(_api)
        self._exec(_data)
        _user_uuid = self._get_return("uuid")

        _api = "PPCOM_CREATE_CONVERSATION"
        _data = {
            "user_uuid": _user_uuid,
            "conversation_type": CONVERSATION_TYPE.S2S,
            "member_list": [_get_config().get("user").get("user_uuid")],
            "app_uuid": _get_config().get("team").get("app_uuid")
        }
        self._prepare(_api)
        self._exec(_data)
        _conversation_uuid = self._get_return("uuid")

        print "Create a conversation, including 2 member(the creator and the other)"
        for item in self._return_data:
            print item, "\t", self._return_data[item]
        print "\n"

        # from the view of conversation creator
        _api = "PP_GET_CONVERSATION_INFO"
        _data = {
            "user_uuid": _user_uuid,
            "conversation_uuid": _conversation_uuid,
            "app_uuid": _get_config().get("team").get("app_uuid")
        }
        self._prepare(_api)
        self._exec(_data)
        print "This is how it looks like when creator get this conversation \n"
        for item in self._return_data:
            print item, "\t", self._return_data[item]
        print "\n"

        # from the view of other member(not creator) of this conversation
        _api = "PP_GET_CONVERSATION_INFO"
        _data = {
            "user_uuid": _get_config().get("user").get("user_uuid"),
            "conversation_uuid": _conversation_uuid,
            "app_uuid": _get_config().get("app").get("app_uuid")
        }
        self._prepare(_api)
        self._exec(_data)

        print "This is how it looks like when the other member get this conversation \n"
        for item in self._return_data:
            print item, "\t", self._return_data[item]
        
        return

def _test():
    unittest.main()
    
if __name__ == "__main__":
    _test()

