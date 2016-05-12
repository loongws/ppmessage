# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2015 YVertical.
# Ding Guijin, guijin.ding@yvertical.com
#

from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.bootstrap.data import BOOTSTRAP_DATA
from ppmessage.db.models import DeviceUser
from ppmessage.core.constant import OS

import tornado.httpclient
import traceback
import unittest
import uuid
import json
import redis
import hashlib
import logging

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
        TOKEN_URI = "http://localhost:8080/ppauth/token"
        body = self._create_body_string({
            "grant_type": "client_credentials",
            "client_id": BOOTSTRAP_DATA["PPCOM"]["api_key"],
            "client_secret": BOOTSTRAP_DATA["PPCOM"]["api_secret"]
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
        self._url = "http://localhost:8080/api/" + _cmd
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
                                    
    def test_create_p2s_conversation(self):
        print "\n test create p2s conversation \n"
        _api = "PP_CREATE_ANONYMOUS"
        _data = {
            "ppcom_trace_uuid": str(uuid.uuid1()),
            "app_uuid": BOOTSTRAP_DATA["team"]["app_uuid"]
        }
        self._prepare(_api)
        self._exec(_data)
        _user_uuid = self._get_return("user_uuid")

        _api = "PP_CREATE_DEVICE"
        _data = {
            "ppcom_trace_uuid": str(uuid.uuid1()),
            "device_ostype": OS.MAB,
            "user_uuid": _user_uuid,
            "app_uuid": BOOTSTRAP_DATA["team"]["app_uuid"],
        }
        self._prepare(_api)
        self._exec(_data)
        _device_uuid = self._get_return("device_uuid")

        _test_user_uuid = BOOTSTRAP_DATA["user"]["user_uuid"]        
        _api = "PPCOM_GET_DEFAULT_CONVERSATION"
        _data = {
            "user_uuid": _user_uuid,
            "device_uuid": _device_uuid,
            "app_uuid": BOOTSTRAP_DATA["team"]["app_uuid"]
        }
        self._prepare(_api)
        self._exec(_data)
                
        _api = "PP_GET_AMD_QUEUE_LENGTH"
        _data = {
            "app_uuid": BOOTSTRAP_DATA["team"]["app_uuid"]
        }
        self._prepare(_api)
        self._exec(_data)

        print("Amd queue len: %d" % self._get_return("length"))
        return
    
if __name__ == "__main__":
    unittest.main()

