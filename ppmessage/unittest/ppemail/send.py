# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2015 YVertical.
# Ding Guijin, guijin.ding@yvertical.com
#

from ppmessage.core.constant import REDIS_EMAIL_KEY

import json
import uuid
import redis
import hashlib
import logging
import unittest
import traceback
import tornado.httpclient

class TestSendCase(unittest.TestCase):
    def setUp(self):
        self._redis = redis.Redis(db=1)
        return

    def tearDown(self):
        pass

    def test_send(self):
        _request = {
            "to": ["dingguijin@gmail.com", "guijin.ding@ppmessage.com"],
            "subject": "Test Email body - %s" % str(uuid.uuid1()),
            "text": "Test Email text content",
            "html": "<html><body><div><p>Test Email Html Content</p></div></body></html>"
        }
        self._redis.rpush(REDIS_EMAIL_KEY, json.dumps(_request))
        return
        
if __name__ == "__main__":
    unittest.main()
