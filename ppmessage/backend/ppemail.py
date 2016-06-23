# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/ppemail.py 
#

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import REDIS_EMAIL_KEY

from ppmessage.core.constant import PP_WEB_SERVICE

from ppmessage.core.main import AbstractWebService
from ppmessage.core.singleton import singleton
from ppmessage.core.utils.config import get_config_email

import tornado.ioloop
import tornado.options

import requests
import logging
import redis
import json
import sys

global_email_config = {
    "service_type": "mailgun",
    "domain_name": "mg.ppmessage.com",
    "from_email": "service@ppmessage.com",
    "from_name": "PPMessage Service",
    "private_api_key": "key-7d5cf0ffe7c013db67b3f4af98108f3d",
}

class MailGunWorker():
    def __init__(self):
        return

    def config(self, email_config):
        self.domain_name = email_config.get("domain_name")
        self.api_url = "https://api.mailgun.net/v3/%s/messages" % self.domain_name
        self.from_email = email_config.get("from_email")
        self.from_name = email_config.get("from_name")
        self.private_api_key = email_config.get("private_api_key")
        if self.private_api_key == None or self.domain_name == None or \
           self.from_email == None or self.from_name == None:
            return None
        return email_config
    
    def work(self, email_request):
        logging.info("email_request: %s" % str(email_request))
        _to = email_request.get("to")
        if not isinstance(_to, list):
            logging.error("email to should be a list: %s" % str(type(_to)))
            return
        _subject = email_request.get("subject")
        _text = email_request.get("text")
        _html = email_request.get("html")
        _data = {
            "from": "%s <%s>" % (self.from_name, self.from_email),
            "to": _to,
            "subject": _subject,
            "text": _text,
        }
        if _html != None:
            _data["html"] = _html
        
        logging.info("sending email via: %s to: %s" % (self.api_url, " ".join(_to)))
        _r = requests.post(self.api_url, auth=("api", self.private_api_key), data=_data)
        logging.info(_r.json())
        return

class EmailWorker():
    def __init__(self, app):
        self.app = app
        self.service_mapping = {
            "mailgun": MailGunWorker            
        }
        return

    def work(self, email_request):
        _email = get_config_email()
        if _email == None:
            _email = global_email_config
        _type = _email.get("service_type")
        _worker_class = self.service_mapping.get(_type)
        if _worker_class == None:
            logging.error("No worker for the mail service: %s" % _service_name)
            return
        _worker_object = _worker_class(self)
        _worker_object.config(_email)
        _worker_object.work(email_request)
        return

@singleton
class PPEmailDelegate():
    def __init__(self, app):
        self.app = app
        self.redis = app.redis
        self.email_key = REDIS_EMAIL_KEY
        self.email_worker = EmailWorker(self)
        return
    
    def send(self):
        while True:
            _request = self.redis.lpop(self.email_key)
            if _request == None or len(_request) == 0:
                return
            _request = json.loads(_request)
            self.email_worker.work(_request)
        return

    def run_periodic(self):
        tornado.ioloop.PeriodicCallback(self.send, 1000).start() 
        return
    
class PPEmailWebService(AbstractWebService):

    @classmethod
    def name(cls):
        return PP_WEB_SERVICE.PPEMAIL

    @classmethod
    def get_handlers(cls):
        return []

    @classmethod
    def get_delegate(cls, app):
        return PPEmailDelegate(app)

class PPEmailApp():
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        return
    
    def get_delegate(self, name):
        return PPEmailDelegate(self)
    
def _main():
    tornado.options.parse_command_line()
    _app = PPEmailApp()
    _app.get_delegate("").run_periodic()
    # set the periodic check email request to send every 1000 ms
    logging.info("Email service starting...")
    tornado.ioloop.IOLoop.instance().start()
    return

if __name__ == "__main__":
    _main()
